<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCountUp } from '../composables/useCountUp'
import { buildShareText, buildShareUrl, copyToClipboard, shareOrCopy } from '../lib/share'
import type { BacStatus, CalcResult, PersistedFormState } from '../lib/types'

const props = defineProps<{
  result: CalcResult | null
  status: BacStatus | null
  calculationCount: number
  formState: PersistedFormState
}>()

// Число "докручивается" от прошлого значения к новому, а не подменяется мгновенно.
// Заводится на уровне компонента (а не внутреннего :key-блока), поэтому корректно
// анимируется между пересчётами, даже когда сам result-box перемонтируется по key.
const targetPromille = computed(() => props.result?.promille ?? 0)
const displayedPromille = useCountUp(targetPromille)

// Отдельная планка сверху статуса, чтобы уровень опьянения читался с одного взгляда,
// не вчитываясь в текст. Шкала условно закрыта на 3 ‰ — дальше это уже край диапазона "тяжёлое отравление".
// Использует то же "докручивающееся" значение, что и число — бар и цифра едут синхронно.
const METER_CEILING = 3
const meterPercent = computed(() => Math.min(100, (displayedPromille.value / METER_CEILING) * 100))

const feedback = ref('')
let feedbackTimer: ReturnType<typeof setTimeout> | undefined

function showFeedback(text: string) {
  feedback.value = text
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => {
    feedback.value = ''
  }, 3000)
}

function currentShareText(): string | null {
  if (!props.result || !props.status) return null
  const url = buildShareUrl(props.formState)
  return buildShareText(props.result, props.status, url)
}

async function handleCopy() {
  const text = currentShareText()
  if (!text) return
  const ok = await copyToClipboard(text)
  showFeedback(ok ? 'Скопировано в буфер обмена' : 'Не удалось скопировать')
}

async function handleShare() {
  const text = currentShareText()
  if (!text) return
  const outcome = await shareOrCopy(text)
  if (outcome === 'shared') showFeedback('Готово!')
  else if (outcome === 'copied') showFeedback('Скопировано в буфер обмена')
  else showFeedback('Не удалось поделиться')
}
</script>

<template>
  <div
    v-if="result && status"
    :key="calculationCount"
    class="result-box show"
    role="status"
    aria-live="polite"
  >
    <div class="result-label">Концентрация алкоголя в крови составляет</div>
    <div class="result-value">{{ displayedPromille.toFixed(2) }} ‰</div>
    <div class="result-status" :class="status.className">{{ status.text }}</div>

    <div class="result-meter" aria-hidden="true">
      <div class="result-meter-fill" :style="{ width: meterPercent + '%' }" />
    </div>

    <div class="result-time">
      <template v-if="result.timeToSober > 0">
        Времени до полного вытрезвления:<br>
        <strong>~{{ Math.floor(result.timeToSober) }} ч {{ Math.round((result.timeToSober % 1) * 60) }} мин</strong>
      </template>
      <strong v-else style="color: var(--success, #4a4a4a);">Алкоголь выведен полностью</strong>
    </div>

    <div class="result-actions">
      <button type="button" class="btn btn-secondary" @click="handleCopy">
        Скопировать результат
      </button>
      <button type="button" class="btn btn-secondary" @click="handleShare">
        Поделиться
      </button>
    </div>
    <p class="share-feedback" role="status">{{ feedback }}</p>
  </div>
</template>
