<template>
  <div>
    <nav-bar></nav-bar>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
import navBar from "./components/navBar.vue";
</script>
