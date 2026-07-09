// "Поделиться результатом": ссылка с параметрами расчёта + копирование текста.
// Ссылка позволяет открыть калькулятор с уже заполненными данными — удобно
// прислать другу воспроизводимый расчёт, а не просто скриншот.

import { normalizePersistedState } from './storage'
import type { BacStatus, CalcResult, PersistedFormState } from './types'

const PARAM_KEY = 'state'

/** Кодируем состояние формы в один query-параметр (JSON -> base64url). */
export function buildShareUrl(state: PersistedFormState): string {
  const encoded = encodeState(state)
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set(PARAM_KEY, encoded)
  return url.toString()
}

/** Пытаемся восстановить состояние формы из текущего URL. */
export function parseStateFromUrl(): PersistedFormState | null {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get(PARAM_KEY)
  if (!raw) return null

  try {
    return decodeState(raw)
  } catch {
    return null
  }
}

function encodeState(state: PersistedFormState): string {
  const json = JSON.stringify(state)
  // btoa работает с "бинарной строкой", поэтому сначала кодируем в UTF-8-safe вид
  return btoa(encodeURIComponent(json))
}

function decodeState(encoded: string): PersistedFormState | null {
  const json = decodeURIComponent(atob(encoded))
  return normalizePersistedState(JSON.parse(json))
}

/** Текст для копирования/шаринга — с деликатным дисклеймером про вождение. */
export function buildShareText(result: CalcResult, status: BacStatus, shareUrl: string): string {
  const promilleText = `${result.promille.toFixed(2)} ‰`
  const timeText =
    result.timeToSober > 0
      ? `~${Math.floor(result.timeToSober)} ч ${Math.round((result.timeToSober % 1) * 60)} мин до вытрезвления`
      : 'алкоголь уже выведен'

  return [
    `🍸 Бухлометр: ${promilleText} — ${status.text}`,
    timeText,
    '',
    'Ни в коем случае не садитесь за руль, даже если калькулятор показывает "0".',
    '',
    shareUrl,
  ].join('\n')
}

/** Копируем текст в буфер обмена. Возвращает true при успехе. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** На мобильных пробуем системный шаринг, иначе — просто копируем в буфер. */
export async function shareOrCopy(text: string): Promise<'shared' | 'copied' | 'failed'> {
  if (navigator.share) {
    try {
      await navigator.share({ text })
      return 'shared'
    } catch {
      // Пользователь закрыл диалог шаринга — это не ошибка, просто ничего не делаем.
      return 'failed'
    }
  }

  const copied = await copyToClipboard(text)
  return copied ? 'copied' : 'failed'
}
