import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import { presetUno, presetIcons } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),vueJsx(),Unocss({
    presets: [
      presetUno(),
      presetIcons({ /* options */ }),
      // ...other presets
    ],
  })],
  build:{
    lib:{
      entry:"./packages/index.tsx",
      name:"vue-tiptop-editor"
    }
  }
})
