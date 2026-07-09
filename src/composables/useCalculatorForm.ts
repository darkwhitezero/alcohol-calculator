// Композабл держит всё состояние формы калькулятора: реактивные поля,
// валидацию и сам расчёт. Заменяет собой ручной state + renderDrinks()
// из исходного script.js — Vue сам синхронизирует DOM с этим состоянием.

import { computed, reactive, ref, watch } from 'vue'
import {
  DEFAULT_DRINK,
  DEFAULT_FORM,
  DRINK_PRESETS,
  MAX_ABV_PERCENT,
  MAX_HEIGHT_CM,
  MAX_WEIGHT_KG,
  NEW_DRINK_TEMPLATE,
} from '../lib/constants'
import { parseStateFromUrl } from '../lib/share'
import { loadFormState, saveFormState } from '../lib/storage'
import { calcBac, getBacStatus } from '../lib/widmark'
import type { BacStatus, CalcResult, Drink, Gender, PersistedFormState, StomachFullness } from '../lib/types'

let idCounter = 0
/** Простой генератор id напитка: время + счётчик, коллизии исключены. */
function generateDrinkId(): string {
  idCounter += 1
  return `${Date.now()}-${idCounter}`
}

const SAVE_DEBOUNCE_MS = 400

export function useCalculatorForm() {
  const gender = ref<Gender>(DEFAULT_FORM.gender)
  const weight = ref(DEFAULT_FORM.weight)
  const height = ref(DEFAULT_FORM.height)
  const stomach = ref<StomachFullness>(DEFAULT_FORM.stomach)
  const time = ref(DEFAULT_FORM.time)
  const drinks = reactive<Drink[]>([{ id: generateDrinkId(), ...DEFAULT_DRINK }])

  // Результат появляется только после нажатия «Рассчитать» — как и в исходной
  // версии, форма не пересчитывает промилле на лету при каждом нажатии клавиши.
  const result = ref<CalcResult | null>(null)
  const status = computed<BacStatus | null>(() =>
    result.value ? getBacStatus(result.value.promille) : null,
  )
  // Растёт при каждом успешном расчёте — используется как :key в ResultCard,
  // чтобы анимация появления проигрывалась заново даже при пересчёте.
  const calculationCount = ref(0)

  const errors = reactive({
    weight: false,
    height: false,
    drinkAbv: {} as Record<string, boolean>,
  })

  function addDrink() {
    drinks.push({ id: generateDrinkId(), ...NEW_DRINK_TEMPLATE })
  }

  function removeDrink(id: string) {
    if (drinks.length <= 1) return // всегда должен остаться хотя бы один напиток
    const index = drinks.findIndex((d) => d.id === id)
    if (index !== -1) drinks.splice(index, 1)
  }

  function applyPreset(id: string, presetLabel: string) {
    const preset = DRINK_PRESETS.find((p) => p.label === presetLabel)
    const drink = drinks.find((d) => d.id === id)
    if (preset && drink) {
      drink.label = presetLabel
      drink.abv = preset.abv.toString()
    }
  }

  function clearErrors() {
    errors.weight = false
    errors.height = false
    errors.drinkAbv = {}
  }

  function calculate() {
    clearErrors()

    const w = parseFloat(weight.value)
    const h = parseFloat(height.value)
    const t = parseFloat(time.value) || 0

    // Без веса/роста/напитков считать нечего — тихо выходим, как и раньше.
    if (!w || !h || drinks.length === 0) return

    let hasError = false

    if (w > MAX_WEIGHT_KG) {
      errors.weight = true
      hasError = true
    }
    if (h > MAX_HEIGHT_CM) {
      errors.height = true
      hasError = true
    }
    for (const drink of drinks) {
      const abv = parseFloat(drink.abv) || 0
      if (abv > MAX_ABV_PERCENT) {
        errors.drinkAbv[drink.id] = true
        hasError = true
      }
    }

    if (hasError) return

    result.value = calcBac({
      gender: gender.value,
      weight: w,
      height: h,
      stomach: stomach.value,
      drinks,
      elapsedHours: t,
    })
    calculationCount.value += 1
  }

  /** Текущее состояние формы в виде, пригодном для localStorage и ссылки "поделиться". */
  const persistedState = computed<PersistedFormState>(() => ({
    gender: gender.value,
    weight: weight.value,
    height: height.value,
    stomach: stomach.value,
    time: time.value,
    drinks: drinks.map((d) => ({ ...d })),
  }))

  function applyPersistedState(state: PersistedFormState) {
    gender.value = state.gender
    weight.value = state.weight
    height.value = state.height
    stomach.value = state.stomach
    time.value = state.time
    if (state.drinks.length > 0) {
      drinks.splice(0, drinks.length, ...state.drinks.map((d) => ({ ...d })))
    }
  }

  // Восстанавливаем форму: сначала пробуем ссылку "поделиться" (?state=...),
  // иначе — то, что сохранено с прошлого визита в localStorage.
  function hydrate() {
    const fromShareLink = parseStateFromUrl()
    const restored = fromShareLink ?? loadFormState()
    if (restored) applyPersistedState(restored)
  }
  hydrate()

  // Сохраняем форму в localStorage при любом изменении, с небольшой задержкой,
  // чтобы не писать на каждое нажатие клавиши.
  let saveTimer: ReturnType<typeof setTimeout> | undefined
  watch(
    persistedState,
    (state) => {
      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(() => saveFormState(state), SAVE_DEBOUNCE_MS)
    },
    { deep: true },
  )

  return {
    gender,
    weight,
    height,
    stomach,
    time,
    drinks,
    result,
    status,
    calculationCount,
    errors,
    persistedState,
    addDrink,
    removeDrink,
    applyPreset,
    calculate,
  }
}
