import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Vuejsx from '@vitejs/plugin-vue-jsx'
import Unocss from "unocss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),Vuejsx(),Unocss()],
  build:{
    lib:{
      entry:"./packages/vue-tiptop-editor/index.ts",
      name:"vue-tiptop-editor",
      fileName:"vue-tiptop-editor"
    }
  }
})
