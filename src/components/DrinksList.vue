<script setup lang="ts">
import type { Drink } from '../lib/types'
import DrinkItem from './DrinkItem.vue'

defineProps<{
  drinks: Drink[]
  drinkAbvErrors: Record<string, boolean>
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
        :abv-error="!!drinkAbvErrors[drink.id]"
        :can-delete="drinks.length > 1"
        @remove="(id) => emit('remove', id)"
        @preset-change="(id, label) => emit('presetChange', id, label)"
      />
    </TransitionGroup>

    <button type="button" class="btn btn-outlined btn-dashed" @click="emit('add')">
      <span class="btn-icon" aria-hidden="true">➕</span>
      Добавить еще напиток
    </button>
  </section>
</template>
