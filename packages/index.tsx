import { defineComponent, onMounted, ref } from "vue";
import "./index.scss"
import Header from "./header"
import Content from "./content"
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
export default defineComponent({
    setup() {



        const editor = ref<Editor>()
        onMounted(() => {
            console.log("onMounted")
            editor.value = new Editor({
                extensions: [ StarterKit, Highlight ],
                content: "",
                onUpdate: () => {
                    // emit('update:modelValue', editor.value?.getHTML())
                },
            })
            console.log("editor onMounted", editor)
        })

        return () => <div class="editor-container" style="height:300px">
            <Header class="editor-container__header" editor={editor.value}></Header>
            <Content class="editor-container___content" editor={editor.value}></Content>
        </div>
    }
})