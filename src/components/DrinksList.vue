<script setup lang="ts">
import type { Drink } from '../lib/types'
import DrinkItem from './DrinkItem.vue'

defineProps<{
  drinks: Drink[]
  drinkErrors: Record<string, { volume: string; abv: string }>
}>()

const emit = defineEmits<{
  add: []
  remove: [id: string]
  presetChange: [id: string, label: string]
}>()
</script>

<template>
  <section class="section">
    <h2 class="section-title">Выпитое</h2>

    <TransitionGroup name="drink-list" tag="div">
      <DrinkItem
        v-for="drink in drinks"
        :key="drink.id"
        :drink="drink"
        :volume-error="drinkErrors[drink.id]?.volume ?? ''"
        :abv-error="drinkErrors[drink.id]?.abv ?? ''"
        :can-delete="drinks.length > 1"
        @remove="(id) => emit('remove', id)"
        @preset-change="(id, label) => emit('presetChange', id, label)"
      />
    </TransitionGroup>

    <button type="button" class="btn btn-outlined btn-dashed" @click="emit('add')">
      <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
      Добавить еще напиток
    </button>
  </section>
</template>
