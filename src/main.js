import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'



// ✅ Only import Tailwind CSS here (use correct name)
'@tailwindcss/postcss'  // or './assets/tailwind.css' if you named it that

createApp(App).use(router).mount('#app')
