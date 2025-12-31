<template>
  <div class="min-h-screen bg-gray-300 flex items-center justify-center">
    <div class="flex w-full max-w-6xl items-center justify-between px-8 gap-10">

      <!-- LEFT TEXT -->
<div class="flex-1 min-h-[100dvh] mt-8 bg-blue-100 ">
<aside >
<div class=" w-65 hidden md:block max-w-full">
<button class="flex-1 flex-col items-center text-sm item-center mt-4  inset-y-0 left-0 flex items-center pl-3 cursor-pointer ">
<Icon icon="tdesign:chat-bubble" 
class="w-14 h-14 text-white transition-colors bg-green-500 border-4 border-green-500 rounded-xl duration-200 hover:text-gray-600 mb-10" 
 @click="goToMainfeed"/>
</button>


<div class="flex items-center gap-4 ">
<p class="text-gray-600 leading-relaxed">
          Connect with the people in your life and the world. 
          Secure and safe sharing your activity.
        </p>
</div>


      <!-- ACTION + STORY STACK -->
      <div class="relative items-center mt-10 ">

        <!-- ACTION MENU -->
        <div class="flex flex-col gap-6 text-black">
          <div class="flex items-center gap-3">
            <Icon icon="" class="w-7 h-7" />
            <span class="text-xl font-semibold">Chat</span>
          </div>

          <div class="flex items-center gap-3">
            <Icon icon="" class="w-7 h-7" />
            <span class="text-xl font-semibold">Like</span>
          </div>

          <div class="flex items-center gap-3">
            <Icon icon="" class="w-7 h-7" />
            <span class="text-xl font-semibold">Comment</span>
          </div>

          <div class="flex items-center gap-3">
        <icon icon="uil:comment" class="w-10 h-10"/>
            <span class="text-xl font-semibold">Share</span>
          </div>
        </div>

      </div>

    <!-- CENTER STORY STACK -->
      <div class="relative   items-center w-[360px] h-[320px] mt-50  p-2 ">
        <img
          v-for="(story, i) in stories"
          :key="i"
          :src="story.img"
          class="story-card"
          :style="{
            transform: `rotate(${story.rotate})`,
            left: story.left,
            zIndex: story.z
          }"/>
        </div>
      
  
</div>

</aside>

</div>



        
 


      <!-- LOGIN FORM -->
      <div class="bg-gray p-8 rounded-lg shadow-md w-full max-w-sm border mb-50">
        <input
          type="text"
          placeholder="Email or Phone number"
          class="w-full mb-4 px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
          v-model="email"/>

        <input
          type="password"
          placeholder="Password"
          class="w-full mb-4 px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
          v-model="password" />

        <button
          class="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 mb-2"
          @click="login" >
          Login
        </button>

        <router-link
          to="/forgot-password"
          class="text-sm text-center text-gray-500 mb-4 block"
        >
          Forgot your password?
        </router-link>

        <hr class="mb-4" />

        <router-link to="/create" class="block">
          <button
            class="bg-green-600 text-white w-full py-2 rounded text-sm font-semibold hover:bg-green-700"
          >
            Create your account
          </button>
        </router-link>
      </div>


      

    </div>

   
  </div>


  
</template>

<script>
import { Icon } from '@iconify/vue';
import story1 from '@/assets/Khmer.jpg'
import story2 from '@/assets/jena8.jpg'
import story3 from '@/assets/sinayun_xyn.jpg'

import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { auth } from '../firebase'


export default {
  name: 'Login',
   components: { Icon },

  data() {
    return {
      email: '',
      password: '',
      loading: false,
      stories: [
        { img: story1, rotate: '12deg', left: '300px', z: 1},
        { img: story2, rotate: '-14deg', right: '70px', z: 2 },
        { img: story3, rotate: '-5deg', left: '168px', z: 1 }
      ]
    }
  },

  methods: {
    async login() {
      if (this.loading) return

      if (!this.email || !this.password) {
        alert('Please enter both email and password.')
        return
      }

      this.loading = true

      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        )

        //  Block access if email not verified
        if (!user.emailVerified) {
          await sendEmailVerification(user)
          alert('Verification email sent. Please verify before login.')
          return
        }

        //  Verified → go to feed
        this.$router.push('/feed')

      } catch (error) {
        console.error(error)
        alert(this.getErrorMessage(error.code))
      } finally {
        this.loading = false
      }
    },

    getErrorMessage(code) {
      const messages = {
        'auth/user-not-found': 'Account not found.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/too-many-requests': 'Too many attempts. Try again later.'
      }
      return messages[code] || 'Login failed. Please try again.'
    }
  }
}
</script>




<style scoped>

.input {
  @apply w-full mb-3 px-3 py-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500;
}

.btn-primary {
  @apply w-full bg-blue-600 text-white py-2 rounded font-semibold;
}

.btn-success {
  @apply w-full bg-green-600 text-white py-2 rounded text-sm font-semibold;
}
.story-card:hover {
  transform: translateY(-8px) scale(1.05);
  z-index: 50;
}
.story-card {
  @apply absolute top-0
  w-[240px] h-[360px]
  rounded-2xl
  object-cover
  shadow-[0_20px_40px_rgba(0,0,0,0.78)]
  transition-transform duration-300 ease-out;
}

/* Hover animation */
.story-card:hover {
  transform: translateY(-8px) scale(1.05) rotate(var(--tw-rotate));
}

.story-card:hover {
  transform: translateY(-8px) scale(1.05);
}

</style>