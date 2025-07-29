<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="flex w-full max-w-5xl items-center justify-between px-8">
      <!-- Left side: Logo and text -->
      <div class="hidden md:block">
        <h1 class="text-5xl font-bold text-green-600 mb-4">iFeed</h1>
        <p class="text-gray-600">Connect with the people in your Life 
          and to the Worlds.</p>
      </div>

      <!-- Right side: Login form -->
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border">
        <input
          type="text"
          placeholder="Email or Phone number"
          class="w-full mb-4 px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="password"
          class="w-full mb-4 px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          class="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 mb-2"
        >
          Login
        </button>
        <p class="text-sm text-center text-gray-500 mb-4">
          Forgot your Password
        </p>
        <hr class="mb-4" />
      
       <!-- ✅ Router link to Create Account -->
      <router-link to="/create" class="w-full block">
        <button class="bg-green-600 text-white w-full py-2 rounded text-sm font-semibold hover:bg-green-700">
          Create your account
      </button>
      </router-link>

      </div>
    </div>
  </div>
</template>


