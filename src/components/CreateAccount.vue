<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center border-8 border-blue-400">

    <div class="w-full max-w-md bg-white p-8 rounded-md shadow-md text-center border border-gray-300">
      <h1 class="text-3xl font-bold text-green-600 mb-1">iFeed</h1>
      <p class="text-xs text-gray-700 mb-6">Create a new account</p>

      <!-- First + Last Name -->
      <div class="flex gap-2 mb-2">
        <input v-model="form.firstName" type="text" placeholder="First name"
          class="w-1/2 border text-xs border-gray-400 px-2 py-2 rounded-md focus:outline-none" />
        <input v-model="form.lastName" type="text" placeholder="Last name"
          class="w-1/2 border text-xs border-gray-400 px-2 py-2 rounded-md focus:outline-none" />
      </div>
      <p v-if="errors.name" class="text-red-500 text-xs mb-2">{{ errors.name }}</p>

      <!-- DOB -->
      <div class="text-left text-xs text-gray-600 mb-1">Date of Birth</div>
      <div class="flex gap-2 mb-2">
        <select v-model="form.dobDay" class="w-1/3 border text-xs border-gray-400 px-2 py-2 rounded-md">
          <option value="">Day</option>
          <option v-for="d in 31" :key="d" :value="String(d).padStart(2, '0')">{{ d }}</option>
        </select>
        <select v-model="form.dobMonth" class="w-1/3 border text-xs border-gray-400 px-2 py-2 rounded-md">
          <option value="">Month</option>
          <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">{{ m }}</option>
        </select>
        <select v-model="form.dobYear" class="w-1/3 border text-xs border-gray-400 px-2 py-2 rounded-md">
          <option value="">Year</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <p v-if="errors.dob" class="text-red-500 text-xs mb-2">{{ errors.dob }}</p>

      <!-- Gender -->
      <div class="text-left text-xs text-gray-600 mb-1">Gender</div>
      <div class="flex gap-2 mb-2">
        <button
          v-for="g in ['Female', 'Male', 'Other']"
          :key="g"
          @click="form.gender = g"
          :class="[
            'flex-1 border text-xs px-2 py-2 rounded-md',
            form.gender === g ? 'border-green-500 bg-green-100' : 'border-gray-400'
          ]"
        >
          {{ g }}
        </button>
      </div>
      <p v-if="errors.gender" class="text-red-500 text-xs mb-2">{{ errors.gender }}</p>

      <!-- Email / Phone -->
      <input v-model="form.contact" type="text" placeholder="Email or Phone number"
        class="w-full border text-xs border-gray-400 px-2 py-2 rounded-md mb-2" />
      <p v-if="errors.contact" class="text-red-500 text-xs mb-2">{{ errors.contact }}</p>

      <!-- Password -->
      <input v-model="form.password" type="password" placeholder="New password"
        class="w-full border text-xs border-gray-400 px-2 py-2 rounded-md mb-4" />
      <p v-if="errors.password" class="text-red-500 text-xs mb-2 -mt-3">{{ errors.password }}</p>

      <!-- Submit -->
      <button @click="handleSubmit"
        class="w-full bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-green-600">
        Create Your Account
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  firstName: '',
  lastName: '',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
  gender: '',
  contact: '',
  password: '',
})

const errors = reactive({
  name: '',
  dob: '',
  gender: '',
  contact: '',
  password: ''
})

const years = Array.from({ length: 100 }, (_, i) => `${new Date().getFullYear() - i}`)

function handleSubmit() {
  // Reset errors
  errors.name = ''
  errors.dob = ''
  errors.gender = ''
  errors.contact = ''
  errors.password = ''

  // Name validation
  if (!form.firstName || !form.lastName) {
    errors.name = 'First and Last name are required.'
  }

  // DOB validation
  if (!form.dobDay || !form.dobMonth || !form.dobYear) {
    errors.dob = 'Complete date of birth is required.'
  }

  // Gender validation
  if (!form.gender) {
    errors.gender = 'Please select a gender.'
  }

  // Contact validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^[0-9]{6,15}$/
  if (!form.contact || (!emailRegex.test(form.contact) && !phoneRegex.test(form.contact))) {
    errors.contact = 'Enter a valid email or phone number.'
  }

  // Password validation
  if (!form.password || form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  // ✅ If no errors, proceed
  if (!errors.name && !errors.dob && !errors.gender && !errors.contact && !errors.password) {
    localStorage.setItem('verifyEmail', form.contact)
    router.push('/verify')
  }
}
</script>
