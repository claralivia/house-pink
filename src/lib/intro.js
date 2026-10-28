const KEY = 'hp-intro'

let shownInMemory = false

const readStorage = () => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

const writeStorage = () => {
  try {
    sessionStorage.setItem(KEY, '1')
    return true
  } catch {
    return false
  }
}

export const readIntroSeen = () => shownInMemory || readStorage()

export const markIntroSeen = () => {
  shownInMemory = true
  writeStorage()
}
