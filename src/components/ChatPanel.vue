<template>
 <div class="fixed top-0 right-0 h-full w-[400px] bg-white shadow-xl border-l border-gray-200 z-[9999] flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-center p-4 border-b">
    <button @click="$emit('close')" class="text-gray-400 hover:text-black">close</button>
    </div>

<!-- Current User -->
<div class="flex items-center gap-5 mb-5 px-5">
<img :src="currentUser.avatar" class="w-10 h-10 rounded-full border-2 border-purple-600" />
<div>
 <p class="font-semibold text-sm">{{ currentUser.name }}</p>
 <p class="text-xs text-gray-400">{{ currentUser.role }}</p>
</div>
</div>

<!-- Search Bar -->
<div class="relative mb-5 px-5">
<input
v-model="searchQuery"
type="text"
placeholder="Search Friend..."
class="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-1 "/>
<Icon icon="mdi:magnify" class="absolute left-7 top-2.5 text-gray-400 w-4 h-4" />
</div>

<!-- FRIEND LIST or CHAT THREAD VIEW --> 
  <div v-if="!chatStarted" class="space-y-3 overflow-y-auto px-4">
  <div
  v-for="friend in filteredFriends"
  :key="friend.id"
  class="flex items-center justify-between hover:bg-gray-50 px-2 py-1 rounded cursor-pointer"
  @click="selectFriend(friend)">
  <div class="flex items-center gap-2">
  <img :src="friend.avatar" class="w-8 h-8 rounded-full border-2 border-purple-600" />
  <span class="text-sm font-medium text-blue-700">{{ friend.name }}</span>
  </div>
  <span class="text-xs text-gray-500">{{ friends.time }}</span>
  </div>
  </div>

<!-- CHAT THREAD VIEW -->
  <div v-else class="flex flex-col flex-1 overflow-hidden">
  <!-- Chat Header -->
  <div class="border-b px-6 py-4 bg-white flex items-center justify-between">
  <div class="flex items-center gap-3">
  <img :src="selectedUser.avatar" class="w-10 h-10 rounded-full" />
  <div>
  <h2 class="font-semibold">{{ selectedUser.name }}</h2>
 <p class="text-xs text-green-500">{{ selectedUser.status ||'online' }}</p>
 </div>
 </div>

 <button @click="chatStarted = false" class="text-gray-400 hover:text-black">
<Icon icon="ci:chevron-left"/>
</button>
 <button>
  <Icon icon="material-symbols:zoom-out-map-rounded"/>
 </button>
 </div>




<!-- Message + Input -->
<div class="flex flex flex-col h-full overflow-hidden">

<!-- Messages Wrap Here -->
<div class="flex-1 overflow-y-auto px-4 py-4 space-y-4 gap-2">
<div
v-for="(msg, index) in messages"
:key="index"
class="flex items-end gap-1"
:class="msg.from === 'me' ? 'justify-end' : 'justify-start'">
<!-- Avatar -->
   <img
      :src="msg.avatar"
      class="w-8 h-8 rounded-full gap-1"
      :class="msg.from === 'me' ? 'order-2' : 'order-1'"/>

<!-- Message Bubble -->
<div
class="max-w-[70%] flex flex-col gap-1"
 :class="msg.from === 'me' ? 'items-end order-1' : 'items-start order-2'">

 <!-- File Message -->
 <div
 v-if="msg.file"
 class="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
<Icon icon="iconamoon:file-document-thin" class="text-blue-600 w-5 h-5" />
<a
 target="_blank"
 class="text-sm font-medium text-blue-700 underline">{{ msg.file.name }}
</a>
</div>


<!-- Audio Message -->
<div
  v-if="msg.audio"
  class="flex flex-col transition-transform duration-200 max-w-[70%] "
  :style="{ transform: swipeTranslateX(index) }"
  :class="msg.from === 'me' ? ' items-end self-end' : 'items-start self-start '" 
  @touchstart="onTouchStart"
  @touchmove="onTouchMove"
  @touchend="onTouchEnd(index)">

  
  <!-- Audio Bubble Container -->
  <div
    class="rounded-2xl px-3 py-2 flex flex-col gap-2"
    :class="msg.from === 'me' ? 'text-white' : 'text-white'">
    <audio
      :src="msg.audio "
      
      controls
      class="w-56 " >
  </audio>

    <!-- Optional text below audio -->
    <p v-if="msg.text" class="text-sm whitespace-pre-wrap break-all ">
      {{ msg.text }}
    </p>
  </div>
</div>



<!-- Image message -->
<img
  v-if="msg.image"
  :src="msg.image"
  class="w-48 max-h-64 object-cover rounded-xl shadow-md cursor-pointer hover:opacity-90 transition"
  @click="openMediaPreview(msg.image)"/>

<!-- Video message -->
<video
  v-if="msg.video"
  :src="msg.video"
  class="w-48 max-h-64 object-cover rounded-xl shadow-md cursor-pointer hover:opacity-90 transition gap-1 "
  controls
  @click="openMediaPreview(msg.video)"/>

<!-- Text Message -->
<div
  v-if="!msg.audio && !msg.file && !msg.image && !msg.video"
  class="px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-all "
  :class="msg.from === 'me' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'">
  {{ msg.text }}
</div>

        
    
<!-- Media Preview Modal -->
<div
v-if="mediaPreview"
class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
<div class="relative">
<component
:is="previewType === 'video' ? 'video' : 'img'" 
:src="mediaPreview"
class="max-w-[90vw] max-h-[85vh] rounded-lg shadow-xl"
v-bind="previewType === 'video' ? { controls: true } : {}"/>
<button
@click="mediaPreview = null"
class="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70"
title="Close">
<Icon icon="ic:round-close" class="w-6 h-6" />
</button>
</div>
</div>



<!-- Delete Button (Visible on Hover) -->
<button
  class="absolute top-1 right-1 text-white text-xs bg-black bg-opacity-50 p-1 rounded-full hidden group-hover:block"
  @click="deleteMessage(index)"
  title="Delete">
</button>

<!-- Forward Button -->
<button
  class="absolute bottom-1 right-8 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded-full p-1 hidden group-hover:block"
  @click="forwardMessage(msg)"
  title="Forward">
  
</button>

<!-- Forward Modal -->
<div v-if="forwardingMessage" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div class="bg-white rounded-xl p-4 w-80 shadow-lg">
<h2 class="text-lg font-semibold mb-3">Forward to:</h2>
<ul class="space-y-2">
<li
v-for="friend in friends"
:key="friend.id"
class="cursor-pointer hover:bg-gray-100 px-3 py-2 rounded"
 @click="sendForwardTo(friend)">
{{ friend.name }}
</li>
</ul><button class="mt-4 text-sm text-red-500" @click="forwardingMessage = null">Cancel</button> 
</div>
</div>


<!--Time Stamp-->
<p class="text-[11px] text-right opacity-70 mt-1">{{ msg.time }}</p>
</div>
</div>
</div>



<!-- Input Area -->
<div class=" px-2 py-3 bg-white flex items-center gap-2">
<!-- Outer rounded box containing textarea + icons -->
<div class="flex items-center flex-1 bg-white border border-gray-400 rounded-full px-3 py-2 shadow-sm gap-2">
    
<!-- Mic -->
<button
@click="toggleRecording"
class="text-gray-500 hover:text-red-500 transition"
:title="isRecording ? 'Stop recording' : 'Start recording'">
<Icon :icon="isRecording ? 'mdi:stop-circle-outline' : 'material-symbols:mic'" class="w-5 h-5" />
</button>

<!-- Textarea -->
<textarea
  v-model="newMessage"
  placeholder="Write something..."
  class="flex-1 bg-transparent text-sm text-black resize-none overflow-y-auto leading-snug align-top max-h-40 outline-none"
  rows="1"
  @input="autoResize"
  @keydown.enter.prevent="sendMessage">
  </textarea>

    <!-- Photo/Video -->
    <label class="cursor-pointer">
    <Icon icon="tabler:photo" class="w-5 h-5 text-gray-500 hover:text-green-500" />
    <input type="file" accept="image/*,video/*" multiple hidden @change="handleMediaUpload" />
    </label>

    <!-- Emoji -->
    <button @click="toggleEmojiPicker" title="Insert Emoji">
    <Icon icon="fa-regular:smile" class="w-5 h-5 text-gray-500 hover:text-yellow-500" />
    </button>

    <!-- File Attach -->
    <button @click="triggerFileInput" title="Attach File" class="text-gray-500 hover:text-gray-800">
    <Icon icon="tdesign:attach" class="w-5 h-5" />
    </button>
    <input
      ref="fileInput"
      type="file"
      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
      hidden
      @change="handleFileUpload"/>

  <!-- Send -->
<button @click="sendMessage" class="text-blue-500 hover:text-blue-700">
<Icon icon="ic:round-send" class="w-5 h-5" />
</button>
</div>
</div>

<!-- Emoji Picker Overlay -->
<div
  v-if="showEmojiPicker"
  class="fixed inset-0 flex items-center justify-center z-50"
  @click.self="showEmojiPicker = false">
  <div class="bg-white p-3 rounded-xl shadow-lg border w-80 max-h-[80vh] overflow-y-auto">
  <EmojiPicker @select="addEmoji" />
  </div>





<!-- Floating Voice Waveform Bar -->
<div
v-if="isRecording"
class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50   
bg-blue-600 rounded-full px-6 py-2 shadow-lg
flex items-center justify-between gap-4 h-12 w-[360px] max-w-[90vw]">

         
<!-- Animated Bars -->
<div class="flex items-end gap-[2px] flex-1">
<div
v-for="(bar, i) in waveformData"
:key="i"
:style="{ height: `${bar}px` }"
class="w-[2px] bg-white rounded-sm transition-all duration-75 "/>
  </div>

<!-- Timer Floating -->
<div class="flex flex-col min-w-[60px]">
<span class="text-xs font-mono">{{ recordingTimerDisplay }}</span>
</div>
</div>

</div>
<slot>
</slot>
</div>
</div>
</div>

</template>

<script setup>
import {  computed } from 'vue'
import { ref, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'


const props = defineProps({
  currentUser: Object,
  friends: Array,
});



const searchQuery = ref('');
const chatStarted = ref(false);
const selectedUser = ref(null);

const filteredFriends = computed(() => {
  return props.friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function selectFriend(friend) {
  selectedUser.value = friend;
  chatStarted.value = true;
}




import sinayun from '@/assets/jeny3.jpg'
import story1 from '@/assets/story1.jpg'
import story2 from '@/assets/story2.jpg'
import story3 from '@/assets/story3.jpg'
import story4 from '@/assets/story4.jpg'
import story5 from '@/assets/story5.jpg'


// States
const newMessage = ref('')
const showEmojiPicker = ref(false)
const messages = ref([])


const currentUser = ref({
  name: 'sinayun_xyn',
  role: 'Software Engineering',
  avatar: sinayun
})




// Friend List
const friends = [
  { id: 1, name: 'nita_lovekhmer', time: '01:12 PM', avatar: story1 },
  { id: 2, name: 'នារី_lovekhmer', time: '06:16 AM', avatar: story2 },
  { id: 3, name: 'ycn_lovekhm', time: '01:12 PM', avatar: story3 },
  { id: 4, name: 'Konsreypov', time: '1:12 PM', avatar: story4 },
  { id: 5, name: 'Kon_Khmer', time: '1:12 PM', avatar: story5 }

]


// Send message
function sendMessage() {
  if (newMessage.value.trim()) {
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    messages.value.push({
      text: newMessage.value.trim(),
      from: 'me',
      user: currentUser.value.name,
      avatar: currentUser.value.avatar,
      time,
      date: getFormattedDate(now)
    })

    newMessage.value = ''
    scrollToBottomSmart()

    // Remove bot reply completely
  }
}

// Emoji picker
function toggleEmojiPicker() {
  showEmojiPicker.value = !showEmojiPicker.value
}

function addEmoji(emoji) {
  newMessage.value += emoji.i
}

// Format Date
function getFormattedDate(date) {
  return date.toLocaleDateString('en-GB') // Change format as needed
}

// Scroll to bottom smoothly
function scrollToBottomSmart() {
  nextTick(() => {
    const chatContainer = document.querySelector('.flex-1.overflow-y-auto')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  })
}



// File handlers (optional)
function handleMediaUpload(e) {
  const files = Array.from(e.target.files)
  if (!files.length) return

  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = () => {
      const now = new Date()
      const isVideo = file.type.startsWith('video')

      messages.value.push({
        from: 'me',
        avatar: currentUser.value.avatar,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        [isVideo ? 'video' : 'image']: reader.result
      })

      scrollToBottomSmart()
    }
    reader.readAsDataURL(file)
  })
}




const mediaPreview = ref(null)

function openMediaPreview(src) {
  mediaPreview.value = src
}

function deleteMessage(index) {
  messages.value.splice(index, 1)
}


//Paper Clip
const fileInput = ref(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  const now = new Date()
  const url = URL.createObjectURL(file)

  messages.value.push({
    from: 'me',
    avatar: currentUser.value.avatar,
    file: {
      name: file.name,
      type: file.type,
      url
    },
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
}


//Mic 
const recordingTimer = ref(0) // Timer in seconds

const recordingTimerDisplay = computed(() => {
  const min = String(Math.floor(recordingTimer.value / 60)).padStart(2, '0')
  const sec = String(recordingTimer.value % 60).padStart(2, '0')
  return `${min}:${sec}`
})





const isRecording = ref(false)
let mediaRecorder = null
let audioChunks = []
let timerInterval = null
let audioContext = null
let analyser = null
let animationId = null



function toggleRecording() {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}
function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data)

    mediaRecorder.onstop = () => {
      clearInterval(timerInterval)
      cleanupAudioVisualizer()
      if (!audioChunks.length) return

      const blob = new Blob(audioChunks, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)

      messages.value.push({
        from: 'me',
        avatar: currentUser.value.avatar,
        audio: url,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    }

    mediaRecorder.start()
    isRecording.value = true
    recordingTimer.value = 0

    // ✅ This line fixes the warning and activates the waveform
    startWaveformVisualizer(stream)

    timerInterval = setInterval(() => {
      recordingTimer.value++
    }, 1000)
  })
}


 
function stopRecording() {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop()
    isRecording.value = false
    clearInterval(timerInterval)
  }
}









//Touch Audio
const touchStartX = ref(0)
const touchEndX = ref(0)

function onTouchStart(e) {
  touchStartX.value = e.touches[0].clientX
}

function onTouchMove(e) {
  touchEndX.value = e.touches[0].clientX
}

function onTouchEnd(index) {
  const distance = touchStartX.value - touchEndX.value
  if (distance > 80) {
    // Swipe left = delete audio
    messages.value.splice(index, 1)
  }
}


//Wave voice
const waveformData = ref(new Array(80).fill(4)) // 80 bars at 4px height

// 🎤 Start mic visualizer
function startWaveformVisualizer(stream) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const source = audioContext.createMediaStreamSource(stream)
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 64
  source.connect(analyser)

  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  const render = () => {
    analyser.getByteFrequencyData(dataArray)

    waveformData.value = dataArray
      .slice(0, waveformData.value.length)
      .map(v => Math.max(4, (v / 255) * 28)) // scale height smoothly

    animationId = requestAnimationFrame(render)
  }

  render()
}

// 🧼 Stop mic visualizer
function cleanupAudioVisualizer() {
  cancelAnimationFrame(animationId)
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
  waveformData.value = new Array(80).fill(4)
}









//Swipe Audio
function swipeTranslateX() {
  const distance = touchStartX.value - touchEndX.value
  return distance > 0 ? `translateX(-${Math.min(distance, 100)}px)` : ''
}


// Forward  massage
const forwardingMessage = ref(null)

function forwardMessage(msg) {
  forwardingMessage.value = msg
}

function sendForwardTo(friend) {
  const now = new Date()
  const forwarded = { ...forwardingMessage.value, time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }

  // simulate message going to another user
  messages.value.push({
    ...forwarded,
    from: 'me',
    forwardedTo: friend.name
  })

  forwardingMessage.value = null
}

// Auto row

const autoResize = (e) => {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}


//

</script>


<style scoped>
/* Optional fallback to make modal clickable */
.z-50 {
  z-index: 9999;




}

</style>