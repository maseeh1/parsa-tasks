<template>
  <div>
    <Rating :initial-rating="4.2" :item-id="2501" />
    <VideoPlayer />
  </div>
</template>

<script setup>
import Rating from "~/components/Rating.vue";
import VideoPlayer from "~/components/VideoPlayer.vue";
</script>
