import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import "./index.scss"
import Header from "./header"
import Content from "./content"
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
export default defineComponent({
    props:{
        modelValue:{
            type: String,
            default:""
        }
    },
    emits: ['update:modelValue'],
    setup(props,{emit}) {
        const _modelValue = computed(() => props.modelValue)
        const editor = ref()
        onMounted(() => {
            console.log("onMounted")
            editor.value = new Editor({
                extensions: [ StarterKit, Highlight ],
                content: _modelValue.value,
                onUpdate: () => {
                    emit('update:modelValue', editor.value?.getHTML())
                },
            })
        })
        onBeforeUnmount( () => {
            editor.value?.destroy()
        })
        return () => <div class="editor-container" style="height:300px">
            <Header class="editor-container__header" editor={editor.value}></Header>
            <Content class="editor-container___content" editor={editor.value}></Content>
        </div>
    }
})