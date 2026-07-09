// Тесты валидации формы: границы, пустые значения, NaN, отрицательные числа.
// Каждое поле должно давать своё конкретное сообщение, а не общее "ошибка".

import { describe, expect, it } from 'vitest'
import { createEmptyErrors, hasValidationErrors, validateForm } from './validation'
import type { Drink, FormInput } from './types'

function drink(id: string, volume: string, abv: string): Drink {
  return { id, label: 'test', volume, abv }
}

function baseInput(overrides: Partial<FormInput> = {}): FormInput {
  return {
    weight: '89',
    height: '184',
    time: '0',
    drinks: [drink('1', '100', '40')],
    ...overrides,
  }
}

describe('validateForm — вес', () => {
  it('валиден в пределах нормы', () => {
    expect(validateForm(baseInput({ weight: '89' })).weight).toBe('')
  })

  it('пустое значение даёт сообщение "Укажите вес"', () => {
    expect(validateForm(baseInput({ weight: '' })).weight).toBe('Укажите вес')
  })

  it('пробелы считаются пустым значением', () => {
    expect(validateForm(baseInput({ weight: '   ' })).weight).toBe('Укажите вес')
  })

  it('не число даёт сообщение про число', () => {
    expect(validateForm(baseInput({ weight: 'abc' })).weight).toBe('Вес должен быть числом')
  })

  it('ноль или отрицательное — "больше нуля"', () => {
    expect(validateForm(baseInput({ weight: '0' })).weight).toBe('Вес должен быть больше нуля')
    expect(validateForm(baseInput({ weight: '-10' })).weight).toBe('Вес должен быть больше нуля')
  })

  it('меньше минимума или больше максимума — сообщение с границами', () => {
    expect(validateForm(baseInput({ weight: '10' })).weight).toBe('Проверьте вес: от 30 до 750 кг')
    expect(validateForm(baseInput({ weight: '900' })).weight).toBe('Проверьте вес: от 30 до 750 кг')
  })

  it('граничные значения 30 и 750 валидны', () => {
    expect(validateForm(baseInput({ weight: '30' })).weight).toBe('')
    expect(validateForm(baseInput({ weight: '750' })).weight).toBe('')
  })
})

describe('validateForm — рост', () => {
  it('валиден в пределах нормы', () => {
    expect(validateForm(baseInput({ height: '184' })).height).toBe('')
  })

  it('пустое значение', () => {
    expect(validateForm(baseInput({ height: '' })).height).toBe('Укажите рост')
  })

  it('вне границ', () => {
    expect(validateForm(baseInput({ height: '50' })).height).toBe('Проверьте рост: от 100 до 300 см')
    expect(validateForm(baseInput({ height: '400' })).height).toBe('Проверьте рост: от 100 до 300 см')
  })
})

describe('validateForm — время', () => {
  it('пустое время валидно (считается как 0)', () => {
    expect(validateForm(baseInput({ time: '' })).time).toBe('')
  })

  it('отрицательное время — ошибка', () => {
    expect(validateForm(baseInput({ time: '-1' })).time).toBe('Время не может быть отрицательным')
  })

  it('не число — ошибка', () => {
    expect(validateForm(baseInput({ time: 'xx' })).time).toBe('Время должно быть числом')
  })

  it('больше максимума — ошибка', () => {
    expect(validateForm(baseInput({ time: '100' })).time).toBe('Проверьте время: максимум 72 ч')
  })

  it('ноль и обычные значения валидны', () => {
    expect(validateForm(baseInput({ time: '0' })).time).toBe('')
    expect(validateForm(baseInput({ time: '2.5' })).time).toBe('')
  })
})

describe('validateForm — напитки (объём)', () => {
  it('валидный объём', () => {
    const errors = validateForm(baseInput({ drinks: [drink('1', '500', '4.5')] }))
    expect(errors.drinks['1'].volume).toBe('')
  })

  it('пустой или нулевой объём — ошибка', () => {
    expect(validateForm(baseInput({ drinks: [drink('1', '', '40')] })).drinks['1'].volume).toBe('Укажите объём')
    expect(validateForm(baseInput({ drinks: [drink('1', '0', '40')] })).drinks['1'].volume).toBe(
      'Объём должен быть больше нуля',
    )
  })

  it('слишком большой объём — ошибка с границей', () => {
    expect(validateForm(baseInput({ drinks: [drink('1', '20000', '40')] })).drinks['1'].volume).toBe(
      'Проверьте объём: максимум 10000 мл',
    )
  })
})

describe('validateForm — напитки (крепость)', () => {
  it('крепость 0% валидна (безалкогольный вариант)', () => {
    expect(validateForm(baseInput({ drinks: [drink('1', '500', '0')] })).drinks['1'].abv).toBe('')
  })

  it('отрицательная крепость — ошибка', () => {
    expect(validateForm(baseInput({ drinks: [drink('1', '500', '-5')] })).drinks['1'].abv).toBe(
      'Крепость не может быть отрицательной',
    )
  })

  it('крепость больше 100% — ошибка', () => {
    expect(validateForm(baseInput({ drinks: [drink('1', '500', '150')] })).drinks['1'].abv).toBe(
      'Проверьте крепость: максимум 100%',
    )
  })

  it('несколько напитков валидируются независимо', () => {
    const errors = validateForm(
      baseInput({
        drinks: [drink('1', '500', '4.5'), drink('2', '-10', '40')],
      }),
    )
    expect(errors.drinks['1'].volume).toBe('')
    expect(errors.drinks['2'].volume).toBe('Объём должен быть больше нуля')
  })
})

describe('validateForm — числа вместо строк (реальность Vue 3.5 v-model)', () => {
  // Vue 3.4+ сам приводит значение <input type="number"> к типу number на
  // v-model, даже без модификатора .number — наши типы объявляют поля формы
  // строками, но в рантайме сюда прилетает настоящее число. Валидация не
  // должна падать в этом случае (раньше падала на raw.trim()).
  it('число вместо строки не ломает валидацию веса/роста/времени', () => {
    const errors = validateForm(baseInput({
      weight: 89 as unknown as string,
      height: 184 as unknown as string,
      time: 2.5 as unknown as string,
    }))
    expect(errors.weight).toBe('')
    expect(errors.height).toBe('')
    expect(errors.time).toBe('')
  })

  it('отрицательное число (не строка) в объёме корректно даёт ошибку', () => {
    const errors = validateForm(baseInput({
      drinks: [drink('1', -50 as unknown as string, '40')],
    }))
    expect(errors.drinks['1'].volume).toBe('Объём должен быть больше нуля')
  })
})

describe('hasValidationErrors / createEmptyErrors', () => {
  it('пустой набор ошибок не считается ошибочным', () => {
    expect(hasValidationErrors(createEmptyErrors())).toBe(false)
  })

  it('валидная форма не даёт ошибок', () => {
    expect(hasValidationErrors(validateForm(baseInput()))).toBe(false)
  })

  it('ошибка хотя бы в одном поле — hasValidationErrors true', () => {
    expect(hasValidationErrors(validateForm(baseInput({ weight: '' })))).toBe(true)
    expect(hasValidationErrors(validateForm(baseInput({ drinks: [drink('1', '-1', '40')] })))).toBe(true)
  })
})
