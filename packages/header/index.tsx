import { defineComponent,computed , PropType } from "vue";
import "./style.scss"
import { Editor } from '@tiptap/vue-3'
export default defineComponent({
    props:{
        editor:{
            type: Object as PropType<Editor | undefined> ,
            required: true
        }
    },
    setup(props) {

        const _editor = computed( () => props.editor ) 

        const itemList = [
            {
                type: "button",
                className: "i-tabler:bold dark:i-carbon-moon",
                action: () => _editor.value?.chain().focus().toggleBold().run()
            },
            {
                type: "button",
                className: "i-tabler:italic",
                action: () => _editor.value?.chain().focus().toggleItalic().run()
            },
            {
                type: "button",
                className: "i-tabler:strikethrough",
                action: () => _editor.value?.chain().focus().toggleStrike().run()
            },
            {
                type: "button",
                className: "i-tabler:code",
                action: () => _editor.value?.chain().focus().toggleCode().run()
            },
            {
                type: "button",
                className: "i-tabler:highlight",
                action: () => _editor.value?.chain().focus().toggleHighlight().run()
            },
            {
                type: "div",
                className: "i-tabler:minus-vertical text-#0d0d0d1a"
            },
            {
                type: "button",
                className: "i-tabler:h-1",
                action: () => _editor.value?.chain().focus().toggleHeading({ level: 1 }).run()
            },
            {
                type: "button",
                className: "i-tabler:h-2",
                action: () => _editor.value?.chain().focus().toggleHeading({ level: 2 }).run()
            },
            {
                type: "button",
                className: "i-tabler:h-3",
                action: () => _editor.value?.chain().focus().toggleHeading({ level: 3 }).run()
            },
            {
                type: "button",
                className: "i-tabler:h-4",
                action: () => _editor.value?.chain().focus().toggleHeading({ level: 4 }).run()
            },
            {
                type: "button",
                className: "i-tabler:h-5",
                action: () => _editor.value?.chain().focus().toggleHeading({ level: 5 }).run()
            },
            {
                type: "div",
                className: "i-tabler:minus-vertical text-#0d0d0d1a"
            },
        ]

        return () => <div>
            {
                itemList.map(item => {
                    if(item.type === "button") {
                        return <button class={item.className} onClick={item.action}></button>
                    }
                    if(item.type === "div") {
                        return <div class={item.className}></div>
                    }
                    return
                })
            }
        </div>
    }
})