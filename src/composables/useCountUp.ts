// Плавно "прокручивает" отображаемое число от предыдущего значения к новому —
// вместо мгновенной подмены текста. Чистый requestAnimationFrame, без библиотек.

import { onUnmounted, ref, watch, type Ref } from 'vue'

const DURATION_MS = 500

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Плавное замедление к концу — приятнее, чем линейная анимация.
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

/** Возвращает ref, который плавно "докручивается" до каждого нового значения `target`. */
export function useCountUp(target: Ref<number>): Ref<number> {
  const displayed = ref(target.value)
  let frameId: number | null = null

  function cancelAnimation() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
  }

  watch(target, (newValue) => {
    cancelAnimation()

    if (prefersReducedMotion()) {
      displayed.value = newValue
      return
    }

    const startValue = displayed.value
    const delta = newValue - startValue
    const startTime = performance.now()

    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / DURATION_MS)
      displayed.value = startValue + delta * easeOutCubic(progress)

      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        displayed.value = newValue // подстраховка от накопленной погрешности
        frameId = null
      }
    }

    frameId = requestAnimationFrame(step)
  })

  onUnmounted(cancelAnimation)

  return displayed
}
