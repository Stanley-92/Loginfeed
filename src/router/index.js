import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import CreateAccount from '@/components/CreateAccount.vue'
import Verify from '@/components/Verify.vue'
import Mainfeed from '@/components/Mainfeed.vue'
import CommentCard from '@/components/CommentCard.vue'
import Chat from '@/components/Chat.vue'





const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/create', name: 'CreateAccount', component: CreateAccount },
  { path: '/verify', name: 'Verify', component: Verify},
  { path: '/feed', name: 'Mainfeed', component: Mainfeed },
  { path: '/comment', name: 'Comment', component: CommentCard},
    { path: '/chat', name: 'Chat', component: Chat},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
