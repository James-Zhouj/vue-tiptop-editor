<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from "vue";
import VueTiptopEditor from "../packages/index"

const editorValue = ref("1111222222")

const getEditorValue = () => {
  console.log("提取内容", editorValue.value);
  
}
</script>

<template>
  <VueTiptopEditor v-model="editorValue"></VueTiptopEditor>
  <button @click="getEditorValue">提取富文本内容</button>
</template>

<style scoped>
</style>
