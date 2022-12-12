import { defineComponent, inject, onMounted, ref } from "vue";
import {Editor, EditorContent } from '@tiptap/vue-3'
export default defineComponent({
    props:{
        editor:{
            type: Object,
            required: true
        }
    },
    setup({editor}) {


        return () => <EditorContent class="editor-content" editor={editor.value} />

    }
})