export default function HeroBlob() {
  return (
    <svg className="blob" viewBox="0 0 402 600" aria-hidden="true">
      <defs>
        <linearGradient id="hp-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF0088" />
          <stop offset="1" stopColor="#FF63B3" />
        </linearGradient>
      </defs>
      <path
        d="M60 250C20 130 120 20 236 38c120 18 160 130 140 250-14 90 24 150-30 240-70 112-226 90-286-30C32 420 84 340 60 250Z"
        fill="url(#hp-blob)"
      />
    </svg>
  )
}
