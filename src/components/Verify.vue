<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-sm bg-white p-6 rounded-md shadow text-center">
      <h1 class="text-2xl font-bold text-green-600 mb-1">Verify Code</h1>
      <p class="text-xs text-gray-600 mb-4">
        We’ve sent a 6-digit code to <span class="font-medium">{{ contact }}</span>
      </p>

      <!-- 6 Code Boxes -->
      <div class="flex justify-between gap-2 mb-4">
    <input
  v-for="(d, i) in digits"
  :key="i"
  v-model="digits[i]"
  ref="digitInputs"
  maxlength="1"
  type="text"
  class="w-10 h-12 text-center border border-gray-300 rounded text-xl"
  @input="moveFocus(i)"
  @keydown="(e) => handleKeydown(e, i)"
/>

      </div>

      <p v-if="error" class="text-red-500 text-sm mb-3">{{ error }}</p>

      <!-- Submit -->
      <button
        @click="verifyCode"
        class="w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 text-sm"
      >
        Verify
      </button>

      <!-- Resend -->
      <p class="text-xs text-gray-500 mt-4">
        Didn’t receive it?
        <span class="text-blue-500 hover:underline cursor-pointer" @click="resendCode">Resend</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const contact = ref('')
const digits = ref(['', '', '', '', '', ''])
const digitInputs = ref([])
const error = ref('')

// Get contact from localStorage
onMounted(() => {
  contact.value = localStorage.getItem('verifyEmail') || 'your contact'
  nextTick(() => digitInputs.value[0]?.focus())
})

// Move focus to next box
function moveFocus(i) {
  if (digits.value[i].length === 1 && i < 5) {
    digitInputs.value[i + 1]?.focus()
  }
}
function handleKeydown(e, i) {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) {
    digitInputs.value[i - 1]?.focus()
  } else if (e.key === 'Enter') {
    verifyCode()
  }
}




// Verify Code
function verifyCode() {
  const fullCode = digits.value.join('')
  if (fullCode === '123456') {
    alert('✅ Verified!')
    router.push('/mainfeed') // <-- route to Mainfeed.vue
  } else {
    error.value = 'Invalid code. Try again.'
  }
}

// Dummy resend function
function resendCode() {
  alert(`📨 A new code was sent to ${contact.value}`)
}
</script>
