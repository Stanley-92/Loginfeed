import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Mainfeed from '@/views/Mainfeed.vue'
import ProfileUser from '@/views/ProfileUser.vue'
import CreateAccount from '@/components/CreateAccount.vue'
import Verify from '@/components/Verify.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import ChatPanel from '@/components/ChatPanel.vue'
import CommentCard from '@/components/CommentCard.vue'



const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/chat', name: 'Chat', component: ChatPanel },
  { path: '/comment', name: 'comment', component: CommentCard },
  { path: '/feed', name: 'Mainfeed', component: Mainfeed },
  { path: '/profile', name: 'profile', component: ProfileUser },
  { path: '/create', name: 'CreateAccount', component: CreateAccount },
  { path: '/verify', name: 'Verify', component: Verify },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },


]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
