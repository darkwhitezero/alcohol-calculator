// Чистая логика расчёта BAC (Blood Alcohol Content) по формуле Видмарка-Зайдля.
// Никакого DOM и побочных эффектов — только числа на входе и числа на выходе,
// поэтому логику легко покрыть тестами и она не зависит от Vue.

import {
  ELIMINATION_RATE_PER_HOUR,
  ETHANOL_DENSITY,
  RESORPTION_DEFICIT,
} from './constants'
import type { BacStatus, CalcInput, CalcResult, Drink, Gender } from './types'

/** Масса чистого этанола (г) во всех выпитых напитках. */
export function calcAlcoholMass(drinks: Drink[]): number {
  return drinks.reduce((total, drink) => {
    const volume = parseFloat(drink.volume) || 0
    const abv = parseFloat(drink.abv) || 0
    return total + volume * (abv / 100) * ETHANOL_DENSITY
  }, 0)
}

/**
 * Коэффициент распределения алкоголя по телу (r) — формула Видмарка-Зайдля.
 * Отличается для мужчин и женщин из-за разного соотношения мышечной/жировой массы.
 * Если формула даёт некорректное (неположительное) значение — подстраховываемся средним 0.6.
 */
export function calcDistributionCoeff(gender: Gender, weightKg: number, heightCm: number): number {
  const r =
    gender === 'male'
      ? 0.31608 - 0.004821 * weightKg + 0.004632 * heightCm
      : 0.31223 - 0.006446 * weightKg + 0.004466 * heightCm

  return r > 0 ? r : 0.6
}

/** Итоговый расчёт концентрации алкоголя в крови и времени до полного вытрезвления. */
export function calcBac(input: CalcInput): CalcResult {
  const { gender, weight, height, stomach, drinks, elapsedHours } = input

  const totalAlcoholMass = calcAlcoholMass(drinks)
  const resorptionDeficit = RESORPTION_DEFICIT[stomach] ?? 0
  const absorbedAlcohol = totalAlcoholMass * (1 - resorptionDeficit)

  const r = calcDistributionCoeff(gender, weight, height)

  let promille = absorbedAlcohol / (weight * r)

  if (elapsedHours > 0) {
    promille -= ELIMINATION_RATE_PER_HOUR * elapsedHours
  }
  if (promille < 0) {
    promille = 0
  }

  const timeToSober = promille > 0 ? promille / ELIMINATION_RATE_PER_HOUR : 0

  return { promille, timeToSober }
}

/** Текстовый статус и класс для подсветки по уровню промилле. */
export function getBacStatus(promille: number): BacStatus {
  if (promille === 0) {
    return { text: 'Трезвость', className: 'status-success' }
  }
  if (promille < 0.3) {
    return {
      text: 'Незначительное опьянение/допустимая норма (в РФ для водителей < 0.3)',
      className: 'status-success',
    }
  }
  if (promille <= 0.5) {
    return { text: 'Лёгкое опьянение', className: 'status-warning' }
  }
  if (promille <= 1.5) {
    return { text: 'Среднее опьянение', className: 'status-error' }
  }
  if (promille <= 2.5) {
    return { text: 'Сильное опьянение', className: 'status-danger' }
  }
  return { text: 'Тяжелое отравление', className: 'status-critical' }
}
