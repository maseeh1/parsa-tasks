<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4"
  >
    <h1 class="text-2xl font-semibold mb-6">Interview Tasks</h1>
    <nav class="flex flex-col gap-4 max-w-[400px]">
      <div class="flex flex-col">
        <NuxtLink
          to="/series/kaaenat"
          class="text-blue-600 text-center hover:underline"
          >Task 1 - Series Page</NuxtLink
        >
        <span class="text-gray-500 text-center"
          >⚠️ Please note: This task has been designed specifically for mobile
          view as per the instructions. For the best experience, kindly review
          it on a mobile device or in your browser’s mobile preview mode.</span
        >
      </div>
      <NuxtLink
        to="/video-player"
        class="text-blue-600 hover:underline text-center"
        >Task 2 - Video Player</NuxtLink
      >
      <NuxtLink to="/rating" class="text-blue-600 hover:underline text-center"
        >Task 3 - Rating Component</NuxtLink
      >
    </nav>
  </div>
</template>
