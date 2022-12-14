
import { defineComponent } from "vue";

export default defineComponent({
    name:"list-numbers-svg",
    setup() {
        return () => <svg width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01"/></svg>

    }
})

