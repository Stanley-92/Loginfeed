<template>
  <div class="min-h-screen bg-white-500 flex">
    <!-- Sidebar -->
    <aside class="w-35 bg-white p-6 border-r hidden lg:flex flex-col">
      <h1 class="text-4xl font-bold text-green-600 mb-6">
        
      <button @click="goToMainfeed">
      iFeed
    </button>
    </h1>
    </aside>

    <!-- Profile Section -->
    <div class="flex-1 max-w-xl mx-auto bg-white p-6">
      <!-- Header -->
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="font-bold">{{ currentUser.name }}</h2>
          <p class="text-xs text-gray-500">{{ currentUser.role }}</p>
        </div>
        <div class="flex items-center gap-4">
          <button @click="showEditModal =true">
          <Icon icon="mynaui:edit-one" class="w-5 h-5" /></button>
          <button><Icon icon="mdi:heart-outline" class="w-5 h-5" /></button>
          
          <!-- Avatar Upload Trigger -->
          <label class="cursor-pointer relative">
            <img :src="currentUser.avatar" class="w-20 h-20 rounded-full object-cover border" />
            <input type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
          </label>
        </div>
      </div>

      <!-- Bio & Stats -->
<p class="text-sm mb-2">Life is struggle love yourself.</p>



<!-- Follower Button Trigger -->
<div @click="toggleFollowerPopup" class="flex items-center gap-4 p-2 cursor-pointer  hover:text-blue-500" >
<button class="text-ms  gap-2 px-2 text-gray-400 hover:text-blue-500">{{ followers.length }} Followers</button>
<!-- Add Follower here  -->
</div>

<!-- Follower Popup Modal (Teleport to body) -->
<teleport to="body">
<div v-if="showFollowerPopup" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 "
 @click.self="toggleFollowerPopup">
<div class="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 relative">
  
<!-- Close Button -->
<button @click="toggleFollowerPopup" class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">

<Icon icon="ri:close-line"/>
</button>
<h2 class="text-xl font-medium-bold mb-4">Followers</h2>

<!-- Tabs -->
<div class="flex border-b mb-4">
<button
@click="switchTab('followers')"
:class="activeTab === 'followers' ? 'border-b-2 border-blue-500 text-green-600' : 'text-gray-600'"
class="flex-1 py-2 text-center font-semibold">
Followers
</button>
<button
@click="switchTab('following')"
:class="activeTab === 'following' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'"
class="flex-1 py-2 text-center font-semibold">
Following
</button>
</div>


<!-- Followers List -->
<div v-if="activeTab === 'followers'" class="space-y-3 max-h-64 overflow-y-auto">
<div
v-for="(user, index) in followers"
:key="'follower-' + index"
class="flex items-center gap-3 p-2 border rounded justify-between">
<div class="flex items-center gap-3">
<img :src="user.avatar" class="w-10 h-10 rounded-full" />
<span class="font-medium">{{ user.name }}</span>
</div>
<button class="px-3 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600">Following</button>
</div>
</div>


<!-- Following List -->
<div v-if="activeTab === 'following'" class="space-y-3 max-h-64 overflow-y-auto">
<div
v-for="(user, index) in following"
:key="'following-' + index"
class="flex items-center gap-3 p-2 border rounded justify-between">
<div class="flex items-center gap-3">
<img :src="user.avatar" class="w-10 h-10 rounded-full" />
<span class="font-medium">{{ user.name }}</span>
</div>
<button class="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Following</button>
</div>
</div>
</div>
</div>
</teleport>


      <p class="text-xs text-gray-400 mb-4">joined 2019</p>

      <!-- Save Profile Button -->
      <button
        @click="saveProfile"></button>
    

      <!-- Tabs -->
      <div class="flex justify-between border rounded-full overflow-hidden text-sm mb-4">
        <button class="flex-1 py-2 hover:bg-gray-100">Posts</button>
        <button class="flex-1 py-2 hover:bg-gray-100">Media</button>
        <button class="flex-1 py-2 hover:bg-gray-100">Videos</button>
      </div>

      <!-- SubTabs -->
      <div class="flex justify-around text-sm text-gray-500 mb-4">
        <button>Feed</button>
        <button>Replies</button>
        <button>Respost</button>
      </div>

      <!-- Post Input -->
      <div class="flex items-center border rounded-lg px-3 py-2 mb-4">
        <img :src="currentUser.avatar" class="w-8 h-8 rounded-full mr-3" />
        <input type="text" placeholder="New feed..." class="flex-1 outline-none" />
        <button class="text-sm text-blue-500">Post</button>
      </div>

      <!-- Complete Your Profile -->
      <p class="text-sm font-medium mb-3">Complete your profile</p>
      <div class="grid grid-cols-3 gap-3">
        <!-- Card 1 -->
        <div class="bg-gray-200 rounded-xl p-4 flex flex-col items-center text-center">
          <Icon icon="mdi:pencil-outline" class="w-8 h-8 mb-2" />
          <p class="text-xs mb-2">Share new feed<br />a recent highlightSLKDflsklksdlf</p>
          <button class="text-xs font-medium text-white bg-black px-3 py-1 rounded">Create Post</button>
        </div>

        <!-- Card 2 -->
        <div class="bg-gray-200 rounded-xl p-4 flex flex-col items-center text-center">
          <Icon icon="mdi:account-plus-outline" class="w-8 h-8 mb-2" />
          <p class="text-xs mb-2">Follow 10 profile<br />Find new friendsdfsasdlkfls;dfklsdfk</p>
          <button class="text-xs font-medium text-white bg-black px-3 py-1 rounded">View profile</button>
        </div>

        <!-- Card 3 -->
<div class="bg-gray-200 rounded-xl p-4 flex flex-col items-center text-center">
<Icon icon="mdi:pencil" class="w-8 h-8 mb-2" />
<p class="text-xs mb-2">Introduce yourself<br />and tell peoplewhat you're into.</p>
<button class="text-xs font-medium text-white bg-black px-3 py-1 rounded">Add</button>
 </div>




 </div>
 </div>
  </div>
  



  <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
  <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
    <button @click="showEditModal = false" class="absolute top-2 right-2 text-gray-500 hover:text-black">✕</button>
    <h2 class="text-xl font-bold mb-4">Edit Profile</h2>

    <!-- Avatar Upload -->
    <div class="flex items-center gap-4 mb-4">
      <label class="cursor-pointer relative">
        <img :src="currentUser.avatar" class="w-16 h-16 rounded-full object-cover border" />
        <input type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
      </label>
      <div>
        <p class="text-sm text-gray-500">Change Avatar</p>
      </div>
    </div>

    <!-- Name Input -->
    <input
      v-model="currentUser.name"
      type="text"
      placeholder="Your Name"
      class="w-full border rounded px-3 py-2 mb-4"
    />

    <!-- Save Button -->
    <button
      @click="saveProfile"
      class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full"
    >
      Save Changes
    </button>
  </div>
</div>

</template>
<script>

import { Icon } from '@iconify/vue'
import sinayun from '@/assets/mini.jpg'
import axios from 'axios'



export default {
  name: 'ProfilePage',
  components: {
    Icon
  },

  data() {
    return {
       // 👇 ADD THESE (Follower Popup)
    showFollowerPopup: false,
    activeTab: 'followers',
    followers: [
      { name: 'story5', avatar: '/images/default-avatar.jpg' },
      { name: 'story3', avatar: '/images/default-avatar.jpg' },
    ],
    following: [
      { name: 'mini1', avatar: '/images/default-avatar.jpg' },
      { name: 'mini3', avatar: '/images/default-avatar.jpg' },
    ],

      showEditModal: false,
      avatarFile: null,
      currentUser: {
        name: 'sinayun_xyn',
        role: 'Software Engineering',
        avatar: sinayun // Default avatar
      }
    }
  },
  

  mounted() {
    const userDataString = localStorage.getItem('newUserData')
    if (userDataString) {
      const userData = JSON.parse(userDataString)
      this.currentUser.name = `${userData.firstName} ${userData.lastName}`
      localStorage.removeItem('newUserData')
      localStorage.removeItem('verifyEmail')
    }
  },

  methods: {
    toggleFollowerPopup(){
      this.showFollowerPopup = !this.showFollowerPopup
    },
    switchTab(tab) {
    this.activeTab = tab
  },

  // ─────────────────────────
  // existing methods below
  onAvatarChange(event) {
    const file = event.target.files[0]
    if (file) {
      this.avatarFile = file
      this.currentUser.avatar = URL.createObjectURL(file)
    }
  },
   

    // Save profile (upload avatar + update user info)
    async saveProfile() {
      try {
        let uploadedAvatarUrl = this.currentUser.avatar

        // Upload avatar if changed
        if (this.avatarFile) {
          const formData = new FormData()
          formData.append('avatar', this.avatarFile)

          const uploadRes = await axios.post(
            'http://localhost:5000/api/upload-avatar',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )

          uploadedAvatarUrl = uploadRes.data.url
        }

        // Save profile info
        await axios.post('http://localhost:5000/api/update-profile', {
          name: this.currentUser.name,
          avatar: uploadedAvatarUrl
        })

        alert('Profile updated successfully!')
      } catch (err) {
        console.error(err)
        alert('Failed to update profile.')
      }
    },

    goToMainfeed() {
      this.$router.push({ name: 'Mainfeed' })
    }
  }
}
</script>
