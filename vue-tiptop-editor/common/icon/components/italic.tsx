
import { defineComponent } from "vue";

export default defineComponent({
    name:"italic-svg",
    setup() {
        return () => <svg width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h6M7 19h6m1-14l-4 14"/></svg>

    }
})

