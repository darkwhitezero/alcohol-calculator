// Сохранение состояния формы в localStorage — чтобы при следующем визите
// не приходилось заново вбивать вес/рост/напитки.

import type { Drink, PersistedFormState } from './types'

const STORAGE_KEY = 'buhlometr:form-state:v1'

/** Пытаемся прочитать сохранённое состояние. Если формат битый — просто возвращаем null,
 *  вызывающий код в этом случае откатится на значения по умолчанию. */
export function loadFormState(): PersistedFormState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return normalizePersistedState(JSON.parse(raw))
  } catch {
    return null
  }
}

export function saveFormState(state: PersistedFormState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage может быть недоступен (приватный режим, квота) — это не критично,
    // калькулятор продолжит работать просто без сохранения между визитами.
  }
}

/**
 * Проверяет и приводит к ожидаемой форме сырые данные из localStorage/URL.
 *
 * Важный нюанс: начиная с Vue 3.4, v-model на <input type="number"> сам
 * приводит значение к числу, даже без модификатора .number. Поля вроде
 * "вес"/"объём" в наших типах объявлены строками (так удобнее биндить к полям
 * ввода), поэтому здесь мы принимаем и число, и строку, и приводим к строке —
 * иначе после первого же редактирования поля валидация начала бы всегда
 * проваливаться и сохранённые данные молча терялись бы.
 */
export function normalizePersistedState(value: unknown): PersistedFormState | null {
  if (typeof value !== 'object' || value === null) return null
  const v = value as Record<string, unknown>

  if (v.gender !== 'male' && v.gender !== 'female') return null
  if (v.stomach !== 'empty' && v.stomach !== 'snack' && v.stomach !== 'full') return null
  if (!isStringable(v.weight) || !isStringable(v.height) || !isStringable(v.time)) return null
  if (!Array.isArray(v.drinks)) return null

  const drinks = v.drinks.map(normalizeDrink).filter((d): d is Drink => d !== null)
  if (drinks.length === 0) return null

  return {
    gender: v.gender,
    weight: String(v.weight),
    height: String(v.height),
    stomach: v.stomach,
    time: String(v.time),
    drinks,
  }
}

function normalizeDrink(value: unknown): Drink | null {
  if (typeof value !== 'object' || value === null) return null
  const d = value as Record<string, unknown>
  if (typeof d.id !== 'string' || typeof d.label !== 'string') return null
  if (!isStringable(d.volume) || !isStringable(d.abv)) return null

  return { id: d.id, label: d.label, volume: String(d.volume), abv: String(d.abv) }
}

function isStringable(value: unknown): value is string | number {
  return typeof value === 'string' || typeof value === 'number'
}
