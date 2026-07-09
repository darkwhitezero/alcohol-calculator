<script setup lang="ts">
import type { StomachFullness } from '../lib/types'

const model = defineModel<StomachFullness>({ required: true })
</script>

<template>
  <div class="form-group">
    <label for="stomach">Наполненность желудка</label>
    <div class="select-wrapper">
      <span class="select-icon" aria-hidden="true">🍽️</span>
      <select id="stomach" v-model="model">
        <option value="empty">Пустой</option>
        <option value="snack">Слегка перекусили</option>
        <option value="full">Полный (обед/ужин)</option>
      </select>
    </div>
  </div>
</template>
