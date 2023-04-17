<template>
  <div class="w-full h-5/6 m-0">
    <img
      :src="movie.Poster"
      alt=""
      class="object-cover w-full h-full hover:cursor-pointer"
    />
  </div>
  <div>
    <vue3-star-ratings
      :showControl="false"
      starSize="16"
      :step="0"
      style="padding: 0; margin: 0; margin-top: 5px; width: 30%; display: flex"
      v-model="rating"
      @click="handleRate(rating, movie.imdbID)"
    />
    {{ rating }} / 5
  </div>
  <div class="mb-1">
    <span class="underline hover:cursor-pointer" @click="isShowReviews = !isShowReviews">
      Reviews({{ reviewsCount }})
    </span>
    <p v-for="review in movieReviews" v-if="isShowReviews">
      {{ review.text }}
    </p>
  </div>
  <div>
    <button
      class="p-1 bg-blue-900 rounded text-white"
      @click.prevent="isShowReviewInput = !isShowReviewInput"
    >
      add review
    </button>
  </div>
  <div v-if="isShowReviewInput">
    <textarea
      type="text"
      class="block border border-gray-500 mt-1 p-2 mb-1"
      v-model="text"
    />
    <span class="block text-green-500">{{ infoMessage }}</span>
    <button
      class="w-1/6 p-1 bg-green-900 rounded text-white"
      @click.prevent="addReview(movie.imdbID)"
    >
      send
    </button>
  </div>

  <h5 class="m-0 py-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
    {{ movie.Title.length > 20 ? movie.Title + " ..." : movie.Title }}
  </h5>
  <span class="text-orange-500">{{ movie.Year }}</span>
</template>
<script setup>
import { useStore } from "@/stores/index";
import { ref, computed } from "vue";
const props = defineProps({
  movie: {
    type: Object,
  },
});

const store = useStore();

const rating = ref(0);

const initStars = () => {
  store.ratings.some(function (el) {
    if (el.id === props.movie.imdbID) {
      rating.value = el.star;
    }
  });
};
initStars();

const handleRate = (starNumber, movieId) => {
  if (store.ratings.length > 0) {
    store.ratings.some(function (el) {
      if (el.id === props.movie.imdbID) {
        el.star = starNumber;
      } else {
        let newRating = {
          id: movieId,
          star: parseFloat(starNumber),
        };
        store.ratings.push(newRating);
      }
    });
  }
};

//Reviews
const isShowReviewInput = ref(false);
const isShowReviews = ref(false);
const text = ref("");
const infoMessage = ref("");

const movieReviews = computed({
  get() {
    let reviews = [];
    store.reviews.some(function (el) {
      if (el.id === props.movie.imdbID) {
        reviews.push(el);
      }
    });
    return reviews;
  },
});

const reviewsCount = computed({
  get() {
    let count = 0;
    store.reviews.some(function (el) {
      if (el.id === props.movie.imdbID) {
        count += 1;
      }
    });
    return count;
  },
});

const addReview = (movieId) => {
  infoMessage.value = "";
  let newReview = {
    id: movieId,
    text: text.value,
  };
  store.reviews.push(newReview);
  text.value = "";
  infoMessage.value = "Review added";
};
</script>
