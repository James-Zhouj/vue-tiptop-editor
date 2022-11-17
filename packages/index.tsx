import { defineComponent, onMounted, ref } from "vue";
import "./index.scss"
import Header from "./header"
import Content from "./content"

export default defineComponent({
    setup() {
        return () => <div class="editor-container" style="height:300px">
            <Header class="editor-container__header"></Header>
            <Content class="editor-container___content"></Content>
        </div>
    }
})