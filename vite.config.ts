// defineConfig берём из vitest/config — он расширяет тип конфига Vite полем
// `test`, иначе vue-tsc ругается на неизвестное свойство при проверке типов.
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// Проект живёт на GitHub Pages по адресу /alcohol-calculator/,
// поэтому base обязателен — иначе в проде не найдутся скрипты/стили/картинки.
export default defineConfig({
  base: '/alcohol-calculator/',
  plugins: [vue()],
  test: {
    environment: 'node',
  },
})
