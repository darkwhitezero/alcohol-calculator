<script setup lang="ts">
import type { StomachFullness } from '../lib/types'

const model = defineModel<StomachFullness>({ required: true })
</script>

<template>
  <div class="form-group">
    <label for="stomach">Наполненность желудка</label>
    <div class="select-wrapper">
      <svg
        class="select-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2v6a2 2 0 0 0 4 0V2" />
        <path d="M8 2v20" />
        <path d="M17 2c-1.7 0-3 2-3 5s1.3 5 3 5v10" />
      </svg>
      <select id="stomach" v-model="model">
        <option value="empty">Пустой</option>
        <option value="snack">Слегка перекусили</option>
        <option value="full">Полный (обед/ужин)</option>
      </select>
    </div>
  </div>
</template>
