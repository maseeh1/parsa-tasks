<script setup>
const props = defineProps({
  maxStars: {
    type: Number,
    default: 5,
  },
  initialRating: {
    type: Number,
    default: 0,
  },
  itemId: {
    type: [String, Number],
    required: true,
  },
});

const localKey = `rating-locked-${props.itemId}`;

const userHasVoted = ref(false);
const selectedRating = ref(0);
const averageRating = ref(props.initialRating);

const hoverRating = ref(0);

onMounted(() => {
  if (localStorage.getItem(localKey)) {
    userHasVoted.value = true;
  }
});

const stars = computed(() =>
  Array.from({ length: props.maxStars }, (_, i) => i + 1)
);

async function rate(value) {
  if (userHasVoted.value) return;

  selectedRating.value = value;
  userHasVoted.value = true;
  localStorage.setItem(localKey, "true");

  try {
    const res = await $fetch(
      `https://ylnk.site/test/?action=rate&id=${props.itemId}`,
      {
        method: "POST",
        body: { rate: value },
      }
    );
    if (res?.new_rating) {
      averageRating.value = res.new_rating;
    }
  } catch (e) {
    console.error("Rating failed:", e);
  }
}
</script>

<template>
  <div class="flex flex-col items-start">
    <div class="flex gap-x-1 m-1">
      <button
        v-for="star in stars"
        :key="star"
        :disabled="userHasVoted"
        @click="rate(star)"
        @mouseenter="!userHasVoted && (hoverRating = star)"
        @mouseleave="!userHasVoted && (hoverRating = 0)"
        :class="[
          'w-full h-full transition-colors',
          userHasVoted ? 'cursor-not-allowed' : 'cursor-pointer',
        ]"
        aria-label="Rate"
      >
        <svg
          width="23"
          height="21"
          viewBox="0 0 23 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="[
            hoverRating && !userHasVoted
              ? star <= hoverRating
                ? 'text-yellow-300'
                : 'text-gray-300'
              : star <= Math.floor(averageRating)
              ? 'text-yellow-400'
              : 'text-gray-300',
            'transition-colors',
          ]"
        >
          <path
            d="M21.8431 8.90972L17.1714 13.4637L18.2746 19.8957C18.2983 20.0336 18.2828 20.1754 18.2301 20.305C18.1773 20.4347 18.0894 20.5469 17.9762 20.6292C17.863 20.7114 17.729 20.7604 17.5894 20.7704C17.4498 20.7805 17.3102 20.7513 17.1864 20.6862L11.4099 17.6495L5.63412 20.6855C5.51026 20.7506 5.37065 20.7798 5.23108 20.7697C5.09151 20.7596 4.95754 20.7107 4.84432 20.6284C4.7311 20.5462 4.64315 20.4339 4.59041 20.3043C4.53766 20.1747 4.52224 20.0329 4.54587 19.895L5.64912 13.463L0.97662 8.90972C0.876329 8.81201 0.805394 8.68817 0.771845 8.55223C0.738297 8.41628 0.743474 8.27366 0.786792 8.14051C0.83011 8.00735 0.909838 7.88899 1.01695 7.7988C1.12406 7.70862 1.25428 7.65022 1.39287 7.63022L7.84962 6.69272L10.7371 0.841219C10.9899 0.328969 11.8299 0.328969 12.0826 0.841219L14.9701 6.69272L21.4269 7.63022C21.5651 7.65074 21.6949 7.70943 21.8017 7.79968C21.9085 7.88992 21.9879 8.00816 22.0312 8.14109C22.0744 8.27402 22.0797 8.41637 22.0465 8.55216C22.0133 8.68794 21.9428 8.81177 21.8431 8.90972Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
