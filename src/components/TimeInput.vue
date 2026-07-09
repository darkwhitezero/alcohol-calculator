<script setup lang="ts">
const time = defineModel<string>({ required: true })

defineProps<{
  timeError: string
}>()
</script>

<template>
  <div class="form-group">
    <label for="time">Прошло времени с начала употребления (часов)</label>
    <input
      id="time"
      v-model="time"
      type="number"
      min="0"
      max="72"
      step="0.5"
      :class="{ 'input-error': timeError }"
      :aria-invalid="!!timeError"
      :aria-describedby="timeError ? 'time-error' : 'time-helper'"
    >
    <span v-if="timeError" id="time-error" class="field-error" role="alert">{{ timeError }}</span>
    <span v-else id="time-helper" class="helper-text">Максимальная концентрация достигается через ~1 час</span>
  </div>
</template>
