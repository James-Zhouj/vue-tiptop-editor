import { computed, defineComponent, onMounted, onUnmounted, provide, ref } from "vue";
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Header from "./components/header/header";
import Image from '@tiptap/extension-image'

import "../common/style/index.scss"

export default defineComponent({
    name:"vue-tiptop-editor",
    props:{
        modelValue:{
            type: String,
            default:""
        }
    },
    emits:["update:modelValue"],
    setup(props,{emit}) {
        const editor = ref<Editor>()
        onMounted( () => {
            editor.value = new Editor({
                content: '<p></p>',
                extensions: [
                StarterKit,
                Image
                ],
                onUpdate({editor}) {
                    emit("update:modelValue", editor.getHTML())
                }
            })
        })
        onUnmounted( () => {
            editor.value?.destroy()
        })

        const bindValue = computed( () => props.modelValue )

        return () => <div class="editor-container">
            <Header editor={editor}></Header>
            <EditorContent v-model={bindValue.value} class="editor-content" editor={editor.value} />
        </div>
    }
})