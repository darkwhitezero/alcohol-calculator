<script setup lang="ts">
import gifSrc from '../assets/buhlometr.webp'
</script>

<template>
  <div class="header-wrapper">
    <img :src="gifSrc" alt="" class="header-gif" width="120" height="120">
    <h1 class="header">
      <!-- Бокал для мартини — контурная иконка вместо эмодзи 🍸 -->
      <svg
        class="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M4 4h16l-8 8-8-8Z" />
        <path d="M12 12v7" />
        <path d="M8 19h8" />
      </svg>
      Бухлометр
    </h1>
    <span class="header-byline">
      by
      <a href="https://github.com/darkwhitezero" target="_blank" rel="noopener">
        <!-- Официальный знак GitHub — залитый, это единственное исключение
             из контурного стиля остальных иконок. -->
        <svg class="icon-github" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-2.17c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.28 5.69.42.36.78 1.07.78 2.16v3.2c0 .3.2.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"
          />
        </svg>
        darkwhitezero
      </a>
    </span>
  </div>
</template>
