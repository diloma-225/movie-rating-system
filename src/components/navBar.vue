<template>
  <div class="w-full flex justify-around items-center bg-blue-700 p-3">
    <h1 class="text-center text-white text-2xl uppercase">Movie App</h1>
    <div class="flex">
      <div class="flex flex-col">
        <input
          type="text"
          class="w-[300px] p-2 rounded-sm focus:outline-none mr-3"
          placeholder="Search by title"
          v-model="query"
          @keyup="search"
        />
        <span class="text-red-500">{{ error.titleInput }}</span>
      </div>

      <div class="w-auto flex flex-col">
        <input
          type="text"
          class="w-32 p-2 rounded-sm focus:outline-none mr-3"
          placeholder="Search by year"
          v-model="year"
          @keyup="search"
        />
        <span class="text-red-500">{{ error.yearInput }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@/stores/index";
import { ref, reactive } from "vue";
import axios from "axios";

const store = useStore();

const query = ref("");
const year = ref("");
const error = reactive({
  titleInput: "",
  yearInput: "",
});

const search = async () => {
  if (query.value != "" && year.value != "") {
    if (Number.isInteger(parseInt(year.value))) {
      error.yearInput = "";
      error.titleInput = "";
      await axios
        .get(`https://www.omdbapi.com/?apikey=80f8486&s=${query.value}&y=${year.value}`)
        .then((response) => {
          if (response.data.Response == "True") {
            const newMovies = ref([]);
            for (const movie of response.data.Search) {
              axios
                .get(`https://www.omdbapi.com/?apikey=80f8486&i=${movie.imdbID}`)
                .then((response) => {
                  newMovies.value.push(response.data);
                });
            }
            store.movies = newMovies.value;
          } else {
            store.movies = null;
          }
        });
    } else {
      error.yearInput = "Please enter a year";
    }
  } else if (query.value != "" && year.value == "") {
    error.yearInput = "";
    error.titleInput = "";
    await axios
      .get(`https://www.omdbapi.com/?apikey=80f8486&s=${query.value}`)
      .then((response) => {
        if (response.data.Response == "True") {
          const newMovies = ref([]);
          for (const movie of response.data.Search) {
            axios
              .get(`https://www.omdbapi.com/?apikey=80f8486&i=${movie.imdbID}`)
              .then((response) => {
                newMovies.value.push(response.data);
              });
          }
          store.movies = newMovies.value;
        } else {
          store.movies = null;
        }
      });
  } else {
    error.titleInput = "Title is required";
    /* await axios
      .get(`https://www.omdbapi.com/?apikey=80f8486&s=batman`)
      .then((response) => {
        if (response.data.Response == "True") {
          const newMovies = ref([]);
          for (const movie of response.data.Search) {
            axios
              .get(`https://www.omdbapi.com/?apikey=80f8486&i=${movie.imdbID}`)
              .then((response) => {
                newMovies.value.push(response.data);
              });
          }
          store.movies = newMovies.value;
        }
      }); */
  }
};
</script>
