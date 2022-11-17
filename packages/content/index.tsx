import { defineComponent, ref, onMounted } from "vue";
import "./style.scss"
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export default defineComponent({
    setup() {

        const editor = ref<Editor>()
        onMounted(() => {
            console.log("onMounted")
            editor.value = new Editor({
                extensions: [ StarterKit ],
                content: "",
                onUpdate: () => {
                    // emit('update:modelValue', editor.value?.getHTML())
                },
            })

            console.log("editor onMounted", editor)
        })

        return () => <EditorContent class="content" editor={editor.value} />
    }

})