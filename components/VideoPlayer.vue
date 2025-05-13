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
        class="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 text-sm flex flex-col gap-2"
        v-if="showControls"
      >
        <!-- Progress Bar -->
        <input
          type="range"
          min="0"
          :max="duration"
          step="0.1"
          v-model="currentTime"
          @input="seek"
          class="w-full hide-thumb accent-red-500 h-1"
        />

        <div class="flex items-center px-3 gap-4">
          <!-- Play/Pause -->
          <button @click="togglePlay" class="w-6">
            <span v-if="isPlaying">
              <svg
                width="13"
                height="16"
                viewBox="0 0 13 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0H5V16H0V0ZM8 0H13V16H8V0Z" fill="white" />
              </svg>
            </span>
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
          <!-- Volume -->

          <button class="w-6">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.00024 20.9995H12.0002L17.0002 25.9995V9.99949L12.0002 14.9995H8.00024V20.9995ZM19.0002 13.9995V21.9995C20.4802 21.3195 21.5002 19.7695 21.5002 17.9995C21.5002 16.2595 20.4802 14.7395 19.0002 13.9995ZM19.0002 11.2895C21.8902 12.1495 24.0002 14.8295 24.0002 17.9995C24.0002 21.1695 21.8902 23.8495 19.0002 24.7095V26.7695C23.0102 25.8595 26.0002 22.2795 26.0002 17.9995C26.0002 13.7195 23.0102 10.1395 19.0002 9.22949V11.2895Z"
                fill="white"
              />
            </svg>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model="volume"
            @input="setVolume"
            class="w-24 accent-red-500 h-1"
          />

          <!-- Time -->
          <span class="whitespace-nowrap grow">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </span>

          <!-- Subtitles -->
          <button @click="toggleSubtitles">
            {{ subtitleOn ? "CC On" : "CC Off" }}
          </button>

          <!-- Fullscreen -->
          <button @click="toggleFullscreen">
            <svg
              width="37"
              height="37"
              viewBox="0 0 37 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.6587 16.9785H12.6587V12.9785H16.6587V10.9785H10.6587V16.9785Z"
                fill="white"
              />
              <path
                d="M20.6584 10.9785V12.9785H24.6584V16.9785H26.6584V10.9785H20.6584Z"
                fill="white"
              />
              <path
                d="M24.6584 24.9785H20.6584V26.9785H26.6584V20.9785H24.6584V24.9785Z"
                fill="white"
              />
              <path
                d="M12.6587 20.9785H10.6587V26.9785H16.6587V24.9785H12.6587V20.9785Z"
                fill="white"
              />
            </svg>
          </button>
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
  }, 4000);
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
