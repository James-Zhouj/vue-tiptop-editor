import { defineComponent } from "vue";

export default defineComponent({
    name:"code-svg",
    setup() {
        return () => <svg width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M8.5 13.5L7 12l1.5-1.5m7 0L17 12l-1.5 1.5"/><circle cx="12" cy="12" r="9"/><path d="M13 9.5L11 15"/></g></svg>
    }
})