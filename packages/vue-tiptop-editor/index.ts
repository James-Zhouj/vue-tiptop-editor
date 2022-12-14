import type { App } from 'vue'
import VueTiptopEditor from "./src"
import './types/indedx.d.ts'

VueTiptopEditor.install = function(app:App):void {
    app.component(VueTiptopEditor.name, VueTiptopEditor)
}

export {
    VueTiptopEditor
}

export default {
    install(app:App) {
        app.use(VueTiptopEditor as any)
    }
}
