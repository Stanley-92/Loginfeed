<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 bg-black/40 flex justify-center  flex items-center">
      <div class="bg-white w-[420px] h-full p-4 relative max-h-[60vh]  rounded-xl">

        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Notification</h2>
         
          <button @click="$emit('update:modelValue', false)">✕</button>
          
        </div>
 <button class="flex justify-between items-center mb-5" >All</button>

<button class="flex-1 justify-between items-center mb-2" >
Unread
</button> 
        <!-- Notifications -->
        <div class="space-y-4 overflow-y-auto h-[90%]">
          <div
            v-for="n in notifications"
            :key="n.id"
            @click="goToProfile(n.userId)"
            class="flex gap-3 p-2 rounded cursor-pointer hover:bg-gray-100">
            <img :src="n.avatar" class="w-10 h-10 rounded-full" />
            <div>
              <p class="text-sm">
                <span class="text-blue-600 font-semibold">
                  {{ n.username }}
                </span>
                {{ n.action }}
              </p>
              <p class="text-xs text-gray-500">{{ n.time }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,        // controls open/close
    notifications: Array        // reusable data
  },
  emits: ["update:modelValue"],
  methods: {
    goToProfile(id) {
      this.$emit("update:modelValue", false);
        this.$router.push(`/profile/${id}`);
    }
  }
};
</script>
