<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = ref<Editor>()

onMounted( () => {
  editor.value = new Editor({
      content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
      extensions: [
        StarterKit,
      ],
    })
} ) 

</script>

<template>
<div style="border: 1px solid #eee;">
  <EditorContent :editor="editor"></EditorContent> 
</div> 
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
