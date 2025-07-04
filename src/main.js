import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'

const app = createApp(App)

app.use(store)
app.use(router)

// Initialize auth state
store.dispatch('initAuth')

app.mount('#app')