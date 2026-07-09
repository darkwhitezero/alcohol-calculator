import type { DrinkPreset } from './types'

// Пресеты напитков — те же значения, что были в исходном script.js,
// чтобы результаты расчёта не изменились после миграции.
export const DRINK_PRESETS: DrinkPreset[] = [
  { label: 'Свой вариант', abv: 0 },
  { label: 'Пиво светлое (4.5%)', abv: 4.5 },
  { label: 'Пиво крепкое (7%)', abv: 7 },
  { label: 'Вино (12%)', abv: 12 },
  { label: 'Шампанское (11%)', abv: 11 },
  { label: 'Ликер (20%)', abv: 20 },
  { label: 'Водка/Коньяк (40%)', abv: 40 },
  { label: 'Виски/Джин (40%)', abv: 40 },
]

/** Плотность этанола, г/мл — используется при расчёте массы чистого спирта. */
export const ETHANOL_DENSITY = 0.789

/** Скорость выведения алкоголя из крови, ‰ в час (среднестатистическое значение). */
export const ELIMINATION_RATE_PER_HOUR = 0.15

/** Дефицит резорбции (доля алкоголя, которая не всосётся) в зависимости от наполненности желудка. */
export const RESORPTION_DEFICIT: Record<string, number> = {
  empty: 0,
  snack: 0.1,
  full: 0.2,
}

/** Значения формы по умолчанию — так открывается калькулятор при первом визите. */
export const DEFAULT_FORM = {
  gender: 'male' as const,
  weight: '89',
  height: '184',
  stomach: 'empty' as const,
  time: '0',
}

export const DEFAULT_DRINK = {
  label: 'Водка/Коньяк (40%)',
  volume: '100',
  abv: '40',
}

export const NEW_DRINK_TEMPLATE = {
  label: 'Пиво светлое (4.5%)',
  volume: '500',
  abv: '4.5',
}

// Границы валидации — верхние были и раньше, нижние добавлены для более серьёзной проверки.
export const MIN_WEIGHT_KG = 30 // совпадает с HTML min на поле веса
export const MAX_WEIGHT_KG = 750
export const MIN_HEIGHT_CM = 100 // совпадает с HTML min на поле роста
export const MAX_HEIGHT_CM = 300
export const MAX_ABV_PERCENT = 100
export const MAX_VOLUME_ML = 10000
export const MAX_TIME_HOURS = 72
