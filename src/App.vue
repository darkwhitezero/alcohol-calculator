<script setup lang="ts">
import { useCalculatorForm } from './composables/useCalculatorForm'
import AppHeader from './components/AppHeader.vue'
import PhysioSection from './components/PhysioSection.vue'
import StomachSelect from './components/StomachSelect.vue'
import DrinksList from './components/DrinksList.vue'
import TimeInput from './components/TimeInput.vue'
import ResultCard from './components/ResultCard.vue'
import InfoAlert from './components/InfoAlert.vue'

const {
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
} = useCalculatorForm()
</script>

<template>
  <div class="app-container">
    <div class="card">
      <div class="card-content">
        <AppHeader />

        <PhysioSection
          v-model:gender="gender"
          v-model:weight="weight"
          v-model:height="height"
          :weight-error="errors.weight"
          :height-error="errors.height"
        />

        <StomachSelect v-model="stomach" />

        <hr class="divider">

        <DrinksList
          :drinks="drinks"
          :drink-abv-errors="errors.drinkAbv"
          @add="addDrink"
          @remove="removeDrink"
          @preset-change="applyPreset"
        />

        <hr class="divider">

        <TimeInput v-model="time" />

        <button type="button" class="btn btn-primary btn-large" @click="calculate">
          Рассчитать результат
        </button>

        <ResultCard
          :result="result"
          :status="status"
          :calculation-count="calculationCount"
          :form-state="persistedState"
        />

        <InfoAlert />
      </div>
    </div>
  </div>
</template>
