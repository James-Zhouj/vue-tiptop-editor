import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// import VueTiptopEditor from "../vue-tiptop-editor"
import VueTiptopEditor from "../vue-tiptop-editor"
// import VueTiptopEditor from "../build"
// import "../build/style.css"

createApp(App).use(VueTiptopEditor).mount('#app')
