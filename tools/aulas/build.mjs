// Monta uma aula em vídeo: cada frase vira um trecho (imagem + círculo de toque + voz).
// Uso: node build.mjs aula.json saida.mp4
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, join, resolve } from 'node:path'

const [specPath, outPath] = process.argv.slice(2)
const spec = JSON.parse(readFileSync(specPath, 'utf8'))
const base = dirname(resolve(specPath))
const work = join(base, 'work')
mkdirSync(work, { recursive: true })

const wingetRoot = 'C:/Users/User/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe'
const binDir = join(wingetRoot, readdirSync(wingetRoot).find((name) => name.startsWith('ffmpeg-')), 'bin')
const ffmpeg = (args) => execFileSync(join(binDir, 'ffmpeg.exe'), ['-y', '-loglevel', 'error', ...args], { cwd: work })
const duration = (file) =>
  Number(
    execFileSync(join(binDir, 'ffprobe.exe'), ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file])
      .toString()
      .trim(),
  )

const VOICE = spec.voice ?? 'pt-BR-ThalitaMultilingualNeural'
const RATE = spec.rate ?? '-8%'
const PAUSE = spec.pause ?? 0.55
const SCALE = 2
const CAPTION_H = 260
const WRAP = 30

copyFileSync('C:/Windows/Fonts/arialbd.ttf', join(work, 'font.ttf'))

const wrap = (text) => {
  const lines = ['']
  for (const word of text.split(' ')) {
    const last = lines.length - 1
    if ((lines[last] + ' ' + word).trim().length > WRAP) lines.push(word)
    else lines[last] = (lines[last] + ' ' + word).trim()
  }
  return lines.join('\n')
}

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('tempo esgotado')), ms))])

async function speak(text, file) {
  if (existsSync(file)) return
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const tts = new MsEdgeTTS()
      await withTimeout(tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3), 20000)
      const { audioStream } = tts.toStream(text, { rate: RATE })
      const parts = await withTimeout(
        (async () => {
          const chunks = []
          for await (const chunk of audioStream) chunks.push(chunk)
          return chunks
        })(),
        40000,
      )
      writeFileSync(file, Buffer.concat(parts))
      return
    } catch (error) {
      console.log(`  voz: tentativa ${attempt} falhou (${error.message})`)
    }
  }
  throw new Error(`sem voz para: ${text}`)
}

// Círculo rosa de "toque aqui", desenhado uma vez.
const ring = join(work, 'ring.png')
if (!existsSync(ring)) {
  ffmpeg([
    '-f', 'lavfi',
    '-i', "color=c=black:s=256x256:d=1,format=rgba,geq=r='255':g='0':b='136':a='if(lt(abs(hypot(X-128,Y-128)-112),8),255,if(lt(hypot(X-128,Y-128),104),70,0))'",
    '-frames:v', '1', ring,
  ])
}

const segments = []
for (const [index, beat] of spec.beats.entries()) {
  const hash = createHash('sha1').update(`${VOICE}|${RATE}|${beat.text}`).digest('hex').slice(0, 10)
  const audio = join(work, `v-${hash}.mp3`)
  console.log(`${index + 1}/${spec.beats.length} ${beat.text}`)
  await speak(beat.text, audio)

  const seconds = duration(audio) + PAUSE
  const rings = beat.rings ?? []
  const image = resolve(base, spec.images[beat.image])
  const inputs = ['-loop', '1', '-framerate', '25', '-t', String(seconds), '-i', image]
  for (let i = 0; i < rings.length; i++) inputs.push('-loop', '1', '-framerate', '25', '-t', String(seconds), '-i', ring)
  inputs.push('-i', audio)

  const filters = [`[0:v]crop=378:844:0:0,scale=${378 * SCALE}:${844 * SCALE}:flags=lanczos,setsar=1,format=yuv420p[b0]`]
  rings.forEach(([x, y, d], i) => {
    const size = `${d * SCALE}*(1+0.1*sin(2*PI*1.6*t))`
    filters.push(`[${i + 1}:v]scale=w='${size}':h='${size}':eval=frame,format=rgba[r${i}]`)
    filters.push(
      `[b${i}][r${i}]overlay=x='${x * SCALE}-w/2':y='${y * SCALE}-h/2':format=auto,format=yuv420p[b${i + 1}]`,
    )
  })
  const captionFile = `cap-${index}.txt`
  writeFileSync(join(work, captionFile), wrap(beat.text))
  filters.push(
    `[b${rings.length}]pad=${378 * SCALE}:${844 * SCALE + CAPTION_H}:0:0:color=0x141012,drawtext=fontfile=font.ttf:textfile=${captionFile}:fontcolor=white:fontsize=44:line_spacing=12:x=(w-text_w)/2:y=${844 * SCALE}+(${CAPTION_H}-text_h)/2,format=yuv420p[vout]`,
  )
  filters.push(`[${rings.length + 1}:a]pan=stereo|c0=c0|c1=c0,aresample=48000,apad=pad_dur=${PAUSE},atrim=0:${seconds},asetpts=PTS-STARTPTS[a]`)

  const segment = join(work, `s-${String(index).padStart(2, '0')}.mp4`)
  ffmpeg([
    ...inputs,
    '-filter_complex', filters.join(';'),
    '-map', '[vout]', '-map', '[a]',
    '-t', String(seconds),
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-r', '25', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-ar', '48000', '-b:a', '160k',
    segment,
  ])
  segments.push(segment)
}

const list = join(work, 'lista.txt')
writeFileSync(list, segments.map((file) => `file '${file.replaceAll('\\', '/')}'`).join('\n'))
ffmpeg([
  '-f', 'concat', '-safe', '0', '-i', list,
  '-c:v', 'copy',
  '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7',
  '-c:a', 'aac', '-ar', '48000', '-b:a', '160k',
  '-movflags', '+faststart',
  resolve(outPath),
])
console.log('pronto', resolve(outPath), duration(resolve(outPath)).toFixed(1) + 's')
