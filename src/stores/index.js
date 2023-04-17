
import { defineStore } from 'pinia'
import { ref } from 'vue';
export const useStore = defineStore('store', () => {
    const movies = ref([]);

    const ratings = ref([]);

    const reviews =  ref([]);

    return { movies, ratings, reviews }
  },{
    persist: true,
  })