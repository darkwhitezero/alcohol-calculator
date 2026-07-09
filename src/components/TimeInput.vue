<script setup lang="ts">
const time = defineModel<string>({ required: true })
</script>

<template>
  <div class="form-group">
    <label for="time">Прошло времени с начала употребления (часов)</label>
    <input id="time" v-model="time" type="number" min="0" max="72" step="0.5">
    <span class="helper-text">Максимальная концентрация достигается через ~1 час</span>
  </div>
</template>
