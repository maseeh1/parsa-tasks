<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4"
  >
    <h1 class="text-2xl font-semibold mb-6">Interview Tasks</h1>
    <nav class="space-y-4 flex flex-col">
      <NuxtLink to="/series/kaaenat" class="text-blue-600 hover:underline"
        >Task 1 - Series Page</NuxtLink
      >
      <NuxtLink to="/video-player" class="text-blue-600 hover:underline"
        >Task 2 - Video Player</NuxtLink
      >
      <NuxtLink to="/rating" class="text-blue-600 hover:underline"
        >Task 3 - Rating Component</NuxtLink
      >
    </nav>
  </div>
</template>
