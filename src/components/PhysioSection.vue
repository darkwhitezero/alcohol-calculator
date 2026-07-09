<script setup lang="ts">
import { computed } from 'vue'
import type { Gender } from '../lib/types'

const gender = defineModel<Gender>('gender', { required: true })
const weight = defineModel<string>('weight', { required: true })
const height = defineModel<string>('height', { required: true })

defineProps<{
  weightError: string
  heightError: string
}>()

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Мужчина' },
  { value: 'female', label: 'Женщина' },
]

// Индекс выбранной опции — по нему едет плашка-индикатор переключателя.
const activeIndex = computed(() => GENDER_OPTIONS.findIndex((o) => o.value === gender.value))
</script>

<template>
  <section class="section section-gray">
    <h2 class="section-title">Физиологические данные</h2>

    <div
      class="toggle-group"
      role="radiogroup"
      aria-label="Пол"
      :style="{ '--toggle-options': GENDER_OPTIONS.length }"
    >
      <span
        class="toggle-indicator"
        aria-hidden="true"
        :style="{ transform: `translateX(${activeIndex * 100}%)` }"
      />
      <button
        v-for="option in GENDER_OPTIONS"
        :key="option.value"
        type="button"
        class="toggle-btn"
        :class="{ active: gender === option.value }"
        role="radio"
        :aria-checked="gender === option.value"
        @click="gender = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <div class="row">
      <div class="form-group">
        <label for="weight">Вес (кг)</label>
        <input
          id="weight"
          v-model="weight"
          type="number"
          min="30"
          max="750"
          :class="{ 'input-error': weightError }"
          :aria-invalid="!!weightError"
          :aria-describedby="weightError ? 'weight-error' : undefined"
        >
        <span v-if="weightError" id="weight-error" class="field-error" role="alert">{{ weightError }}</span>
      </div>
      <div class="form-group">
        <label for="height">Рост (см)</label>
        <input
          id="height"
          v-model="height"
          type="number"
          min="100"
          max="300"
          :class="{ 'input-error': heightError }"
          :aria-invalid="!!heightError"
          :aria-describedby="heightError ? 'height-error' : 'height-helper'"
        >
        <span v-if="heightError" id="height-error" class="field-error" role="alert">{{ heightError }}</span>
        <span v-else id="height-helper" class="helper-text">*Важно для расчета ИМТ</span>
      </div>
    </div>
  </section>
</template>
