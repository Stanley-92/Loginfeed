<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-sm bg-white p-6 rounded-md shadow text-center">
      <h1 class="text-2xl font-bold text-green-600 mb-1">Verify Code</h1>
      <p class="text-xs text-gray-600 mb-4">
        We've sent a 6-digit code to <span class="font-medium">{{ contact }}</span>
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
        Didn't receive it?
        <span class="text-blue-500 hover:underline cursor-pointer" @click="resendCode">Resend</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Verify',

  data() {
    return {
      contact: '',
      digits: ['', '', '', '', '', ''],
      digitInputs: [],
      error: ''
    }
  },

  mounted() {
    // Get email from localStorage
    this.contact = localStorage.getItem('verifyEmail') || ''

    // Focus first input
    this.$nextTick(() => {
      this.digitInputs = this.$refs.digitInputs
      this.digitInputs[0]?.focus()
    })
  },

  methods: {
    moveFocus(i) {
      if (this.digits[i].length === 1 && i < 5) {
        this.digitInputs[i + 1]?.focus()
      }
    },

    handleKeydown(e, i) {
      if (e.key === 'Backspace' && !this.digits[i] && i > 0) {
        this.digitInputs[i - 1]?.focus()
      } else if (e.key === 'Enter') {
        this.verifyCode()
      }
    },

    async verifyCode() {
      const fullCode = this.digits.join('')

      if (!/^\d{6}$/.test(fullCode)) {
        this.error = 'Code must be 6 digits.'
        return
      }

      try {
        const response = await fetch('http://localhost:3000/verify-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.contact, code: fullCode })
        })

        const result = await response.json()

        if (result.success) {
          alert(' Verified successfully!')
          this.$router.push('/feed')
        } else {
          this.error = result.message || 'Invalid code. Try again.'
        }
      } catch (err) {
        console.error(err)
        this.error = 'Server error. Please try again.'
      }
    },

    async resendCode() {
      try {
        const res = await fetch('http://localhost:3000/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.contact })
        })
        const data = await res.json()

        if (data.success) {
          alert('📨 A new code was sent!')
          this.digits = ['', '', '', '', '', '']
          this.$nextTick(() => this.digitInputs[0]?.focus())
          this.error = ''
        } else {
          this.error = data.message || 'Failed to resend code.'
        }
      } catch (err) {
        console.error(err)
        this.error = 'Server error. Please try again.'
      }
    }
  }
}
</script>
