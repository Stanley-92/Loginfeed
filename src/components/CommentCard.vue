<template>
  <div class="relative mb-1 w-full">
    <!-- Comment Box -->
    <div
      class="w-full border-l border-gray-300 p-2 rounded-xl items-center"
      :style="{ marginLeft: depth > -2 ? `${depth}px` : '0px' }">
      
      <!-- Header User comment -->
      <div class="flex items-start gap-3 mb-2">
        <img :src="localComment.avatar" class="w-8 h-8 rounded-full"/>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold">{{ localComment.user }}</p>
          <p class="text-xs text-gray-400">{{ localComment.time || 'Just now' }}</p>
        </div>
      </div>

      <!-- Text or Editing and box reply Comment  -->
      <div v-if="!isEditing">
        <p class="text-sm px-4 py-2 text-gray-800 whitespace-pre-wrap break-words mb-2">
        {{ localComment.text }}
      </p>
      </div>
      <div v-else>
        <textarea
          v-model="editText"
          class="flex-1 px-1  text-sm bg-white-400 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-white w-full"  
          rows="2"
          @input="autoResize">
        </textarea>
        <div class="flex gap-4 text-xs">
          <button class="text-green-600 font-semibold" @click="saveEdit">Save</button>
          <button class="text-gray-400" @click="cancelEdit">Cancel</button>
        </div>
      </div>


      
      <!-- Post  Actions -->
      <div class="flex gap-4 text-xs text-gray-500 mb-2">
        <button @click="toggleLike" class="flex items-center gap-1 hover:text-red-500">
        <Icon :icon="localComment.liked ? 'fluent-emoji-flat:broken-heart' : 'solar:heart-linear'" :class="['w-4 h-4', { 'text-red-500': localComment.liked }]" />
         
        </button>
        <button @click="replyOpen = !replyOpen" class="flex items-center gap-1 hover:text-blue-500">
          <Icon icon="basil:comment-outline" class="w-5 h-5" />
          
        </button>
        <button @click="isEditing = true" class="flex items-center gap-1 hover:text-green-500">
          <Icon icon="mdi:pencil-outline" class="w-4 h-4" />
          <span class="font-semibold">Edit</span>
        </button>
      </div>

      <!-- icon Confirm Delete -->
      <div v-if="showDeleteConfirm" class="flex gap-3 text-xs text-red-600 mb-2"></div>

      <!-- Reply Count -->
      <div v-if="localComment.replies?.length" class="text-xs text-gray-400 ml-3 mb-2">
      {{ countReplies(localComment.replies) }} {{ countReplies(localComment.replies) === 1 ? 'reply' : 'replies' }}
      </div>


      
      <!-- Reply Input -->
      <div v-if="replyOpen" class="mt-3 flex flex-col w-full">
        <p class="text-xs text-gray-500 mb-2 ml-1">
        <span class="font-semibold">{{ localComment.user }}</span>
        </p>
        <div class="relative flex items-center">
          <textarea
            v-model="replyText"
            class="flex-1 px-4 py-2 text-sm bg-gray-100 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            placeholder="Write a reply..."
            rows="1"
            @input="autoResize"
            @keyup.enter.exact="submitReply">
          </textarea>

          <button
            @click="submitReply"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 disabled:text-gray-400"
            :disabled="!replyText.trim()">
            <Icon icon="famicons:paper-plane-outline" class="w-5 h-5" />
          </button>
        </div>
      </div>



      <!-- Recursive Replies -->
      <div v-if="localComment.replies?.length" class="mt-4 space-y-3 w-full mb-1">
        <CommentCard
          v-for="(reply, i) in localComment.replies"
          :key="i"
          :comment="reply"
          :depth="depth + 1"
          :current-user="currentUser"
          @reply-added="$emit('reply-added')"
        />
      </div>
    </div>
  </div>
</template>







<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import CommentCard from './CommentCard.vue'

const emit = defineEmits(['reply-added'])
const props = defineProps({
  comment: Object,
  depth: Number,
  currentUser: Object
})

const localComment = ref(JSON.parse(JSON.stringify(props.comment)))
const replyOpen = ref(false)
const replyText = ref('')
const isEditing = ref(false)
const editText = ref(localComment.value.text)
const showDeleteConfirm = ref(false)

const toggleLike = () => {
  localComment.value.liked = !localComment.value.liked
}

const submitReply = () => {
  const text = replyText.value.trim()
  if (!text) return

  const reply = {
    user: props.currentUser.name || 'You',
    avatar: props.currentUser.avatar,
    text,
    liked: false,
    time: 'Just now',
    replies: [],
  }

  if (!Array.isArray(localComment.value.replies)) localComment.value.replies = []

  localComment.value.replies.push(reply)
  replyText.value = '',
  replyOpen.value = false
  emit('reply-added')
}

const autoResize = (e) => {
  e.target.style.height = 'auto'
  e.target.style.height = '${e.target.scrollHeight}px'
}

const saveEdit = () => {
  localComment.value.text = editText.value.trim()
  isEditing.value = false
}

const cancelEdit = () => {
  editText.value = localComment.value.text
  isEditing.value = false
}

const countReplies = (replies) => {
  let count = replies.length
  for (const reply of replies) {
    if (reply.replies?.length) {
      count += countReplies(reply.replies)
    }
  }
  return count
}
</script>

<style scoped>
textarea {
  overflow: hidden;
  resize: none;
}
</style>
