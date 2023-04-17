import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vue3StarRatings from "vue3-star-ratings";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


import { createPinia } from 'pinia'

import './assets/main.css'


const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.component("vue3-star-ratings", vue3StarRatings);

app.use(router)

app.use(pinia)
app.mount('#app')
