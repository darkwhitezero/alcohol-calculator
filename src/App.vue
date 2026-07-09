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
        <AppHeader class="entrance" style="--entrance-index: 0" />

        <PhysioSection
          class="entrance"
          style="--entrance-index: 1"
          v-model:gender="gender"
          v-model:weight="weight"
          v-model:height="height"
          :weight-error="errors.weight"
          :height-error="errors.height"
        />

        <StomachSelect class="entrance" style="--entrance-index: 2" v-model="stomach" />

        <hr class="divider">

        <DrinksList
          class="entrance"
          style="--entrance-index: 3"
          :drinks="drinks"
          :drink-errors="errors.drinks"
          @add="addDrink"
          @remove="removeDrink"
          @preset-change="applyPreset"
        />

        <hr class="divider">

        <TimeInput class="entrance" style="--entrance-index: 4" v-model="time" :time-error="errors.time" />

        <button
          type="button"
          class="btn btn-primary btn-large entrance"
          style="--entrance-index: 5"
          @click="calculate"
        >
          Рассчитать результат
        </button>

        <ResultCard
          :result="result"
          :status="status"
          :calculation-count="calculationCount"
          :form-state="persistedState"
        />

        <InfoAlert class="entrance" style="--entrance-index: 6" />
      </div>
    </div>
  </div>
</template>
