import { defineComponent, ref, onMounted, PropType, computed } from "vue";
import "./style.scss"
import { Editor, EditorContent } from '@tiptap/vue-3'

export default defineComponent({
    props:{
        editor:{
            type: Object as PropType<Editor | undefined> ,
            required: true
        }
    },
    setup(props) {

        const _editor = computed( () => props.editor ) 

        
        return () => <EditorContent class="content" editor={_editor.value} />
    }

})