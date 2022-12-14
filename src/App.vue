<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import { VueTiptopEditor }  from '../vue-tiptop-editor';

import { ref } from 'vue';

const value = ref("11")

const getValue = () => {
  console.log("value", value.value);
}


</script>

<template>
  <vue-tiptop-editor v-model="value"></vue-tiptop-editor>
  <button @click="getValue">获取值</button>
</template>

<style scoped>
</style>
