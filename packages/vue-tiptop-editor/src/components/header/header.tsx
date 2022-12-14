import { defineComponent, inject, onMounted, PropType } from "vue";
import {Editor } from '@tiptap/vue-3'
// import BoldSvg from "../../../common/icon/components/bold"
import { BoldSvg, ItalicSvg, StrikethroughSvg, CodeSvg, HighlightSvg, H1Svg, H2Svg,H3Svg,H4Svg,H5Svg } from "../../../common/icon"



export default defineComponent({
    props:{
        editor:{
            type: Object,
            required: true
        }
    },
    setup({ editor }) {
        return () => <div class="editor-header">
            <BoldSvg onClick={() =>  editor.value.chain().focus().toggleBold().run()}></BoldSvg>
            <ItalicSvg onClick={() => editor.value.chain().focus().toggleItalic().run()}></ItalicSvg>
            <StrikethroughSvg onClick={ () => editor.value.chain().focus().toggleStrike().run()}></StrikethroughSvg>
            <CodeSvg onClick={ () => editor.value.chain().focus().toggleCodeBlock().run()}></CodeSvg>
            {/* <HighlightSvg onClick={ () =>  editor.value.chain().focus().toggleHighlight().run()}></HighlightSvg> */}
            <H1Svg onClick={ () => editor.value.chain().focus().toggleHeading({ level: 1 }).run()}></H1Svg>
            <H2Svg onClick={ () => editor.value.chain().focus().toggleHeading({ level: 2 }).run()}></H2Svg>
            <H3Svg onClick={ () => editor.value.chain().focus().toggleHeading({ level: 3 }).run()}></H3Svg>
            <H4Svg onClick={ () => editor.value.chain().focus().toggleHeading({ level: 4 }).run()}></H4Svg>
            <H5Svg onClick={ () => editor.value.chain().focus().toggleHeading({ level: 5 }).run()}></H5Svg>
        </div>
    }
})