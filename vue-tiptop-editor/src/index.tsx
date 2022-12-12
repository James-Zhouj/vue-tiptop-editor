import { defineComponent, onMounted, provide, ref } from "vue";
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Header from "./components/header/header";
import Content from "./components/content/content";

import "../common/style/index.scss"

export default defineComponent({
    name:"vue-tiptop-editor",
    setup() {

        const editor = ref<Editor>()

        onMounted( () => {
            editor.value = new Editor({
                content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
                extensions: [
                StarterKit,
                ],
            })

            
        })


        return () => <div class="editor-container">
            <Header editor={editor}></Header>
            <Content editor={editor}></Content>
        </div>
    }
})