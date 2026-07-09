<script setup lang="ts">
import type { Gender } from '../lib/types'

const gender = defineModel<Gender>('gender', { required: true })
const weight = defineModel<string>('weight', { required: true })
const height = defineModel<string>('height', { required: true })

defineProps<{
  weightError: boolean
  heightError: boolean
}>()

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Мужчина' },
  { value: 'female', label: 'Женщина' },
]
</script>

<template>
  <section class="section section-gray">
    <h2 class="section-title">Физиологические данные</h2>

    <div class="toggle-group" role="radiogroup" aria-label="Пол">
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
          :aria-invalid="weightError"
        >
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
          :aria-invalid="heightError"
        >
        <span class="helper-text">*Важно для расчета ИМТ</span>
      </div>
    </div>
  </section>
</template>
