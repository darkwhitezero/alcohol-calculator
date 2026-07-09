// Валидация формы калькулятора — чистые функции без Vue, поэтому легко
// покрываются юнит-тестами. Каждое поле получает своё конкретное сообщение
// об ошибке (а не просто "неверное значение"), пустая строка — поле валидно.

import {
  MAX_ABV_PERCENT,
  MAX_HEIGHT_CM,
  MAX_TIME_HOURS,
  MAX_VOLUME_ML,
  MAX_WEIGHT_KG,
  MIN_HEIGHT_CM,
  MIN_WEIGHT_KG,
} from './constants'
import type { Drink, FormInput, ValidationErrors } from './types'

/**
 * Начиная с Vue 3.4, v-model на <input type="number"> сам приводит введённое
 * значение к типу number, даже без модификатора .number (тот же нюанс, что уже
 * учтён в storage.ts). Наши типы объявляют поля формы строками — так удобнее
 * биндить к полям ввода, — но в рантайме сюда может прийти настоящее число.
 * Приводим к строке защитно, иначе `.trim()` упадёт на числах.
 */
function toTrimmedString(raw: string | number): string {
  return String(raw).trim()
}

function validateWeight(raw: string | number): string {
  const trimmed = toTrimmedString(raw)
  if (trimmed === '') return 'Укажите вес'

  const value = parseFloat(trimmed)
  if (Number.isNaN(value)) return 'Вес должен быть числом'
  if (value <= 0) return 'Вес должен быть больше нуля'
  if (value < MIN_WEIGHT_KG || value > MAX_WEIGHT_KG) {
    return `Проверьте вес: от ${MIN_WEIGHT_KG} до ${MAX_WEIGHT_KG} кг`
  }
  return ''
}

function validateHeight(raw: string | number): string {
  const trimmed = toTrimmedString(raw)
  if (trimmed === '') return 'Укажите рост'

  const value = parseFloat(trimmed)
  if (Number.isNaN(value)) return 'Рост должен быть числом'
  if (value <= 0) return 'Рост должен быть больше нуля'
  if (value < MIN_HEIGHT_CM || value > MAX_HEIGHT_CM) {
    return `Проверьте рост: от ${MIN_HEIGHT_CM} до ${MAX_HEIGHT_CM} см`
  }
  return ''
}

function validateTime(raw: string | number): string {
  const trimmed = toTrimmedString(raw)
  if (trimmed === '') return '' // пустое время = 0, это валидно

  const value = parseFloat(trimmed)
  if (Number.isNaN(value)) return 'Время должно быть числом'
  if (value < 0) return 'Время не может быть отрицательным'
  if (value > MAX_TIME_HOURS) return `Проверьте время: максимум ${MAX_TIME_HOURS} ч`
  return ''
}

function validateVolume(raw: string | number): string {
  const trimmed = toTrimmedString(raw)
  if (trimmed === '') return 'Укажите объём'

  const value = parseFloat(trimmed)
  if (Number.isNaN(value)) return 'Объём должен быть числом'
  if (value <= 0) return 'Объём должен быть больше нуля'
  if (value > MAX_VOLUME_ML) return `Проверьте объём: максимум ${MAX_VOLUME_ML} мл`
  return ''
}

function validateAbv(raw: string | number): string {
  const trimmed = toTrimmedString(raw)
  if (trimmed === '') return 'Укажите крепость'

  const value = parseFloat(trimmed)
  if (Number.isNaN(value)) return 'Крепость должна быть числом'
  if (value < 0) return 'Крепость не может быть отрицательной'
  // 0% — валидное значение (безалкогольный вариант), поэтому нижняя граница не строгая.
  if (value > MAX_ABV_PERCENT) return `Проверьте крепость: максимум ${MAX_ABV_PERCENT}%`
  return ''
}

function validateDrink(drink: Drink): { volume: string; abv: string } {
  return { volume: validateVolume(drink.volume), abv: validateAbv(drink.abv) }
}

/** Валидирует всю форму разом и возвращает объект с сообщениями по каждому полю. */
export function validateForm(input: FormInput): ValidationErrors {
  const drinks: Record<string, { volume: string; abv: string }> = {}
  for (const drink of input.drinks) {
    drinks[drink.id] = validateDrink(drink)
  }

  return {
    weight: validateWeight(input.weight),
    height: validateHeight(input.height),
    time: validateTime(input.time),
    drinks,
  }
}

/** Есть ли в результате валидации хотя бы одна непустая ошибка. */
export function hasValidationErrors(errors: ValidationErrors): boolean {
  if (errors.weight || errors.height || errors.time) return true
  return Object.values(errors.drinks).some((d) => d.volume || d.abv)
}

/** Пустой набор ошибок — используется для сброса состояния перед повторной проверкой. */
export function createEmptyErrors(): ValidationErrors {
  return { weight: '', height: '', time: '', drinks: {} }
}
