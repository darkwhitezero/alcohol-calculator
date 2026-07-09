// Общие типы калькулятора. Вынесены отдельно, чтобы ими могли пользоваться
// и логика расчёта (widmark.ts), и композаблы, и компоненты — без циклических импортов.

/** Пол — влияет на коэффициент распределения алкоголя по формуле Видмарка-Зайдля. */
export type Gender = 'male' | 'female'

/** Насколько заполнен желудок — влияет на скорость всасывания алкоголя. */
export type StomachFullness = 'empty' | 'snack' | 'full'

/** Один напиток в списке "выпитого". Поля хранятся строками — так их удобно
 *  привязывать к <input> через v-model без промежуточного форматирования. */
export interface Drink {
  id: string
  /** Название пресета (или "Свой вариант", если крепость введена вручную). */
  label: string
  /** Объём в миллилитрах. */
  volume: string
  /** Крепость в процентах. */
  abv: string
}

/** Готовый пресет напитка из выпадающего списка. */
export interface DrinkPreset {
  label: string
  abv: number
}

/** Статус опьянения с текстом и классом для подсветки. */
export interface BacStatus {
  text: string
  className: string
}

/** Итог расчёта: текущая концентрация и время до полного вытрезвления. */
export interface CalcResult {
  /** Концентрация алкоголя в крови, ‰. */
  promille: number
  /** Часы до полного выведения алкоголя (0, если уже трезв). */
  timeToSober: number
}

/** Входные данные для расчёта BAC. */
export interface CalcInput {
  gender: Gender
  /** Вес, кг. */
  weight: number
  /** Рост, см. */
  height: number
  stomach: StomachFullness
  drinks: Drink[]
  /** Часы, прошедшие с начала употребления. */
  elapsedHours: number
}

/** Состояние формы, которое сохраняем в localStorage и кладём в ссылку "поделиться". */
export interface PersistedFormState {
  gender: Gender
  weight: string
  height: string
  stomach: StomachFullness
  time: string
  drinks: Drink[]
}
