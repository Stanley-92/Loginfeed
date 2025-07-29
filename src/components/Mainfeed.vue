
<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Left Sidebar -->
    <aside class="w-64 p-6 bg-white border-r hidden lg:flex flex-col">
      <h1 class="text-2xl font-bold text-green-600 mb-4">iFeed</h1>
     <div class="relative mb-6">
        <div 
          class="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
          @click="handleSearch">
          <Icon icon="codex:search" class="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
        </div>

        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search"
          class="w-full border rounded px-3 py-2 pl-10 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
         @keyup.enter="handleSearch" />
      </div>
      <nav class="space-y-2 text-gray-700">
        <div class="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
          <Icon icon="charm:home"/> Home
        </div>
        <div class="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
        <Icon icon="mdi:heart-outline" />Notification
        </div>
        <div class="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
          <Icon icon="bxs:lock" /> Privacy
        </div>
        <div class="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
          <Icon icon="carbon:settings" />Setting
        </div>
        <div class="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
          <Icon icon="mdi:logout"/> Logout
        </div>
      </nav>
    </aside>   


<!-- Main Feed -->
<main class="flex-1 max-w-2xl mx-auto px-4 py-5">
    
 <div class="max-w-2xl mx-auto bg-white border rounded-xl shadow-sm p-6 relative">
    <!-- Scrollable Stories Container -->
    <div
      ref="storyScrollRef"
      class="flex items-center gap-3 overflow-x-auto scroll-smooth no-scrollbar relative"
    >
      <div
        v-for="(story, i) in stories"
        :key="story.id"
        class="flex flex-col items-center cursor-pointer flex-shrink-0"
        @click="openStory(i)" >
        <img
          :src="story.media"
          class="w-12 h-12 rounded-full border-2 border-purple-500 object-cover"
        />
     <span class="text-xs mt-1 text-gray-600 truncate w-12 text-center">
          {{ story.username }}
    </span>
    </div>
    </div>
    <!-- Left Arrow -->
    <button
      @click="scrollStories('left')"
      class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-1 rounded-full z-10"
    >
      <Icon icon="ic:round-chevron-left" class="w-5 h-5" />
    </button>

    <!-- Right Arrow -->
    <button
      @click="scrollStories('right')"
      class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-1 rounded-full z-10"
    >
      <Icon icon="ic:round-chevron-right" class="w-5 h-5" />
    </button>
  </div>





















<!--When  Post a Composer -->
<div class="bg-white p-4 rounded-xl shadow-sm mb-6" @dragover.prevent @drop.prevent="handleDrop">
  <!-- Avatar + Textarea -->
  <div class="flex items-start gap-3 mb-3">
    <img :src="currentUser.avatar" class="w-10 h-10 rounded-full border" />

    <textarea
      v-model="newPost"
      placeholder="What's on your mind?"
      class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
    ></textarea>
  </div>

  <!-- Action Icons + Post (Right aligned) -->
  <div class="flex justify-end items-center gap-4 text-gray-600 mb-3 px-2">
    <!-- Upload -->
    <label class="cursor-pointer" title="Upload Media">
      <Icon icon="mdi:image-outline" class="w-5 h-5" />
      <input type="file" accept="image/*,video/*" multiple class="hidden" @change="handleFileUpload" />
    </label>

    <!-- Emoji Picker -->
      <div class="relative" title="Insert Emoji">
        <button @click="toggleEmojiPicker">
        <Icon icon="mdi:emoticon-outline" class="w-5 h-5" />
        </button>
        <div v-if="showEmojiPicker" class="absolute z-50 top-8 right-0">
        <EmojiPicker @select="addEmoji" />
        </div>
        </div>
    <!-- Comment -->
    <button @click="toggleReplyComment" title="Comment">
      <Icon icon="iconamoon:comment" class="w-5 h-5" />
    </button>

    <!-- Location -->
    <button @click="getLocation" title="Location">
      <Icon icon="mynaui:location" class="w-5 h-5" />
    </button>

    <!-- Post -->
    <button class="text-sm font-semibold text-gray-700 hover:text-green-600" @click="submitPost">
      Post
    </button>
  </div>





<!-- Preview Modal for Media before  post  -->
  <div v-if="activePreview" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
    <div class="relative max-w-3xl w-full max-h-[90vh]">
      <button
        @click="closePreview"
        class="fixed top-6 right-6 z-50 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70"
      >
        <Icon icon="mdi:close" class="w-6 h-6" />
      </button>
      <component
        :is="activePreview.type.startsWith('video') ? 'video' : 'img'"
        :src="activePreview.url"
        class="w-auto max-w-full max-h-[90vh] object-contain mx-auto rounded-xl"
        controls
        autoplay
      />
    </div>
  </div>


<!-- Media Previews -->
  <div v-if="mediaPreviews.length" class="grid grid-cols-2 gap-2 mt-2">
  <div
    v-for="(file, index) in mediaPreviews"
    :key="index"
    class="relative group rounded-lg overflow-hidden border cursor-pointer"
    @click="openPreview(file)"
  >
    <component
      :is="file.type.startsWith('video') ? 'video' : 'img'"
      :src="file.url"
      class="w-full h-48 object-cover"
      controls
    />
    <button
      @click.stop="removeMedia(index)"
      class="relative">
      <Icon icon="mdi:close" class="w-4 h-4" />
    </button>
    </div>
    </div>
    </div> 
<!--When  Post a Composer -->
 







  <!-- Posts Feed -->
  <div v-for="(post, index) in posts" :key="post.id" class="bg-white border rounded-xl shadow-sm p-4 mb-6 relative">
    <!-- Post Header -->
   <div class="flex items-center justify-between mb-6">
  <!-- Avatar + User Info -->
  <div class="flex items-center gap-4">
    <img
      :src="post.avatar"
      alt="User Avatar"
      class="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm"/>
    <div>
      <h2 class="text-sm font-semibold text-gray-800">{{ post.user }}</h2>
      <p class="text-xs text-gray-400">{{ post.time }}</p>


      
  <!---Location text-->
      <p v-if="post.location" class="text-xs text-gray-400">  {{post.location }}</p>
      </div>
      </div>




  <!-- Three-dot Menu -->
  <div class="relative">
    <button
      @click="toggleMenu(index)"
      class="p-1 hover:bg-gray-100 rounded-full">
      <Icon icon="bi:three-dots" class="w-5 h-5 text-gray-600" />
    </button>







    <!-- Dropdown Menu -->
    <div
      v-if="activeMenuIndex === index"
      class="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
      <ul class="text-sm text-gray-700 py-2">
        <li
          @click="startEditPost(index)"
          class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">
          Edit Caption
          <Icon icon="lucide:edit" class="w-4 h-4"/>
          </li>
          <li
          @click="confirmDelete(index)"
          class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer">
          Delete Post
          <Icon icon="fluent:delete-32-regular" class="w-4 h-4" />
          </li>
          <li
          @click="OffComment(index)"
          class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">
          Off Comment
        <Icon icon="fluent:comment-off-48-regular" class="w-4 h-4" />
        </li>
         <li
          @click="copylink(index)"
          class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">
          Copy Link
        <Icon icon="ri:link" class="w-4 h-4" />
        </li>
         <li
          @click="shareTo(index)"
          class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"> 
          Share to...
        <Icon icon="ri:link" class="w-4 h-4" />
        </li>
        </ul>






<!----Open Model sent to frien-->
        <div v-if="showShareModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div class="bg-white w-96 p-6 rounded-xl shadow-xl relative">
    <button @click="showShareModal = false" class="absolute top-2 right-2">
      <Icon icon="mdi:close" class="w-5 h-5" />
    </button>
    <h2 class="text-lg font-semibold mb-4">Share this post</h2>
    <p>Post ID: {{ posts[activeSharedPostIndex]?.id }}</p>
 <!-- Add actual sharing buttons here -->
   </div>
   </div>
   </div>
   </div>
   </div>
<!-- Dropdown Menu buttonm-->






    <!-- Caption or Editable -->
        <div class="mb-4">
        <div v-if="editingIndex === index">
        <input v-model="editedCaption" class="w-full border px-3 py-1 rounded focus:outline-none" />
        <div class="text-right mt-1">
        <button class="text-green-600 text-sm font-semibold hover:underline mr-2" @click="saveEditedPost(index)">Save</button>
        <button class="text-gray-500 text-sm hover:underline" @click="cancelEdit">Cancel</button>
        </div>
        </div>
        <p v-else> {{ post.caption }}</p>
        </div>

   <!-- Photo Grid Media (No Scrollbar, Snap + Drag Scroll) -->
 <div
  ref="scrollContainer"
  class="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory cursor-pointer">
  <component
    v-for="(media, i) in post.media"
    :key="i"
    :is="media.type.startsWith('video') ? 'video' : 'img'"
    :src="media.url"
    class="w-48 h-64 object-cover rounded-xl flex-shrink-0 snap-start hover:brightness-75 transition"
    controls 
    @click="openMediaModal(media,post.media)"/>
    </div>




<!-- Media Fullscreen Viewer with Navigation -->

    <div
      v-if="selectedMedia"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <!-- Close -->
      <button
        @click="closeMediaModal"
        class="cursor-pointer absolute top-4 right-4 z-50 text-white bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80"
      >
        <Icon icon="mdi:close" class="w-6 h-6 text-white" />
      </button>

      <!-- Icon Prev -->
      <button
        v-if="selectedIndex > 0"
        @click.stop="prevMedia"
        class="cursor-pointer absolute left-4 top-1/2 z-50 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80"
      >
        <Icon icon="ooui:previous-ltr" class="w-6 h-6 text-white" />
      </button>

      <!-- Icon Next -->
      <button
        v-if="selectedIndex < activePostMedia.length - 1"
        @click.stop="nextMedia"
        class="cursor-pointer absolute right-4 top-1/2 -translate-y"
      >
        <Icon icon="ooui:next-ltr" class="w-6 h-6 text-white" />
      </button>

      <!-- Media Viewer -->
      <component
        :is="selectedMedia.type.startsWith('video') ? 'video' : 'img'"
        :src="selectedMedia.url"
        class="max-w-full max-h-[90vh] object-contain rounded-xl"
        controls
        autoplay
      />
    </div>
  
<!-- Media Fullscreen Viewer with Navigation -->











    <!-- Post Actions -->
    <div class="flex items-center gap-5 text-gray-500 text-sm mt-4 mb-10">
      <!-- Like -->
    <div class="flex items-center gap-4 cursor-pointer hover:text-red-500" @click="toggleLike(index)">

 <!--Heart Like RedColor-->
    <Icon :icon="post.liked ? 'fluent-color:heart-16' : 'mdi:heart-outline'" class="w-5 h-5" />
    <span>{{ formatCount(post.likes) }}</span>
    </div>
      <!-- Comment -->
    <div class="flex items-center gap-2 cursor-pointer hover:text-blue-500" @click="toggleComment(index)">
    <Icon icon="iconamoon:comment" class="w-5 h-5" />
    <span>{{ formatCount(post.commentsList?.length || 0) }}</span>
    </div>  
<!-- Share Button and Dropdown -->



<div class="relative">
    <button
    @click="toggleSharePopup(index)"
    class="flex items-center gap-1 hover:text-green-600">
    <Icon icon="bitcoin-icons:share-outline" class="w-5 h-5"/>
    </button>
<!-- Share Popup -->


  <div
    v-if="post.showShare"
    :ref="el => sharePopupRefs[index] = el"
    class="absolute right-0 bg-white border rounded-xl shadow-lg z-50 w-52 mt-2 p-3">
    
    <ul class="text-sm text-gray-700">
      <li
        class="hover:text-black cursor-pointer flex items-center gap-2 mb-2"
        @click="openSendModal">
        
        <Icon icon="hugeicons:sent-02" class="w-4 h-4  text-indigo-500" />
        Sent  Friend
      </li>
      <li
        class="hover:text-black cursor-pointer flex items-center gap-2 mb-2"
        @click="copyLink">
        <Icon icon="material-symbols:link" class="w-5 h-5" />
        Copy Link
      </li>
      <li
        class="hover:text-black cursor-pointer flex items-center gap-2 mb-2"
        @click="shareToFacebook"
      >
        <Icon icon="logos:facebook" class="w-5 h-5 text-blue-600" />
        Facebook
      </li>
      <li
        class="hover:text-black cursor-pointer flex items-center gap-2 mb-2"
        @click="shareToTelegram"
      >
        <Icon icon="logos:telegram" class="w-5 h-5 text-sky-500" />
        Telegram
      </li>
      <li
        class="hover:text-black cursor-pointer flex items-center gap-2"
        @click="shareToMessenger">

        <Icon icon="logos:messenger" class="w-5 h-5 text-indigo-500" />
        Messenger
      </li>
    </ul>
</div>
</div>
</div>




 <!-- Comment Box -->
  <div v-if="post.showComments" class="max-w-xl mx-auto px-4 py-6">
    <!-- View All Toggle -->
    <div
      class="text-gray-400 text-sm mb-2 cursor-pointer hover:underline"
      @click="post.viewAll = !post.viewAll"
    >
   View all {{ countTotalComments(post.commentsList) }} comments

    </div>

    <!-- Comment List -->
    <CommentCard
  v-for="(comment, i) in post.viewAll ? post.commentsList : post.commentsList.slice(0, 1)"
  :key="i"
  :comment="comment"
  :depth="0"
  :current-user="currentUser"
  @reply-added="updateCommentCount"
/>

    <!-- Add New Comment Input -->
    <div class="mt-3 flex gap-2 items-center">
      <img :src="post.avatar" class="w-8 h-8 rounded-full border" />
      <textarea
        v-model="post.newComment"
        placeholder="Add a comment..."
        class=" flex-1 px-3 py-2 text-sm bg-white rounded-xl resize-none focus:outline-none w-full border "
       
        @input="autoResize($event)"
        @keyup.enter.exact="addCommentToPost(index)">
      </textarea>
  </div>
  </div>
   </div>   
<!--When  Post a Composer Bottom -->




 </main>

   
   <!-- Right Sidebar Suggestions -->

  <aside class="w-72 bg-white border-l p-10 hidden xl:block sticky top-0 h-screen overflow-y-auto">
<!-- Profile Box with Heart Icon -->

<!-- Profile Box with Heart Icon -->
<div class="flex items-center justify-between mb-6">
  <div class="flex items-center gap-3">
    <img
      :src="currentUser.avatar"
      alt="Profile"
       class="w-14 h-14 rounded-full border-2 border-purple-600 object-cover shadow-md"
    />
    <div>
      <span class="font-medium text-gray-800">View profile</span>
      <p class="text-sm text-gray-500">{{ currentUser.name }}</p>
    </div>
  </div>

 <!-- Heart Button that redirects to Chat.vue -->
<button @click="toggleHeart" class="text-xl">
  <Icon
    :icon="isLiked ? 'mdi:heart' : 'mdi:heart-outline'"
    :class="isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'"
    class="w-6 h-6 transition"
  />
</button>
</div>



      
      <div class="flex justify-between items-center mb-10">
        <h2 class="font-semibold text-gray-800">Suggested for you</h2>
        <button class="text-sm text-gray-400 hover:text-blue-600">Show All</button>
      </div>
      <ul class="space-y-4">
        <li
          v-for="user in suggestedUsers"
          :key="user.id"
          class="flex items-start gap-3 hover:bg-gray-50 p-2 rounded"
        >
          <img
            :src="user.avatar"
            alt="suggested"
            class="w-10 h-10 rounded-full border-2 border-purple-600"
          />
          <div class="flex flex-col">
            <span class="text-sm font-medium text-blue-700">{{ user.username }}</span>
            <button class="mt-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition">
              Follow
            </button>
          </div>
        </li>
      </ul>
    </aside>



    <!-- Story Modal -->
    <div v-if="activeStory" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div class="relative w-[320px] h-[500px] bg-white rounded-lg overflow-hidden shadow-lg">
        <component
          :is="activeStory.type === 'video' ? 'video' : 'img'"
          :src="activeStory.media"
          class="w-full h-80 object-cover"
          v-bind="activeStory.type === 'video' ? { autoplay: true, muted: true, loop: true } : {}"
        />
        <div class="p-3 text-gray-800">
          <p class="text-sm font-semibold">{{ activeStory.username }}</p>
          <p class="text-xs text-gray-400">{{ activeStory.time }}</p>
        </div>
        <button @click="prevStory" class="absolute top-1/2 left-2 -translate-y-1/2 text-white">
          <Icon icon="weui:arrow-filled-left" class="w-6 h-6" />
        </button>
        <button @click="nextStory" class="absolute top-1/2 right-2 -translate-y-1/2 text-white">
          <Icon icon="weui:arrow-filled-right" class="w-6 h-6" />
        </button>
        <button @click="closeStory" class="absolute top-2 right-2 text-white">
         <Icon icon="material-symbols:close" class="w-5 h-5" />
        </button>
        </div>
       </div>
    </div>
 <!-- Story Modal -->
</template>
<script setup>

import { ref, watch, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import CommentCard from './CommentCard.vue'




import story1 from '@/assets/story1.jpg'
import story2 from '@/assets/story2.jpg'
import story3 from '@/assets/story3.jpg'
import story4 from '@/assets/story4.jpg'
import story5 from '@/assets/story5.jpg'
import sinayun from '@/assets/jeny3.jpg'
import aesp from '@/assets/aesp.jpg'








const newPost = ref('')
const showEmojiPicker = ref(false)
const mediaPreviews = ref([])
const activeStory = ref(null)
const currentStoryIndex = ref(null)
let autoCloseTimer = null
const activeMenuIndex = ref(null)
const editingIndex = ref(null)
const editedCaption = ref('')
const storyScrollRef = ref(null)
const sharePopupRefs = ref([])
const showShareModal = ref(false)
const activeSharedPostIndex = ref(null)
const showLocation = ref(false)
const postLocation = ref('')
const replyCommentVisible = ref(false)








let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const distance = touchEndX - touchStartX
  if (distance > 50) prevMedia()  // swipe right
  if (distance < -50) nextMedia() // swipe left
}


// Selected media modal state
const selectedMedia = ref(null)
const selectedIndex = ref(0)
const activePostMedia = ref([])

// Open media viewer
function openMediaModal(media, mediaList) {
  activePostMedia.value = mediaList
  selectedIndex.value = mediaList.findIndex((m) => m.url === media.url)
  selectedMedia.value = activePostMedia.value[selectedIndex.value]
}

// Close modal
function closeMediaModal() {
  selectedMedia.value = null
  selectedIndex.value = 0
  activePostMedia.value = []
}

// Go to next media
function nextMedia() {
  if (selectedIndex.value < activePostMedia.value.length - 1) {
    selectedIndex.value++
    selectedMedia.value = activePostMedia.value[selectedIndex.value]
  }
}

// Go to previous media
function prevMedia() {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
    selectedMedia.value = activePostMedia.value[selectedIndex.value]
  }
}
// Keyboard arrow support
const handleKeydown = (e) => {
  if (!selectedMedia.value) return

  if (e.key === 'ArrowRight') nextMedia()
  if (e.key === 'ArrowLeft') prevMedia()
  if (e.key === 'Escape') closeMediaModal()
}

// Register/unregister key listener only when modal is open
watch(selectedMedia, (newVal) => {
  if (newVal) {
    window.addEventListener('keydown', handleKeydown)
  } else {
    window.removeEventListener('keydown', handleKeydown)
  }
})


//Click Open photo before post
const activePreview = ref(null)

function openPreview(media) {
  activePreview.value = media
}

function closePreview() {
  activePreview.value = null
}
function removeMedia(index) {
  mediaPreviews.value.splice(index, 1)
}






// Open Modal after post and press next


const scrollContainer = ref(null)

const scrollStories = (direction) => {
  const container = storyScrollRef.value
  const amount = 150
  if (container) {
    container.scrollLeft += direction === 'right' ? amount : -amount
  }
}

const stories = [
  { id: 1, username: 'user_1', media: story1, type: 'image', time: '1h ago' },
  { id: 2, username: 'user_2', media: story2, type: 'video', time: '2h ago' },
  { id: 3, username: 'user_3', media: story3, type: 'image', time: '3h ago' },
  { id: 3, username: 'user_3', media: story3, type: 'image', time: '3h ago' },
  { id: 3, username: 'user_3', media: story3, type: 'image', time: '3h ago' },
  { id: 3, username: 'user_3', media: story3, type: 'image', time: '3h ago' },
  { id: 3, username: 'user_3', media: story3, type: 'image', time: '3h ago' },
  { id: 3, username: 'user_3', media: story3, type: 'image', time: '3h ago' },
  { id: 3, username: 'user_3', media: story3, type: 'image', time: '3h ago' },
  { id: 3, username: 'user_3', media: story3, type: 'image', time: '3h ago' },
]

const suggestedUsers = ref([
  { id: 1, avatar: sinayun, username: 'nita_lovekhmer' },
  { id: 2, avatar: story2, username: 'នារី_lovekhmer' },
  { id: 3, avatar: story3, username: 'Chakriya_konsreypov' },
  { id: 4, avatar: story4, username: 'ycn_lovekhm' },
  { id: 5, avatar: story5, username: 'Kon_Khmer' },
])

const currentUser = ref({
  name: 'sinayun_xyn',
  avatar: sinayun
})

const posts = ref([
  {
    id: 1,
    user: 'sinayun_xyn',
    avatar: aesp,
    caption: 'A design room for myself',
    media: [{ url: story5, type: 'image' }],
    time: '1h ago',
    likes: 0,
    shares: 0,
  },
  {
    id: 2,
    user: 'nayun_ndo',
    avatar: story2,
    caption: 'My girlfriend so cute ',
    media: [{ url: story3, type: 'image' }],
    time: '1m ago',
    likes: 999,
    shares: 0,
  },
])


const handleFileUpload = (e) => {
  const files = Array.from(e.target.files)
  mediaPreviews.value = files.map(file => ({
    url: URL.createObjectURL(file),
    type: file.type
  }))
}

const handleDrop = (e) => {
  const files = Array.from(e.dataTransfer.files)
  mediaPreviews.value = files.map(file => ({
    url: URL.createObjectURL(file),
    type: file.type
  }))
}

const addEmoji = (emoji) => {
  newPost.value += emoji.i
  showEmojiPicker.value = false
}

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const submitPost = () => {
  if (!newPost.value.trim() && !mediaPreviews.value.length) return
  posts.value.unshift({
    id: Date.now(),
    user: 'sinayun_xyn',
    avatar: sinayun,
    location: postLocation.value.trim(),
    caption: newPost.value,
    media: [...mediaPreviews.value],
    time: 'Just now',
    likes: 0,
    shares: 0,
    liked: false,
    showComments: false,
    showShare: false,
    newComment: '',      
    commentsList: [],
     

  })

   
  newPost.value = ''
  mediaPreviews.value = []
  showEmojiPicker.value = false
  postLocation.value =''
  showLocation.value = false

}

//Comment Reply 
const countTotalComments = (comments) => {
  let count = 0
  for (const comment of comments) {
    count++
    if (comment.replies?.length) {
      count += countTotalComments(comment.replies)
    }
  }
  return count
}




// Toggle Like
function toggleLike(index) {
  const post = posts.value[index]
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
  
}

// Toggle Comment visibility
function toggleComment(index) {
  posts.value[index].showComments = !posts.value[index].showComments
}

// Toggle Share Popup
function toggleSharePopup(index) {
  posts.value[index].showShare = !posts.value[index].showShare
}





//
posts.value = posts.value.map(post => ({
  ...post,
  liked: false,
  showComments: false,
  showShare: false,
  newComment: '',
  commentsList: post.commentsList || [],
  viewAll: false
}))



const addCommentToPost = (index) => {
  const post = posts.value[index]
  const text = post.newComment.trim()

  if (!text) return

  if (!Array.isArray(post.commentsList)) post.commentsList = []

  post.commentsList.push({
    user: currentUser.value.name,
    avatar: currentUser.value.avatar,
    text,
    liked: false,
    replies: []
  })

  post.newComment = ''
  
}

function autoResize(event) {
  const el = event.target
  el.style.height = 'auto' 
  el.style.height = el.scrollHeight + 'px' 
}



// 📍 Get real-time location
function getLocation() {
  showLocation.value = !showLocation.value
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(res => res.json())
        .then(data => {
          postLocation.value = data.address.city || data.address.town || 'Unknown'
        })
    })
  }
}

function formatCount(num) {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}
//Comment count Replies


const updateCommentCount = () => {
  // this will trigger a re-render if needed, or you can log for debug
  console.log('Reply added!')
}

const toggleMenu = (index) => {
  activeMenuIndex.value = activeMenuIndex.value === index ? null : index
}

const confirmDelete = (index) => {
  posts.value.splice(index, 1)
  activeMenuIndex.value = null
}

const startEditPost = (index) => {
  editingIndex.value = index
  editedCaption.value = posts.value[index].caption
  activeMenuIndex.value = null
}

const saveEditedPost = (index) => {
  posts.value[index].caption = editedCaption.value
  editingIndex.value = null
}

const cancelEdit = () => {
  editingIndex.value = null
}

// Story
const openStory = (index) => {
  currentStoryIndex.value = index
  activeStory.value = stories[index]
}

const closeStory = () => {
  activeStory.value = null
  clearTimeout(autoCloseTimer)
}

const nextStory = () => {
  if (currentStoryIndex.value < stories.length - 1) {
    openStory(currentStoryIndex.value + 1)
  } else {
    closeStory()
  }
}

const prevStory = () => {
  if (currentStoryIndex.value > 0) {
    openStory(currentStoryIndex.value - 1)
  }
}

watch(activeStory, (story) => {
  clearTimeout(autoCloseTimer)
  if (story) {
    autoCloseTimer = setTimeout(() => {
      nextStory()
    }, 5000)
  }
})




function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    alert('🔗 Link copied to clipboard!')
  })
}

function shareToFacebook() {
  const url = encodeURIComponent(window.location.href)
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
  window.open(fbUrl, '_blank', 'width=600,height=600')
}

function shareToTelegram() {
  const url = encodeURIComponent(window.location.href)
  const tgUrl = `https://t.me/share/url?url=${url}`
  window.open(tgUrl, '_blank', 'width=600,height=600')
}

function shareToMessenger() {
  const url = encodeURIComponent(window.location.href)
  const appId = 'YOUR_FACEBOOK_APP_ID' // optional, use if you have one
  const msgUrl = `https://www.messenger.com/dialog/send?link=${url}&app_id=${appId}&redirect_uri=${url}`
  window.open(msgUrl, '_blank', 'width=600,height=600')
}

function handleOutsideClick(event) {
  sharePopupRefs.value.forEach((refEl, index) => {
    if (refEl && !refEl.contains(event.target)) {
      posts.value[index].showShare = false
    }
  })
}


onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
onUnmounted(() => {
  clearTimeout(autoCloseTimer)
})
function OffComment(index) {
  posts.value[index].showComments = !posts.value[index].showComments
}
function copylink(index) {
  const postId = posts.value[index].id
  const postUrl = `${window.location.origin}/post/${postId}`

  navigator.clipboard.writeText(postUrl).then(() => {
    alert('✅ Link copied!')
  })
}
function shareTo(index) {
 
  activeSharedPostIndex.value = index
  showShareModal.value = true
}
function toggleReplyComment() {
  replyCommentVisible.value = !replyCommentVisible.value
}



const isLiked = ref(false)

const toggleHeart = () => {
  isLiked.value = !isLiked.value
}


//Scroll bar

</script>


<style scoped>
/* Hide scrollbar for all browsers */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/*comment css*/
textarea {
  overflow: hidden;
  resize: none;
}
</style>                  