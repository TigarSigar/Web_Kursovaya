const LATIN_TO_CYRILLIC_MAP: Record<string, string> = {
  A: 'А',
  B: 'В',
  C: 'С',
  E: 'Е',
  H: 'Н',
  K: 'К',
  M: 'М',
  O: 'О',
  P: 'Р',
  T: 'Т',
  X: 'Х',
  Y: 'У',
}

const ALLOWED_PLATE_LETTERS = new Set(['А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х'])

const LETTER_POSITIONS = new Set([0, 4, 5])

export const RUSSIAN_PLATE_PATTERN = /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/
export const MAX_CAR_IMAGE_SIZE_BYTES = 1_500_000
export const MAX_CAR_IMAGE_COUNT = 8

function normalizePlateCharacter(char: string): string {
  const upper = char.toUpperCase()
  return LATIN_TO_CYRILLIC_MAP[upper] ?? upper
}

export function normalizePlateNumberInput(rawValue: string): string {
  const normalized = rawValue
    .split('')
    .map((char) => normalizePlateCharacter(char))
    .join('')

  let result = ''

  for (const char of normalized) {
    const targetIndex = result.length
    if (targetIndex >= 9) {
      break
    }

    if (LETTER_POSITIONS.has(targetIndex)) {
      if (ALLOWED_PLATE_LETTERS.has(char)) {
        result += char
      }
      continue
    }

    if (/\d/.test(char)) {
      result += char
    }
  }

  return result
}

export function isValidRussianPlateNumber(value: string): boolean {
  return RUSSIAN_PLATE_PATTERN.test(normalizePlateNumberInput(value))
}
