<template>
  <div class="relative mb-1 w-full">
    <!-- Comment Box -->
    <div
      class="w-full border-l border-gray-300 p-1 rounded-sm"
      :style="{ marginLeft: depth > -2 ? `${depth}px` : '0px' }"
    >
      <!-- Header -->
      <div class="flex items-start gap-3 mb-2">
        <img :src="localComment.avatar" class="w-8 h-8 rounded-full" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold">{{ localComment.user }}</p>
          <p class="text-xs text-gray-400">{{ localComment.time || 'Just now' }}</p>
        </div>
      </div>

      <!-- Text or Editing -->
      <div v-if="!isEditing">
        <p class="text-sm text-gray-800 whitespace-pre-wrap break-words mb-2">
          {{ localComment.text }}
        </p>
      </div>
      <div v-else>
        <textarea
          v-model="editText"
          class="w-full text-sm px-3 py-2  mb-2 resize-none"
          rows="2"
          @input="autoResize"
        ></textarea>
        <div class="flex gap-2 text-xs">
          <button class="text-green-600 font-semibold" @click="saveEdit">Save</button>
          <button class="text-gray-400" @click="cancelEdit">Cancel</button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-4 text-xs text-gray-500 mb-2">
        <button @click="toggleLike">
          <Icon :icon="localComment.liked ? 'fluent-color:heart-16-filled' : 'mdi:heart-outline'" class="w-4 h-4" />
        </button>
        <button @click="replyOpen = !replyOpen">Reply</button>
        <button @click="isEditing = true">Edit</button>
      </div>

      <!-- icon Confirm Delete -->
      <div v-if="showDeleteConfirm" class="flex gap-3 text-xs text-red-600 mb-2"></div>

      <!-- Reply Count -->
      <div v-if="localComment.replies?.length" class="text-xs text-gray-400 ml-3 mb-2">
        {{ countReplies(localComment.replies) }} {{ countReplies(localComment.replies) === 1 ? 'reply' : 'replies' }}
      </div>

      <!-- Reply Input -->
      <div v-if="replyOpen" class="mt-3 flex gap-2 items-start w-full">
        <img src="/assets/sinayun_xyn.jpg" class="w-7 h-7 rounded-full mt-1" />
        <textarea
          v-model="replyText"
          class="flex-1 px-3 py-2 text-sm bg-gray-100 rounded-xl resize-none focus:outline-none w-full"
          placeholder="Write a reply..."
          rows="1"
          @input="autoResize"
          @keyup.enter.exact="submitReply"
        ></textarea>
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
    replies: []
  }

  if (!Array.isArray(localComment.value.replies)) localComment.value.replies = []

  localComment.value.replies.push(reply)
  replyText.value = ''
  replyOpen.value = false
  emit('reply-added')
}

const autoResize = (e) => {
  e.target.style.height = 'auto'
  e.target.style.height = `${e.target.scrollHeight}px`
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
