import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'uno.css'

import VueTiptopEditor from "../packages/vue-tiptop-editor"
// import VueTiptopEditor from "../dist/vue-tiptop-editor.js"

createApp(App).use(VueTiptopEditor).mount('#app')
