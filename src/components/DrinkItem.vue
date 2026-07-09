<script setup lang="ts">
import { DRINK_PRESETS } from '../lib/constants'
import type { Drink } from '../lib/types'

// `drink` — это тот же реактивный объект, что лежит в общем массиве drinks
// в composable (не копия), поэтому v-model на его полях сразу обновляет
// состояние формы во всём приложении — без пробрасывания emit на каждое поле.
const props = defineProps<{
  drink: Drink
  abvError: boolean
  canDelete: boolean
}>()

const emit = defineEmits<{
  remove: [id: string]
  presetChange: [id: string, label: string]
}>()

function onPresetChange(event: Event) {
  const label = (event.target as HTMLSelectElement).value
  emit('presetChange', props.drink.id, label)
}
</script>

<template>
  <div class="drink-item">
    <button
      type="button"
      class="btn-delete"
      :disabled="!canDelete"
      title="Удалить напиток"
      :aria-label="`Удалить напиток: ${drink.label}`"
      @click="emit('remove', drink.id)"
    >
      ✕
    </button>
    <div class="drink-fields">
      <div class="form-group">
        <label :for="`preset-${drink.id}`">Вид напитка</label>
        <select :id="`preset-${drink.id}`" :value="drink.label" @change="onPresetChange">
          <option v-for="preset in DRINK_PRESETS" :key="preset.label" :value="preset.label">
            {{ preset.label }}
          </option>
        </select>
      </div>
      <div class="drink-row">
        <div class="form-group">
          <label :for="`volume-${drink.id}`">Объем (мл)</label>
          <input :id="`volume-${drink.id}`" v-model="drink.volume" type="number" min="0" max="10000">
        </div>
        <div class="form-group">
          <label :for="`abv-${drink.id}`">Крепость (%)</label>
          <input
            :id="`abv-${drink.id}`"
            v-model="drink.abv"
            type="number"
            min="0"
            max="100"
            step="0.1"
            :class="{ 'input-error': abvError }"
            :aria-invalid="abvError"
          >
        </div>
      </div>
    </div>
  </div>
</template>
