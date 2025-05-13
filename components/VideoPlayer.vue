<template>
  <div
    class="w-full max-w-4xl mx-auto relative bg-black rounded-lg overflow-hidden"
    @mousemove="showControlsTemporarily"
  >
    <video
      ref="videoRef"
      class="w-full h-auto bg-black"
      playsinline
      @click="togglePlay"
    ></video>

    <!-- Custom Controls -->
    <transition name="fade">
      <div
        v-if="showControls"
        class="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 text-sm flex flex-col gap-2"
      >
        <!-- Progress Bar -->
        <input
          type="range"
          min="0"
          :max="duration"
          step="0.1"
          v-model="currentTime"
          @input="seek"
          class="w-full accent-red-500"
        />

        <div class="flex items-center justify-between gap-4">
          <!-- Play/Pause -->
          <button @click="togglePlay" class="text-xl">
            <span v-if="isPlaying">⏸</span>
            <span v-else
              ><svg
                width="13"
                height="16"
                viewBox="0 0 13 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M-0.000732422 16L6.49927 12V4L-0.000732422 0V16ZM6.49927 12L12.9993 8L6.49927 4V12Z"
                  fill="white"
                />
              </svg>
            </span>
          </button>

          <!-- Time -->
          <span class="whitespace-nowrap">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </span>

          <!-- Volume -->
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model="volume"
            @input="setVolume"
            class="w-24"
          />

          <!-- Subtitles -->
          <button @click="toggleSubtitles">
            {{ subtitleOn ? "CC On" : "CC Off" }}
          </button>

          <!-- Fullscreen -->
          <button @click="toggleFullscreen">⛶</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Hls from "hls.js";

const videoRef = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const subtitleOn = ref(true);
const volume = ref(1);
const showControls = ref(true);
let controlsTimeout = null;

const videoUrl = ref("");
const subtitleUrl = ref("");

// Fetch video data and proxy it
onMounted(async () => {
  const { video_url, subtitle } = await $fetch(
    "https://ylnk.site/test/?action=stream&id=2501"
  );
  videoUrl.value = `/api/proxy?url=${encodeURIComponent(video_url)}&type=video`;
  subtitleUrl.value = `/api/proxy?url=${encodeURIComponent(
    subtitle
  )}&type=subtitle`;

  const video = videoRef.value;

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoUrl.value);
    hls.attachMedia(video);
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = videoUrl.value;
  }

  video.addEventListener("loadedmetadata", () => {
    duration.value = video.duration;
  });

  video.addEventListener("timeupdate", () => {
    currentTime.value = video.currentTime;
  });

  const track = document.createElement("track");
  track.kind = "subtitles";
  track.label = "English";
  track.srclang = "en";
  track.src = subtitleUrl.value;
  track.default = true;
  video.appendChild(track);
});

// Controls logic
function togglePlay() {
  const video = videoRef.value;
  if (!video) return;
  if (video.paused) {
    video.play();
    isPlaying.value = true;
  } else {
    video.pause();
    isPlaying.value = false;
  }
}

function seek(event) {
  videoRef.value.currentTime = event.target.value;
}

function setVolume(event) {
  videoRef.value.volume = volume.value;
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function toggleSubtitles() {
  const video = videoRef.value;
  if (!video || !video.textTracks.length) return;
  const track = video.textTracks[0];
  track.mode = subtitleOn.value ? "disabled" : "showing";
  subtitleOn.value = !subtitleOn.value;
}

function toggleFullscreen() {
  const videoContainer = videoRef.value.parentElement;
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// Hide controls after inactivity
function showControlsTemporarily() {
  showControls.value = true;
  clearTimeout(controlsTimeout);
  controlsTimeout = setTimeout(() => {
    showControls.value = false;
  }, 3000);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
