// Юнит-тесты чистой логики расчёта. Эталонные значения сверены вручную
// с поведением старой (ванильной) версии script.js — миграция не должна
// менять результат расчёта, только его устройство.

import { describe, expect, it } from 'vitest'
import { calcAlcoholMass, calcBac, calcDistributionCoeff, getBacStatus } from './widmark'
import type { Drink } from './types'

function drink(volume: string, abv: string): Drink {
  return { id: '1', label: 'test', volume, abv }
}

describe('calcAlcoholMass', () => {
  it('считает массу этанола для одного напитка', () => {
    // 100 мл водки 40%: 100 * 0.4 * 0.789 = 31.56
    expect(calcAlcoholMass([drink('100', '40')])).toBeCloseTo(31.56, 5)
  })

  it('суммирует несколько напитков', () => {
    const total = calcAlcoholMass([drink('500', '4.5'), drink('100', '40')])
    // 500*0.045*0.789 + 100*0.4*0.789 = 17.7525 + 31.56
    expect(total).toBeCloseTo(49.3125, 4)
  })

  it('игнорирует пустые/некорректные значения как 0', () => {
    expect(calcAlcoholMass([drink('', '')])).toBe(0)
  })
})

describe('calcDistributionCoeff', () => {
  it('считает коэффициент для мужчины по формуле Зайдля', () => {
    // 0.31608 - 0.004821*89 + 0.004632*184
    const r = calcDistributionCoeff('male', 89, 184)
    expect(r).toBeCloseTo(0.31608 - 0.004821 * 89 + 0.004632 * 184, 6)
  })

  it('считает коэффициент для женщины по формуле Зайдля', () => {
    const r = calcDistributionCoeff('female', 65, 165)
    expect(r).toBeCloseTo(0.31223 - 0.006446 * 65 + 0.004466 * 165, 6)
  })

  it('подстраховывается средним 0.6, если формула даёт неположительное значение', () => {
    // Экстремальный вес, чтобы формула ушла в минус
    const r = calcDistributionCoeff('male', 700, 100)
    expect(r).toBe(0.6)
  })
})

describe('calcBac', () => {
  it('считает промилле без учёта времени (t=0), как в дефолтном состоянии калькулятора', () => {
    // Дефолт из старого script.js: муж, 89кг, 184см, пустой желудок,
    // один напиток 100мл водки 40%, время 0.
    const result = calcBac({
      gender: 'male',
      weight: 89,
      height: 184,
      stomach: 'empty',
      drinks: [drink('100', '40')],
      elapsedHours: 0,
    })

    const r = 0.31608 - 0.004821 * 89 + 0.004632 * 184
    const expectedPromille = 31.56 / (89 * r)

    expect(result.promille).toBeCloseTo(expectedPromille, 6)
    expect(result.timeToSober).toBeCloseTo(expectedPromille / 0.15, 6)
  })

  it('учитывает наполненность желудка (резорбционный дефицит)', () => {
    const empty = calcBac({
      gender: 'male', weight: 89, height: 184, stomach: 'empty',
      drinks: [drink('100', '40')], elapsedHours: 0,
    })
    const full = calcBac({
      gender: 'male', weight: 89, height: 184, stomach: 'full',
      drinks: [drink('100', '40')], elapsedHours: 0,
    })
    // Полный желудок должен снижать промилле (дефицит 0.2 против 0)
    expect(full.promille).toBeLessThan(empty.promille)
  })

  it('вычитает выведенный алкоголь при t>0 и не уходит в минус', () => {
    const result = calcBac({
      gender: 'male', weight: 89, height: 184, stomach: 'empty',
      drinks: [drink('50', '5')], elapsedHours: 24, // заведомо много времени
    })
    expect(result.promille).toBe(0)
    expect(result.timeToSober).toBe(0)
  })

  it('без напитков даёт промилле 0', () => {
    const result = calcBac({
      gender: 'female', weight: 60, height: 170, stomach: 'empty',
      drinks: [], elapsedHours: 0,
    })
    expect(result.promille).toBe(0)
  })
})

describe('getBacStatus', () => {
  it.each([
    [0, 'Трезвость', 'status-success'],
    [0.15, 'Незначительное опьянение/допустимая норма (в РФ для водителей < 0.3)', 'status-success'],
    [0.4, 'Лёгкое опьянение', 'status-warning'],
    [1.0, 'Среднее опьянение', 'status-error'],
    [2.0, 'Сильное опьянение', 'status-danger'],
    [3.0, 'Тяжелое отравление', 'status-critical'],
  ])('%f ‰ -> %s', (value, text, className) => {
    const status = getBacStatus(value)
    expect(status.text).toBe(text)
    expect(status.className).toBe(className)
  })

  it('проверяет граничные значения диапазонов', () => {
    expect(getBacStatus(0.3).className).toBe('status-warning') // ровно 0.3 уже не "незначительное"
    expect(getBacStatus(0.5).className).toBe('status-warning') // включительно
    expect(getBacStatus(1.5).className).toBe('status-error') // включительно
    expect(getBacStatus(2.5).className).toBe('status-danger') // включительно
  })
})
