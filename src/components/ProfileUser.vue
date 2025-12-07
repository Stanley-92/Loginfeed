<template>
  <div class="min-h-screen bg-gray-500 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white p-6 border-r hidden lg:flex flex-col">
      <h1 class="text-4xl font-bold text-green-600 mb-6">iFeed</h1>
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
            <img :src="currentUser.avatar" class="w-10 h-10 rounded-full object-cover border" />
            <input type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
          </label>
        </div>
      </div>

      <!-- Bio & Stats -->
      <p class="text-sm mb-2">Life is struggle love yourself.</p>
      <p class="text-xs text-gray-400">120k Follower</p>
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

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import sinayun from '@/assets/mini.jpg'
import axios from 'axios'
const showEditModal = ref(false)


const currentUser = ref({
  name: 'sinayun_xyn',
  role: 'Software Engineering',
  avatar: sinayun  // Default avatar
})

const avatarFile = ref(null)




// Handle Avatar File Change
function onAvatarChange(event) {
  const file = event.target.files[0]
  if (file) {
    avatarFile.value = file
    currentUser.value.avatar = URL.createObjectURL(file)  // Show Preview Immediately
  }
}

// Simulate Profile Save (Send avatar to backend)
async function saveProfile() {
  try {
    let uploadedAvatarUrl = currentUser.value.avatar

    // Upload Avatar if file selected
    if (avatarFile.value) {
      const formData = new FormData()
      formData.append('avatar', avatarFile.value)

      const uploadRes = await axios.post('https://your-backend.com/api/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      uploadedAvatarUrl = uploadRes.data.url
    }

    // Save updated profile info (Name + Avatar URL)
    await axios.post('https://your-backend.com/api/update-profile', {
      name: currentUser.value.name,
      avatar: uploadedAvatarUrl
    })

    alert('✅ Profile updated successfully!')
  } catch (err) {
    console.error(err)
    alert('❌ Failed to update profile.')
  }
}

</script>
