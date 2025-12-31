<template>
  <div class="relative">
    <!-- Main Comment Row -->
    <div
      class="relative flex gap-3 mb-6"
      :style="{ marginLeft: depth * 32 + 'px' }">
      <!-- Curved  Line Connector -->
      <div
        v-if="depth > 0"
        class="absolute pointer-events-none"
        :style="{
          left: '-18px',
          top: '-148px',
          width: '20px',
          height: '178px',
          borderLeft: '2px solid #93c5fd',
          borderBottom: '2px solid #93c5fd',
          borderBottomLeftRadius: '16px'
        }"/>

      <!-- Avatar -->
      <img
        :src="localComment.avatar"
        alt="User avatar"
        class="w-9 h-9 rounded-full object-cover flex-shrink-0 z-10 shadow-sm"/>

<!-- Comment Body -->
      <div class="flex-1 ">
        <!-- Bubble -->
        <div class="bg-gray-100 rounded-2xl px-4 py-3 shadow-sm">
          <!-- Username -->
          <p class="text-sm font-bold text-gray-900">
            {{ localComment.user }}
          </p>

          <!-- Comment Text -->
          <p class="text-sm text-gray-800 mt-1 whitespace-pre-wrap break-words">
          {{ localComment.text }}
          </p>


          <!-- Time -->
          <p class="text-xs text-gray-500 mt-2">
          {{ localComment.time || 'Just now' }}
          </p>
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