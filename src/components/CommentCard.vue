<template>
  <div class="relative">
    <!-- Main Comment Row -->
    <div
      class="w-full border-l border-gray-300 p-2 rounded-xl items-center"
      :style="{ marginLeft: depth > -2 ? `${depth}px` : '0px' }">
      
      <!-- Header User comment -->
      <div class="flex items-start gap-3 mb-2">
        <img :src="localComment.avatar" class="w-8 h-8 rounded-full" />
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

        <!-- Actions -->
        <div class="flex items-center gap-5 text-xs text-gray-600 mt-2 ml-3">
          <button
            @click="toggleLike"
            class="flex items-center gap-1 hover:text-red-500 transition"
            :class="{ 'text-red-500': localComment.liked }">
            <Icon
              :icon="localComment.liked ? 'solar:heart-bold' : 'solar:heart-linear'"
              class="w-5 h-5"/>


            <span v-if="localComment.likes > 0" class="font-medium">
              {{ localComment.likes }}
            </span>
            <span v-else>Like</span>
          </button>

          <button
            @click="replyOpen = !replyOpen"
            class="hover:text-blue-600 transition">
            Reply
          </button>


          <button>
          <Icon icon="bi:three-dots" class="w-5 h-5"/>
          </button>

          
</div>
          <!-- Show/Hide Replies Toggle -->
    <div v-if="totalReplies > 0" class=" flex-1 ml-12  mb-3">
      <button
        @click="showReplies = !showReplies"
        class="absolute text-xs font-medium text-gray-600 hover:underline transition">
        {{ showReplies ? 'Hide' : 'View' }}
        {{ totalReplies }}
        {{ totalReplies === 1 ? 'reply' : 'replies' }}
      </button>
    </div>


<!-- Reply Input Box -->
        <transition name="fade">
          <div v-if="replyOpen" class="mt-4">
          
            <div
              class="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-md">
              
            <button>
            <Icon icon="solar:camera-broken" class="w-5 h-5"/>
            </button>
            <span class="text-blue-500 text-sm font-medium">
                @{{ localComment.user }}
              </span>
              <input
                v-model="replyText"
                @keyup.enter="submitReply"
                ref="replyInput"
                class="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
                placeholder="Write a reply..."/>
              <button
                @click="submitReply"
                :disabled="!replyText.trim()"
                class="text-blue-500 disabled:text-gray-300 transition">
                <Icon icon="solar:paper-plane-bold" class="w-5 h-5" />
              </button>
<!---Iamge Upolod -->
              <button>
                <Icon icon="material-symbols-light:heart-smile-rounded" class="w-5 h-5"/>
              </button>

<!---Sent Button icon-->
              <button>
                <Icon icon="eva:paper-plane-fill" class="w-5 h-5"/>
              </button>
            </div>


          </div>
        </transition>
      </div>
    </div>

  
    

    <!-- Recursive Replies -->
    <transition name="slide">
      <div v-show="showReplies && totalReplies > 0">
        <CommentCard
          v-for="reply in localComment.replies"
          :key="reply.id || reply.time"
          :comment="reply"
          :depth="depth + 1"
          :current-user="currentUser"
          @reply-added="onReplyAdded"/>
      </div>
    </transition>
    
  </div>
</template>




<script>
import { Icon } from '@iconify/vue'
import CommentCard from './CommentCard.vue'

export default {
  name: 'CommentCard',
  components: {
    Icon,
    CommentCard,
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      default: 0
    },
    currentUser: {
      type: Object,
      required: true,
    }
  },
  emits: ['reply-added'],

  data() {
    return {
      localComment: null,
      replyOpen: false,
      replyText: '',
      showReplies: true,
    }
  },

  computed: {
    totalReplies() {
      return this.countReplies(this.localComment?.replies || [])
    }
  },

  created() {
    // Deep copy to avoid mutating prop directly
    this.localComment = JSON.parse(JSON.stringify(this.comment))
  },

  mounted() {
    // Collapse deep threads
    if (this.depth >= 3) {
      this.showReplies = false
    }

    // Auto-focus reply input
    this.$watch('replyOpen', (isOpen) => {
      if (isOpen) {
        this.$nextTick(() => {
          this.$refs.replyInput?.focus()
        })
      }
    })
  },

  methods: {
    countReplies(replies) {
      if (!replies) return 0
      return replies.reduce((sum, r) => sum + 1 + this.countReplies(r.replies), 0)
    },

    toggleLike() {
      if (!this.localComment.likes) this.localComment.likes = 0
      this.localComment.liked = !this.localComment.liked
      this.localComment.likes += this.localComment.liked ? 1 : -1
    },

    submitReply() {
      const text = this.replyText.trim()
      if (!text) return

      const newReply = {
        id: Date.now(),
        user: this.currentUser.name,
        avatar: this.currentUser.avatar,
        text,
        time: 'Just now',
        likes: 0,
        liked: false,
        replies: []
      }

      if (!this.localComment.replies) this.localComment.replies = []
      this.localComment.replies.push(newReply)

      this.replyText = ''
      this.replyOpen = false
      this.showReplies = true
      this.$emit('reply-added')
    },

    onReplyAdded() {
      this.$emit('reply-added')
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>