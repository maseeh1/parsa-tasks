<template>
  <div
    class="flex mt-12 h-full flex-col gap-4 w-full justify-center items-center"
  >
    <span
      >Here are four different rating components, each with a random ID and a
      different initial rating.</span
    >
    <Rating :initialRating="2" :itemId="1000"></Rating>
    <Rating :initialRating="4" :itemId="2244"></Rating>
    <Rating :initialRating="1" :itemId="1223"></Rating>
    <Rating :initialRating="5" :itemId="1234"></Rating>
  </div>
</template>

<script setup>
import Rating from "@/components/Rating.vue";
</script>

<style scoped></style>
