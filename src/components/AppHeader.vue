<script setup lang="ts">
import gifSrc from '../assets/buhlometr.webp'
</script>

<template>
  <div class="header-wrapper">
    <img :src="gifSrc" alt="" class="header-gif" width="120" height="120">
    <h1 class="header">
      <span class="icon" aria-hidden="true">🍸</span>
      Бухлометр
    </h1>
    <span class="header-byline">
      by <a href="https://github.com/darkwhitezero" target="_blank" rel="noopener">darkwhitezero</a>
    </span>
  </div>
</template>
