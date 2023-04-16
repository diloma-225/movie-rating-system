<template>
  <div class="p-5">
    <h1 class="text-3xl mb-5 uppercase">List of movies</h1>
    <div class="w-full mb-5">
      <div class="w-44">
        <label
          for="countries"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
          >Filter by genre</label
        >
        <select
          id="countries"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model="genre"
          @change="filterByGenre"
        >
          <option value="All">All</option>
          <option v-for="genre in genres" :value="genre">{{ genre }}</option>
        </select>
      </div>
    </div>

    <div class="w-full flex mb-5">
      <div class="w-auto mr-10">
        <label
          for="countries"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
          >Sorting By</label
        >
        <span class="mr-2"
          ><input type="radio" value="Year" v-model="sortings" /> year</span
        >
        <span class="mr-2"
          ><input type="radio" value="Rating" v-model="sortings" /> Rating</span
        >
        <span class="mr-2"
          ><input type="radio" value="Title" v-model="sortings" /> Title</span
        >
      </div>
      <div class="w-auto">
        <label
          for="countries"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
          >Sorting Order</label
        >
        <span class="mr-2"
          ><input type="radio" v-model="order" value="as" /> By asending</span
        >
        <span class="mr-2"
          ><input type="radio" v-model="order" value="ds" /> By deasending</span
        >
      </div>
    </div>

    <div class="w-full flex justify-around flex-wrap">
      <div class="w-full flex justify-around flex-wrap">
        <div
          class="w-full flex justify-center items-center h-80"
          v-if="store.movies === null || store.movies.length === 0"
        >
          <h1>Movies not found</h1>
        </div>
        <div class="w-full flex justify-center items-center h-80" v-if="isLoading">
          <img
            class="h-16 w-16"
            src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
            alt=""
          />
        </div>
        <div
          class="w-[30%] px-2 pt-2 pb-2 h-[500px] bg-white flex flex-col mb-5 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
          v-for="movie in store.movies"
          v-else
        >
          <div class="w-full h-5/6 m-0">
            <img
              :src="movie.Poster"
              alt=""
              class="object-cover w-full h-full hover:cursor-pointer"
            />
          </div>

          <h5
            class="m-0 py-2 text-md font-bold tracking-tight text-gray-900 dark:text-white"
          >
            {{ movie.Title.length > 20 ? movie.Title + " ..." : movie.Title }}
          </h5>
          <span class="text-orange-500">{{ movie.Year }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";
import { useStore } from "@/stores/index";
import { ref, onMounted, watch } from "vue";
import { isProxy, toRaw } from "vue";

const store = useStore();

const isLoading = ref(false);

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Musicals",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Sports",
  "Thriller",
  "Western",
];

const genre = ref("All");

const filterByGenre = () => {
  if (genre.value != "All") {
    const newMovies = ref([]);
    for (const movie of store.movies) {
      let movieGenres = movie.Genre.split(",");
      for (let index = 0; index < movieGenres.length; index++) {
        if (movieGenres[index].trim() == genre.value) {
          newMovies.value.push(movie);
        }
      }
    }

    store.movies = newMovies.value;
  }
};

const sortings = ref("");
const order = ref("as");

watch(sortings, (sortBy) => {
  if (sortBy == "Title") {
    if (order.value == "as") {
      var res = toRaw(store.movies).sort(function (a, b) {
        if (a.Title.toLowerCase() < b.Title.toLowerCase()) {
          return -1;
        }
        if (a.Title.toLowerCase() > b.Title.toLowerCase()) {
          return 1;
        }

        return 0;
      });
      store.movies = res;
    } else {
      var res = toRaw(store.movies).sort(function (a, b) {
        if (a.Title.toLowerCase() > b.Title.toLowerCase()) {
          return -1;
        }
        if (a.Title.toLowerCase() < b.Title.toLowerCase()) {
          return 1;
        }

        return 0;
      });
      store.movies = res;
    }
  } else if (sortBy == "Rating") {
    if (order.value == "as") {
      var res = toRaw(store.movies).sort(function (a, b) {
        return (
          parseFloat(a.Ratings[0].Value.split("/")[0]) -
          parseFloat(b.Ratings[0].Value.split("/")[0])
        );
      });
      store.movies = res;
    } else {
      var res = toRaw(store.movies).sort(function (a, b) {
        return (
          parseFloat(b.Ratings[0].Value.split("/")[0]) -
          parseFloat(a.Ratings[0].Value.split("/")[0])
        );
      });
      store.movies = res;
    }
  } else {
    if (order.value == "as") {
      var res = toRaw(store.movies).sort(
        (a, b) => parseFloat(a.Year) - parseFloat(b.Year)
      );
      store.movies = res;
    } else {
      var res = toRaw(store.movies).sort(
        (a, b) => parseFloat(b.Year) - parseFloat(a.Year)
      );
      store.movies = res;
    }
  }
});
watch(order, () => {
  if (sortings.value == "Title") {
    if (order.value == "as") {
      var res = toRaw(store.movies).sort(function (a, b) {
        if (a.Title.toLowerCase() < b.Title.toLowerCase()) {
          return -1;
        }
        if (a.Title.toLowerCase() > b.Title.toLowerCase()) {
          return 1;
        }

        return 0;
      });
      console.log(res);
    } else {
      var res = toRaw(store.movies).sort(function (a, b) {
        if (a.Title.toLowerCase() > b.Title.toLowerCase()) {
          return -1;
        }
        if (a.Title.toLowerCase() < b.Title.toLowerCase()) {
          return 1;
        }

        return 0;
      });
      store.movies = res;
    }
  } else if (sortings.value == "Rating") {
    if (order.value == "as") {
      var res = toRaw(store.movies).sort(function (a, b) {
        return (
          parseFloat(a.Ratings[0].Value.split("/")[0]) -
          parseFloat(b.Ratings[0].Value.split("/")[0])
        );
      });
      store.movies = res;
    } else {
      var res = toRaw(store.movies).sort(function (a, b) {
        return (
          parseFloat(b.Ratings[0].Value.split("/")[0]) -
          parseFloat(a.Ratings[0].Value.split("/")[0])
        );
      });
      store.movies = res;
    }
  } else {
    if (order.value == "as") {
      var res = toRaw(store.movies).sort(
        (a, b) => parseFloat(a.Year) - parseFloat(b.Year)
      );
      store.movies = res;
    } else {
      var res = toRaw(store.movies).sort(
        (a, b) => parseFloat(b.Year) - parseFloat(a.Year)
      );
      store.movies = res;
    }
  }
});

const sorting = () => {
  /* if (isProxy(store.movies)) {
    var res = toRaw(store.movies).sort(
      (a, b) => parseFloat(b.Metascore) - parseFloat(a.Metascore)
    );
    console.log(res);
  } */
};

onMounted(async () => {
  isLoading.value = true;
  await axios.get("https://www.omdbapi.com/?apikey=80f8486&s=batman").then((response) => {
    const newMovies = ref([]);
    for (const movie of response.data.Search) {
      axios
        .get(`https://www.omdbapi.com/?apikey=80f8486&i=${movie.imdbID}`)
        .then((response) => {
          newMovies.value.push(response.data);
        });
    }
    store.movies = newMovies.value;
    isLoading.value = false;
  });
});
</script>
