
<template>
<div class="flex min-h-screen  bg-white">

 <!-- Left Sidebar -->
<aside class="w-72 bg-white border-2 p-10 hidden xl:block sticky top-0 h-screen overflow-y-auto">
<h1 class="text-4xl font-bold text-green-500 mb-4 cursor-pointer" @click="goToMainfeed">iFeed</h1>
<div class="relative mb-32">
<div 
class="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
 @click="handleSearch">
<Icon icon="codex:search" class="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
</div>
 <input
  type="text"
  v-model="searchQuery"
  placeholder="Search"
  class="w-full border rounded-full  px-3 py-2 pl-10 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-100"
 @keyup.enter="handleSearch" />
</div>
<nav class="space-y-2 px-3  py-8  text-gray-700 gap-3">
<div class="flex items-center gap-3 p-2 cursor-pointer  hover:text-blue-500">
<Icon icon="material-symbols:home" class="w-8 h-8 text-gray-500 transition-colors  duration-200 hover:text-gray-600"/>  <!---Home-->
</div>

  <button
    @click="showNotify = true"
    class="relative z-50 p-3 hover:bg-gray-100 rounded-xl">
<Icon icon="solar:heart-outline" class="w-8 h-8 text-gray-500 transition-colors duration-200 hover:text-gray-600"/>
<span v-if="notifications.length > 0" class="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
  {{ notifications.length }}
</span>
</button>


 <div class="flex items-center gap-3 p-2 cursor-pointer border-gray-300 hover:text-blue-500">
</div>    


 <!-- Heart icon -->


  <!-- Reusable Notification Popup -->
  <Notify
    v-model="showNotify"
    :notifications="notifications"/>


<div @click="openPostModal"  class="w-10 h-10 flex items-center  justify-center   border-gray-300 ">
<Icon icon="ic:baseline-plus" class="w-10 h-10 text-gray-500 transition-colors bg-green-300    border-2 border-blue-200 rounded-xl duration-200 hover:text-gray-600" /> 
</div> 
 <!--create-->


<teleport to="body">
<!-- Floating Composer Modal -->
<div v-if="showPostModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" @click.self="closePostModal">
<div class=" fixed  bg-opacity-50 w-full max-w-xl rounded-xl p-6 relative ">
<!-- Close Button -->
<button @click.self="closePostModal" class="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"> 
<Icon icon="basil:cross-solid "/>
</button>



<!--When On you Mind  Wrap  Post a Composer -->
<div class="bg-white p-4 rounded-xl shadow-sm mb-6" @dragover.prevent @drop.prevent="handleDrop">
<!-- Avatar + Textarea -->
<div class="flex items-start gap-3 mb-3">
<img :src="currentUser.avatar" class="w-10 h-10 rounded-full border" />
<textarea
  ref="textareaRef"
  v-model="newPost"
  placeholder="What's on your mind?"
  class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
  @input="handleMentionInput">

     
</textarea>
</div>
<div v-if="showMentionList" class="absolute bg-white border rounded shadow w-48 mt-1 z-50">
<div
v-for="(user, index) in filteredUsers"
:key="index"
class="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
@click="selectMention(user.name)">
{{ '@' + user.name }}
</div>
</div>



<!-- Action Icons + Post (Right aligned) -->
<div class="flex justify-end items-center gap-4 text-gray-600 mb-3 px-2">
<!-- Location Icon Button -->
<button @click="getLocation" title="Location">
<Icon icon="mynaui:location" class="w-5 h-5" />
</button>


<!-- Location Popup Modal -->
<teleport to="body">
<div
v-if="showLocationPopup"
class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50"
@keydown.esc="closeLocation"
tabindex="-1"
@click.self="closeLocation" >

<!-- Card -->
<div
class="bg-white rounded-2xl shadow-xl w-[420px] max-w-[92vw] h-[70vh] max-h-[720px] overflow-hidden flex flex-col"
@click.stop>



<!-- Header -->
<div class="h-12 flex items-center justify-center border-b relative">
<button
class="absolute left-2 p-2 rounded hover:bg-gray-100"
@click="closeLocation"
aria-label="Back">
<Icon icon="mdi:chevron-left" class="w-5 h-5" />
</button>

<h2 class="text-sm font-semibold">Choose a Place</h2>
<button
class="absolute right-2 p-2 rounded hover:bg-gray-100"
@click="closeLocation"
aria-label="Close">
<Icon icon="material-symbols:close"/>
</button>
</div>




<!-- Body -->
<div class="p-4 flex-1">
<div class="relative">
<input
ref="locationInputRef"
 v-model="locationInput"
 type="text"
 placeholder="Add Location..."
class="w-full px-4 py-2 pr-10 rounded-lg bg-gray-200/70 text-sm outline-none"
@keyup.enter="confirmLocation"/>

<button
class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-green-600"
@click="confirmLocation"
aria-label="Send">
<Icon icon="mdi:send-outline" class="w-5 h-5" />
</button>
</div>




<!-- Optional suggestions list -->
<div v-if="suggestions.length" class="mt-4 space-y-2 overflow-y-auto max-h-[48vh] pr-1">
<button
v-for="(s, i) in suggestions"
:key="i"
class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
@click="pickSuggestion(s)">
<div class="text-sm font-medium">{{ s.name }}</div>
<div class="text-xs text-gray-500">{{ s.desc }}</div>
</button>
</div>
</div>
</div>
</div>
</teleport>
<!-- Location Popup Modal -->


<!-- Upload Post -->                                                                                                                   <!-- Upload Post -->
<label class="cursor-pointer " title="Upload Media">
  <Icon icon="mdi:image-outline" class="w-5 h-5" />
  <input
    type="file"
    accept="image/*,video/*"
    multiple
    class="hidden"
    @change="handleFileUpload($event)"
  />
</label>
<!-- Comment -->                                                     
<button @click="toggleReplyComment" title="Comment">
<Icon icon="iconamoon:comment" class="w-5 h-5 " />
</button>

<!-- Emoji Picker -->
<div class="relative" title="Insert Emoji">
<button @click="toggleEmojiPicker">
<Icon icon="mdi:emoticon-outline" class="w-5 h-5 mr-5 mt-2" />
</button>
<div v-if="showEmojiPicker" class="absolute z-50 top-8 right-0">
<EmojiPicker @select="addEmoji" />
</div>
</div>
<!-- Post -->
<button class="text-sm font-semibold text-gray-700 hover:text-blue-600" @click="submitPost(); showPostModal = false">
 Post
</button>
</div>
<!-- Post -->

<!-- Preview Modal for Media before  post  -->
<div v-if="activePreview" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
<div class="relative max-w-3xl w-full max-h-[90vh]">
<button
@click="closePreview"
class="fixed top-6 right-6 z-50 text-white bg-black bg-opacity-50   p-2 rounded-full hover:bg-opacity-70">

<Icon icon="mdi:close" class="w-6 h-6" />
</button>
<component
:is="activePreview.type.startsWith('video') ? 'video' : 'img'"
:src="activePreview.url"
class="w-auto max-w-full max-h-[90vh] object-contain mx-auto rounded-xl"
controls
autoplay/>
</div>
</div>




<!-- Media Previews -->
<div v-if="mediaPreviews.length" class="grid grid-cols-2 gap-2 mt-2">
<div
v-for="(file, index) in mediaPreviews"
:key="index"
class="relative group rounded-lg overflow-hidden border cursor-pointer"
@click="openPreview(file)">
<component
:is="file.type.startsWith('video') ? 'video' : 'img'"
:src="file.url"
class="w-full h-48 object-cover"
controls/>
<button
 @click.stop="removeMedia(index)"
class="relative">
<Icon icon="mdi:close" class="w-4 h-4" />
</button>
 </div>
</div>
</div> 
<!--When  Post a Composer -->

</div>
</div>
</teleport>


<!-- Follower Button Trigger -->
<div @click="toggleFollowerPopup" class="flex items-center gap-4 p-2 cursor-pointer  hover:text-blue-500" >
<Icon icon="mingcute:user-follow-2-line"  class="w-8 h-8 text-gray-500 "/>
<!-- Add Follower here  -->
</div>

<!-- Follower Popup Modal (Teleport to body) -->
<teleport to="body">
<div v-if="showFollowerPopup" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 "
 @click.self="toggleFollowerPopup">
<div class="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 relative">
  
<!-- Close Button -->
<button @click="toggleFollowerPopup" class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">

<Icon icon="ri:close-line"/>
</button>
<h2 class="text-xl font-medium-bold mb-4">Followers</h2>

<!-- Tabs -->
<div class="flex border-b mb-4">
<button
@click="switchTab('followers')"
:class="activeTab === 'followers' ? 'border-b-2 border-blue-500 text-green-600' : 'text-gray-600'"
class="flex-1 py-2 text-center font-semibold">
Followers
</button>
<button
@click="switchTab('following')"
:class="activeTab === 'following' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'"
class="flex-1 py-2 text-center font-semibold">
Following
</button>
</div>


<!-- Followers List -->
<div v-if="activeTab === 'followers'" class="space-y-3 max-h-64 overflow-y-auto">
<div
v-for="(user, index) in followers"
:key="'follower-' + index"
class="flex items-center gap-3 p-2 border rounded justify-between">
<div class="flex items-center gap-3">
<img :src="user.avatar" class="w-10 h-10 rounded-full" />
<span class="font-medium">{{ user.name }}</span>
</div>
<button class="px-3 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600">Following</button>
</div>
</div>


<!-- Following List -->
<div v-if="activeTab === 'following'" class="space-y-3 max-h-64 overflow-y-auto">
<div
v-for="(user, index) in following"
:key="'following-' + index"
class="flex items-center gap-3 p-2 border rounded justify-between">
<div class="flex items-center gap-3">
<img :src="user.avatar" class="w-10 h-10 rounded-full" />
<span class="font-medium">{{ user.name }}</span>
</div>
<button class="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Following</button>
</div>
</div>
</div>
</div>
</teleport>
</nav>

<div class="mt-8 relative">

  <!-- Settings Icon -->
  <div 
    @click="toggleSettings"  
    class="flex items-center gap-8 p-4 cursor-pointer hover:text-blue-500 mb-8">
  <Icon icon="basil:edit-outline" class="w-8 h-8 transition-colors duration-200 " />
  </div>
 </div>
</aside>   
 <div>


<!-- Settings Popup -->
<teleport to="body">
  <!-- Overlay (click outside) -->
  <div
    v-if="showSettings"
    class="fixed inset-0 z-40"
    @click.self="showSettings = false"
  >
    <!-- Popup -->
    <div
      class="absolute top-20 left-40 w-72 bg-white shadow-lg border-2 border-gray-300 rounded-xl p-4 z-50"
    >

      <!-- Menu Sections -->
      <div class="divide-y bg-white">

        <!-- Section 1 -->
        <div>
          <div class="py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 px-2 rounded">
            <span class="font-medium">Switch Mode</span>
            <Icon icon="ooui:next-ltr"/>
          </div>
          <div class="py-3 px-2 cursor-pointer hover:bg-gray-50 rounded">Daily Review</div>
          <div class="py-3 px-2 cursor-pointer hover:bg-gray-50 rounded">Setting</div>
        </div>

        <!-- Section 2 -->
        <div>
          <div class="py-3 flex justify-between items-center cursor-pointer hover:bg-gray-200 px-2 rounded">
            <button>iFeed</button>
            <Icon icon="ooui:next-ltr"/>
          </div>
          <div class="py-3 px-2 cursor-pointer hover:bg-gray-200 rounded">Feedback</div>
          <div class="py-3 px-2 cursor-pointer hover:text-gray-600 rounded flex items-center gap-2">
            <Icon icon="akar-icons:heart" class="w-8 h-8"/>
          </div>
        </div>

        <!-- Logout -->
        <div>
          <div class="py-3 px-2 cursor-pointer hover:bg-gray-50 rounded text-red-500 flex items-center gap-2">
            <Icon
              icon="material-symbols:logout"
              class="w-8 h-8 cursor-pointer"
              @click="goLogin"/>
          </div>
        </div>

      </div>
    </div>
  </div>
</teleport>
</div>









<!-- MainiFeed -->
<main class="flex-5 max-w-2xl mx-auto px-4 py-5 ">
    
<div class="max-w-2xl mx-auto bg-white border rounded-xl shadow-sm p-6 relative mb-1">


<!--  Stories Container -->
<div
  
    ref="storyScrollRef"
    class="flex gap-4 overflow-x-auto scroll-smooth px-2 no-scrollbar" >
    <div
      v-for="(story, i) in stories"
      :key="story.id"
      @click="openStory(i)"
      class="flex flex-col items-center flex-shrink-0 w-[90px]">
      <!-- Gradient Border -->
      <div
        class="w-20 h-20 rounded-xl p-[2px]
               bg-gradient-to-tr from-purple-500 to-pink-500">
        <img
          :src="story.media"
          class="w-full h-full rounded-lg object-cover bg-white"/>
      </div>

      <span
        class="text-xs mt-2 text-gray-700 truncate w-full text-center">
        {{ story.username }}
      </span>
    </div>
  </div>

  <!-- Left Arrow -->
  <button
    @click="scrollStories('left')"
    class="absolute left-1 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-1 z-10">
    <Icon icon="ic:round-chevron-left" class="w-5 h-5" />
  </button>

  <!-- Right Arrow -->
  <button
    @click="scrollStories('right')"
    class="absolute right-1 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-1 z-10">
    <Icon icon="ic:round-chevron-right" class="w-5 h-5" />
  </button>
</div>

<!-- Post a Composer 1 -->



  <!--Main  Post Composer 2 -->
<div v-for="(post, index) in posts" :key="post.id" class="bg-white border rounded-sl shadow-sm p-4  relative  ">
   <!-- Post Header -->
<div class="flex items-center justify-between mb-2">


<!-- Avatar / User Info -->
<div class="flex items-center gap-2 ">
<img
:src="post.avatar"
alt="User Avatar"
class="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm"/>
<div>
<h2 class="text-sm font-semibold text-gray-800">{{ post.user }}</h2>
<p class="text-xs text-gray-400">{{ post.time }}</p>
<!---Location text-->
<p v-if="post.location" class="text-xs text-gray-400">{{ post.location }}</p>
  
</div>
</div>


  <!-- Three-dot Menu -->
  <div class="relative">
    <button
    @click="toggleMenu(index)"
    class="p-1 hover:bg-gray-100 rounded-full">
  <Icon icon="bi:three-dots" class="w-5 h-5 text-gray-600" />
  </button>







  <!-- Dropdown Menu -->
   
    <div
   
  v-if="activeMenuIndex === index"
     class="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50" 
 @click.self="activeMenuIndex = false">
  
    <ul class="text-sm text-gray-700 py-2">
    <li
     @click="startEditPost(index)"
      class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">
      Edit Caption
      <Icon icon="lucide:edit" class="w-4 h-4"/>
      </li>
          <li
          @click="confirmDelete(index)"
          class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer">
          Delete Post
          <Icon icon="fluent:delete-32-regular" class="w-4 h-4" />
          </li> 
          <li
          v-if="!post.commentsDisabled"
          @click="OffComment(index)"
          class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">
          Off Comment
        <Icon icon="fluent:comment-off-48-regular" class="w-4 h-4" />
        </li>
         <li
          @click="copylink(index)"
          class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">
          Copy Link
        <Icon icon="ri:link" class="w-4 h-4" />
        </li>
         <li
          @click="shareTo(index)"
          class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"> 
          Report Post
        <Icon icon="ri:link" class="w-4 h-4" />  
        </li>
        </ul>





<!----Open Model sent to frien-->
  <div v-if="showShareModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div class="bg-white w-96 p-6 rounded-xl shadow-xl relative">
  <button @click="showShareModal = false" class="absolute top-2 right-2">
  <Icon icon="mdi:close" class="w-5 h-5" />
  </button>
  <h2 class="text-lg font-semibold mb-4">Report</h2>
  <p>Post ID: {{ posts[activeSharedPostIndex]?.id }}</p>
 <!-- Add actual sharing buttons here -->
   </div>
   </div>
   </div>
   </div>
   </div>
<!-- Dropdown Menu buttonm-->






<!-- Caption or Editable -->
  <div class="mb-4">
  <div v-if="editingIndex === index">
        <input v-model="editedCaption" class="w-full border px-3 py-1 rounded focus:outline-none" />
        <div class="text-right mt-1">
        <button class="text-green-600 text-sm font-semibold hover:underline mr-2" @click="saveEditedPost(index)">Save</button>
        <button class="text-gray-500 text-sm hover:underline" @click="cancelEdit">Cancel</button>
        </div>
        </div>
        <p v-else> {{ post.caption }}</p>
        </div>




<!-- Open Photo Post Media  sinayun_xyn 1h ago ) -->



<div
  ref="scrollContainer"
  class="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory cursor-pointer"
>
  <component
    v-for="(media, i) in post.media"
    :key="i"
    :is="media.type.startsWith('video') ? 'video' : 'img'"
    :src="media.url"
    class="rounded-xl flex-shrink-0 snap-start hover:brightness-75 transition h-72 object-contain"
    controls
    @click="openMediaModal(media, post.media)"/>
</div>


<!-- Media Fullscreen Viewer with Navigation -->
  <div
  v-if="selectedMedia"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
  @touchstart="handleTouchStart"
  @touchend="handleTouchEnd">



<!-- Close -->
 <button
  @click="closeMediaModal"
  class="cursor-pointer absolute top-4 right-4 z-50 text-white bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80">
<Icon icon="mdi:close" class="w-6 h-6 text-white" />
</button>

<!-- Icon Prev -->
 
<button
v-if="selectedIndex > 0"
        @click.stop="prevMedia"
        class="cursor-pointer absolute left-4 top-1/2 z-50 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80">
      <Icon icon="ooui:previous-ltr" class="w-6 h-6 text-white" />
      </button>

      <!-- Icon Next -->
      <button
        v-if="selectedIndex < activePostMedia.length - 1"
        @click.stop="nextMedia"
        class="cursor-pointer absolute right-4 top-1/2 -translate-y">
        <Icon icon="ooui:next-ltr" class="w-6 h-6 text-white" />
      </button>

    <!-- Media Viewer -->
      <component
        :is="selectedMedia.type.startsWith('video') ? 'video' : 'img'"
        :src="selectedMedia.url"
        class="max-w-full max-h-[90vh] object-contain rounded-xl"
        controls
        autoplay/>
    </div>
  
<!-- Media Fullscreen Viewer with Navigation -->











<!-- Post Actions  ICon heart comment share -->
<div class="flex items-center gap-4 text-gray-500 text-sm mt-4 mb-10">
      
<!-- Like -->
<div class="flex items-center gap-4 cursor-pointer hover:text-red-500" @click="toggleLike(index)">

 <!--Heart Like RedColor-->
<Icon :icon="post.liked ? 'fluent-emoji:red-heart' : 'octicon:heart-24'" class="w-5 h-5" />
<span>{{ formatCount(post.likes||[]) }}</span>
</div>
  <!-- Comment -->
<div class="flex items-center gap-2 cursor-pointer hover:text-blue-500" @click="toggleComment(index)">
<Icon icon="tdesign:chat-bubble" class="w-5 h-5"/>
<span>{{ formatCount(post.commentsList?.length ||[]) }}</span>
</div>  
 <div>




<!-- Button Repost  popup -->
<button 
@click.stop="showRepostPopup = true" 
 class="p-2 hover:text-gray-500 relative z-10  duration-100">
<Icon icon="grommet-icons:power-cycle" class="w-5 h-5" />
</button>

<!-- Teleported Popup -->
<teleport to="body">
<div 
 v-if="showRepostPopup" 
class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
@click="closePopup">
<!-- Popup Content -->
<div 
class="bg-white rounded-xl p-4 w-[420px] relative"
@click.stop>
<!-- Header -->

<div class="flex justify-between items-center mb-3">
<h2 class="text-lg font-bold">iFeed</h2>
<button @click="closePopup" class="text-gray-500 hover:text-black"> 
<Icon icon="ri:close-line"/></button>
</div>

<!-- Post Input -->                                                                                                                                        <!-- Repost Button  -->
<div class="flex items-center space-x-3 mb-4">
<img :src="currentUser.avatar" class="w-10 h-10 rounded-full" />
<input type="text" placeholder="Write something..." class="flex-1 border rounded px-2 py-1" />
</div>

<!-- Sent to Friend -->
<div class="mb-4">
<p class="font-semibold mb-1">Sent to Friend</p>
<div class="flex space-x-2">
<img v-for="(friend, index) in friends" :key="index" :src="friend" class="w-10 h-10 rounded-full" />
</div>
</div>

<!-- Share To -->
 
<div>
<p class="font-semibold mb-1">Share To</p>
<div class="flex space-x-4">
<button class="flex flex-col items-center text-sm">
<Icon icon="ri:link" class="w-10 h-10"/>
<span>Copy</span>
</button>
<button class="flex flex-col items-center text-sm">
  <Icon icon="logos:telegram" class="w-10 h-10"/>
<span>Telegram</span>
</button>
<button class="flex flex-col items-center text-sm">
  <Icon icon="logos:facebook" class="w-10 h-10"/>
<span>Facebook</span>
</button>
<button class="flex flex-col items-center text-sm item-center">
<Icon icon="tdesign:chat-bubble" class="w-10 h-10 text-white transition-colors bg-green-500 border-4 border-green-500 rounded-xl duration-200 hover:text-gray-600"/>
<span>iFeed</span>
</button>
</div>
</div>
</div>
</div>
</teleport>
 

</div>
        
<!-- Share Button and Dropdown -->

<div class="relative">
<button 
@click.stop="showRepostPopup = true" 
 class="p-2 hover:text-gray-500 relative z-10  duration-100">
<Icon icon="mage:direction-up-right-2" class="w-5 h-5"/> <!-- Air Plan Share Popup -->
</button>

<!-- Teleported Popup -->
<teleport to="body">
<div 
 v-if="showRepostPopup" 
class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
@click="closePopup">
<!-- Popup Content -->
<div 
class="bg-white rounded-xl p-4 w-[420px] relative"
@click.stop>
<!-- Header -->

<div class="flex justify-between items-center mb-3">
<h2 class="text-lg font-bold">iFeed</h2>
<button @click="closePopup" class="text-gray-500 hover:text-black"> 
<Icon icon="ri:close-line"/></button>
</div>

<!-- Post Input -->                                                                                                                                        <!-- Repost Button  -->
<div class="flex items-center space-x-3 mb-4">
<img :src="currentUser.avatar" class="w-10 h-10 rounded-full" />
<input type="text" placeholder="Write something..." class="flex-1 border rounded px-2 py-1" />
</div>

<!-- Sent to Friend -->
<div class="mb-4">
<p class="font-semibold mb-1">Sent to Friend</p>
<div class="flex space-x-2">
<img v-for="(friend, index) in friends" :key="index" :src="friend" class="w-10 h-10 rounded-full" />
</div>
</div>

<!-- Share To -->
 
<div>
<p class="font-semibold mb-1">Share To</p>
<div class="flex space-x-4">
<button class="flex flex-col items-center text-sm">
<Icon icon="ri:link" class="w-10 h-10"/>
<span>Copy</span>
</button>
<button class="flex flex-col items-center text-sm">
  <Icon icon="logos:telegram" class="w-10 h-10"/>
<span>Telegram</span>
</button>
<button class="flex flex-col items-center text-sm">
  <Icon icon="logos:facebook" class="w-10 h-10"/>
<span>Facebook</span>
</button>
<button class="flex flex-col items-center text-sm item-center">
<Icon icon="tdesign:chat-bubble" class="w-10 h-10 text-white transition-colors bg-green-500 border-4 border-green-500 rounded-xl duration-200 hover:text-gray-600"/>
<span>iFeed</span>
</button>
</div>
</div>
</div>
</div>
</teleport>


</div>
</div>


 



 <!-- Comment Reply Box -->
  <div v-if="post.showComments" class="max-w-sl rounded-full mx-auto px-4 py-4">
    <!-- View All Toggle -->
    <div
    class="text-gray-400 text-sm mb-1 cursor-pointer hover:text-gray-500"
      @click="post.viewAll = !post.viewAll">
   Show all {{countTotalComments (post.commentsList) }} comments 
    </div>

  <!-- Comment List -->
  <CommentCard
  v-for="(comment, i) in post.viewAll ? post.commentsList : post.commentsList.slice(0, 1)"
  :key="i"
  :comment="comment"
  :depth="0"
  :current-user="currentUser"
  @reply-added="updateCommentCount"/>

<!-- Add New Comment Input   // class="flex-1 px-4 py-2 text-sm bg-gray-100 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            placeholder="Write a reply..."-->                            
<div v-if="!post.commentsDisabled" class=" mt-2 flex gap-1 items-center ">
<img :src="post.avatar" class="w-10 h-10 rounded-full border-2 " />
<textarea
v-model="post.newComment"
placeholder="Add a comment..." 
class="flex-1 px-2 text-sm bg-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 w-full  " 

       
@input="autoResize($event)"
@keyup.enter.exact="addCommentToPost(index)">
</textarea>
</div>
</div>
</div>   
<!--When  Post a Composer Bottom -->
 </main>

   
<!-- Right Sidebar Suggestions -->
<aside class="w-72 bg-white border-l p-10 hidden xl:block sticky top-0 h-screen overflow-y-auto">





<!-- Profile Box with Heart Icon -->
<div class="flex items-center justify-between mb-32">
  <div class="flex items-center gap-5">
  <img :src="currentUser.avatar"
  alt="Profile"
  class="w-16 h-16 rounded-full object-cover border-4" />
  <div>
    <button @click="goToProfileUser" class="font-medium text-blue-600 hover:text-gray-800">
    View profile
    </button>
    
  <p class="text-sm text-gray-500">{{ currentUser.name }}</p>
  </div>
  </div>

<!-- Heart Button that redirects to Chat.vue -->
<button @click="togglechat" class="text-xl hover:text-blue-600">
<Icon
icon="basil:comment-outline"  class="w-6 h-6 transition"/>
</button>
</div>

<teleport to="body">
<transition name="slide-in">
<ChatPanel
v-if="showChatPopup" 
:friends="suggestedFriends"
:selectedUser="selectedUser"
@close="showChatPopup = false"
@friend-selected="handleFriendSelected"/>
</transition>
</teleport>



      
<div class="flex justify-between items-center mb-12 ">
<h2 class="font-semibold text-gray-800 hover:text-blue-600 ">
Suggested for you</h2>

<button @click="ShowAll" class="text-sm text-gray-500 hover:text-blue-600" >
Show All</button>
</div>
<ul class="space-y-4">
 <li
v-for="user in suggestedUsers"
 :key="user.id"
  class="flex items-start gap-2 hover:bg-gray-50 p-2 rounded ">
  <img
  :src="user.avatar"
  alt="suggested"
  class="w-10 h-10 rounded-full border-2 border-purple-600"/>
  <div class="flex flex-col">
  <span class="text-sm font-medium text-gray-700">{{ user.username }}</span>
  <button 
  class="w-20 text-sm font-medium text-blue-600 py-1 rounded hover:text-gray-700 transition duration-200">
   Follow
  </button>
  </div>
  </li>
  </ul>
  
<!--  Add Copyright Box -->
<div class=" mt-8 text-center text-xs text-gray-400">
© 2025 iFeed. All rights reserved.
TeamDevOP.Sihanouk Ville City.Cambodia 
</div>
</aside>



<!--Open Story Modal view  -->
<div
v-if="activeStory"
class="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
@click.self="closeStory">
<div
 

 class="relative w-[90vw] max-w-[430px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl">
<!-- Phone Fram 9:6 -->

<!-- Top overlay: user + close + progress -->

<div class="absolute inset-x-0 top-0 p-3 z-20">
   <!-- progress bar (fake timer, bind width if you want) -->
<div class="h-1 w-full bg-white/20 rounded">
<div class="h-full bg-white rounded" :style="{ width: progress + '%' }">
</div>

</div>

<div class="mt-3 flex items-center justify-between">
<div class="flex items-center gap-2 text-white">
<img :src="activeStory.avatar" class="w-7 h-7 rounded-full ring-2 ring-purple-500" />
<div class="leading-tight">
<p class="text-sm font-semibold">{{ activeStory.username }}</p>
<p class="text-[11px] text-white/70">{{ activeStory.time }}</p>
</div>
</div>
<button @click="closeStory" class="p-2 hover:bg-white/10 rounded-full">
<Icon icon="material-symbols:close" class="w-5 h-5 text-white" />
</button>
</div>
</div>

<!-- Media  View Stroy-->
<div class="absolute inset-0">
<component
:is="activeStory.type === 'video' ? 'video' : 'img'"
:src="activeStory.media"
class="w-full h-full object-cover"
v-bind="activeStory.type === 'video'? { autoplay: true, muted: true, loop: true, playsinline: true } 
  :{}"/>
  </div>

  <!-- Bottom composer -->
      <div class="absolute inset-x-0 bottom-0 p-4 z-20">
        <div class="flex items-center gap-3">
          <input
            v-model="replyText"
            type="text"
            placeholder="Send message..."
            class="flex-1 bg-white/90 text-[13px] rounded-full px-4 py-2 outline-none placeholder:text-gray-500"
            @keydown.enter.prevent="sendReply"/>

          
          <button class="p-2 rounded-full bg-white/10 hover:bg-white/20">
            <Icon icon="mdi:heart-outline" class="w-5 h-5 text-white" />
          </button>
          <button class="p-2 rounded-full bg-white/10 hover:bg-white/20" @click="sendReply">
            <Icon icon="mdi:send" class="w-5 h-5 text-white" />
          </button>
</div>
</div>


 <!-- Next -->
      <button
        @click="nextStory"
        class="hidden sm:flex items-center justify-center text-white/80 hover:text-white ml-2"
        aria-label="Next story">
      <Icon icon="weui:arrow-filled-right" class="w-7 h-7" />
      </button>

      <!-- Left/Right click zones -->
      <button
        @click="prevStory"
        class="absolute left-0 top-0 h-full w-1/4 hover:bg-white/5 transition z-10"
        aria-label="Previous">
      </button>

      <button
        @click="nextStory"
        class="absolute right-0 top-0 h-full w-1/4 hover:bg-white/5 transition z-10"
        aria-label="Next">
    </button>

      <!-- Arrow hints (optional) -->
      <div class="absolute left-2 top-1/2 -translate-y-1/2 text-white/90 z-20">
        <Icon icon="weui:arrow-filled-left" class="w-6 h-6" />
      </div>
      <div class="absolute right-2 top-1/2 -translate-y-1/2 text-white/90 z-20">
        <Icon icon="weui:arrow-filled-right" class="w-6 h-6" />
      </div>
    </div>
  </div>
   </div>
 <!-- Story Modal -->
</template>











  <!--  -->


<script>
import { nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import CommentCard from './CommentCard.vue';
import Notify from './Notify.vue';
import ChatPanel from './ChatPanel.vue';
import story1 from '@/assets/story1.jpg';
import story2 from '@/assets/story2.jpg';
import story3 from '@/assets/story3.jpg';
import story4 from '@/assets/story4.jpg';
import story5 from '@/assets/story5.jpg';
import sinayun from '@/assets/jeny3.jpg';
import aesp from '@/assets/aesp.jpg';

import { useToast } from "vue-toastification";

export default {
  name: '',
  components: {
    Notify,
    Icon,
    EmojiPicker,
    CommentCard,
    ChatPanel,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      showLikes: false,
      showNotify: false,
      notifications: [],
      media:[], //store uplouad post
      currentIndex:0,  // for slide post 
      newPost: '',
      showEmojiPicker: false,
      mediaPreviews: [],
      activeStory: null,
      currentStoryIndex: null,
      autoCloseTimer: null,
      activeMenuIndex: null,
      editingIndex: null,
      editedCaption: '',
      storyScrollRef: null,
      sharePopupRefs: [],
      showShareModal: false,
      activeSharedPostIndex: null,

      showLocation: false,
      postLocation: '',
      replyCommentVisible: false,
      touchStartX: 0,
      touchEndX: 0,
      selectedMedia: null,
      selectedIndex: 0,
      activePostMedia: [],
      activePreview: null,
      scrollContainer: null,
      showLocationPopup: false,
      locationInput: '',
      suggestions: [
      { name: 'Phnom Penh', desc: 'Cambodia' },
      { name: 'Siem Reap', desc: 'Angkor Wat' },
      { name: 'Kampot', desc: 'Riverside town' },                                              //Location Limit
      ],
      locationInputRef: null,
      tags: [],
      showMentionList: false,
      mentionQuery: '',
      filteredUsers: [],
      textareaRef: null,
      users: [
      { name: 'sinayun' },
      { name: 'nayun' },
      { name: 'nita_lovekhmer' },
      { name: 'chakriya' },
      { name: 'konkhmer' },
      ],
      showFollowerPopup: false,
      activeTab: 'followers',
      followers: [
      { name: 'story5', avatar: '/images/default-avatar.jpg' },
      { name: 'story3', avatar: '/images/default-avatar.jpg' },
      ],
      following: [
      { name: 'mini1', avatar: '/images/default-avatar.jpg' },
      { name: 'mini3', avatar: '/images/default-avatar.jpg' },
      ],
      showPostModal: false,
      showChatPopup: false,
      selectedUser: {},
      suggestedFriends: [
        { id: 1, name: 'nita_lovekhmer', time: '01:12 PM', avatar: story1 },
        { id: 2, name: 'នារី_lovekhmer', time: '06:16 AM', avatar: story2 },
        { id: 3, name: 'ycn_lovekhm', time: '01:12 PM', avatar: story3 },
        { id: 4, name: 'Konsreypov', time: '1:12 PM', avatar: story4 },
        { id: 5, name: 'Kon_Khmer', time: '1:12 PM', avatar: story5 },
      ],
      showSettings: false,
      showRepostPopup: false, 
       friends: ['friend1.jpg', 'friend2.jpg', 'friend3.jpg'],                                                   //Show repost 
      showSharePopup: false,                                                                        
  
      replyText: '',
      stories: [
        { id: 1, username: 'user_1', media: story1, type: 'image', time: '1h ago' },
        { id: 2, username: 'user_2', media: story2, type: 'video', time: '2h ago' },
        { id: 3, username: 'user_3', media: story5, type: 'image', time: '3h ago' },
        { id: 4, username: 'user_3', media: story5, type: 'image', time: '3h ago' },
      ],
      suggestedUsers: [
        { id: 1, avatar: sinayun, username: 'nita_lovekhmer' },
        { id: 2, avatar: story2, username: 'នារី_lovekhmer' },
        { id: 3, avatar: story3, username: 'Chakriya_konsreypov' },
        { id: 4, avatar: story4, username: 'ycn_lovekhm' },
        { id: 5, avatar: story5, username: 'Kon_Khmer' },     
      ],
      currentUser: {
        name: 'sinayun_xyn',
        avatar: story4,
      },
      posts: [
        {
          id: 1,
          user: 'sinayun_xyn',
          avatar: aesp,
          caption: 'A design room for myself',
          media: [{ url: story5, type: 'image' }],
          time: '1h ago',
          likes: 0,
          shares: 0,
          liked: false,
          showComments: false,
          showShare: false,
          newComment: '',
          commentsList: [],
          commentsDisabled: false,
        },
        {
          id: 2,
          user: 'nayun_ndo',
          avatar: story2,
          caption: 'My girlfriend so cute ',
          media: [{ url: story3, type: 'image' }],
          time: '1m ago',
          likes: 999,
          shares: 0,
          liked: false,
          showComments: false,
          showShare: false,
          newComment: '',
          commentsList: [],
          commentsDisabled: false,
        },
      ],
    };
  },

  
  //Method 
  methods: {

    //Heart Notify
    listenRealtime() {
      // Example: real-time push
      setInterval(() => {
        const newNotification = {
          id: Date.now(),
          userId: 3,
          username: "new_user",
          action: "Love your post",
          time: new Date().toLocaleTimeString(),
          avatar: "https://i.pravatar.cc/100"
        };

        this.notifications.unshift(newNotification);
      }, 5000);
    },

//Notify popup
   openLikesPopup() {
      console.log("Heart clicked"); 
      this.showLikes = true;
  },  

      goToMainfeed() {
        window.location.reload();
      },

   goToProfileUser(){
    this.$router.push('/profile'); //Go to Profile

   },
   goLogin(){
    this.$router.push('/login'); //Go to Profile

   },
    handleTouchStart(e) {
      this.touchStartX = e.changedTouches[0].screenX;
    },
    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    },
    handleSwipe() {
      const distance = this.touchEndX - this.touchStartX;
      if (distance > 50) this.prevMedia();
      if (distance < -50) this.nextMedia();
    },
    openMediaModal(media, mediaList) {
      this.activePostMedia = mediaList;
      this.selectedIndex = mediaList.findIndex((m) => m.url === media.url);
      this.selectedMedia = this.activePostMedia[this.selectedIndex];
    },
    closeMediaModal() {
      this.selectedMedia = null;
      this.selectedIndex = 0;
      this.activePostMedia = [];
    },
    nextMedia() {
      if (this.selectedIndex < this.activePostMedia.length - 1) {
        this.selectedIndex++;
        this.selectedMedia = this.activePostMedia[this.selectedIndex];
      }
    },
    prevMedia() {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
        this.selectedMedia = this.activePostMedia[this.selectedIndex];
      }
    },
    handleKeydown(e) {
      if (!this.selectedMedia) return;
      if (e.key === 'ArrowRight') this.nextMedia();
      if (e.key === 'ArrowLeft') this.prevMedia();
      if (e.key === 'Escape') this.closeMediaModal();
    },
    openPreview(media) {
      this.activePreview = media;
    },
    closePreview() {
      this.activePreview = null;
    },
    removeMedia(index) {
      this.mediaPreviews.splice(index, 1);
    },
    scrollStories(direction) {
      const container = this.storyScrollRef;
      const amount = 150;
      if (container) {
        container.scrollLeft += direction === 'right' ? amount : -amount;
      }
    },
 handleFileUpload(e) {
  const files = Array.from(e.target.files);
  this.mediaPreviews = files.map((file) => ({
    url: URL.createObjectURL(file),
    type: file.type,
  }));
},
handleDrop(e) {
  const files = Array.from(e.dataTransfer.files);
  this.mediaPreviews = files.map((file) => ({
    url: URL.createObjectURL(file),
    type: file.type,
  }));
},

   
    addEmoji(emoji) {
      this.newPost += emoji.i;
      this.showEmojiPicker = false;
    },
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },


    
    submitPost() {
      const extractedTags = this.newPost.match(/@\w+/g) || [];
      if (!this.newPost.trim() && !this.mediaPreviews.length) return;
      this.posts.unshift({
        id: Date.now(),
        user: 'sinayun_xyn',
        avatar: this.currentUser.avatar,
        location: this.postLocation.trim(),
        caption: this.newPost,
        media: [...this.mediaPreviews],
        tags: extractedTags,
        time: 'Just now',
        likes: 0,
        shares: 0,
        liked: false,
        showComments: false ,
        showShare: false,
        newComment: '',
        commentsList: [],
        commentsDisabled: false,
      });
      this.newPost = '';
      this.mediaPreviews = [];
      this.tags = [];
      this.showEmojiPicker = false;
      this.postLocation = '';
      this.showLocation = false;
    },
    countTotalComments(comments) {
      let count = 0;
      for (const comment of comments) {
        count++;
        if (comment.replies?.length) {
          count += this.countTotalComments(comment.replies);
          
        }
      }
      return count;
    },
    toggleLike(index) {
      const post = this.posts[index];
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
    },
    toggleComment(index) {
      this.posts[index].showComments = !this.posts[index].showComments;
    },
    toggleSharePopup(index) {
      this.posts[index].showShare = !this.posts[index].showShare;
    },
    addCommentToPost(index) {
      const post = this.posts[index];
      const text = post.newComment.trim();
      if (!text) return;
      if (!Array.isArray(post.commentsList)) post.commentsList = [];

      post.commentsList.push({
        user: this.currentUser.name,
        avatar: this.currentUser.avatar,
        text,
        liked: false,
        replies: [],
      });
      post.newComment = '';
    },
    autoResize(event) {
      const el = event.target;
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    },


  //Location
    getLocation() {
      this.showLocationPopup = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
              .then((res) => res.json())
              .then((data) => {
                this.locationInput =
                  data.address.city ||
                  data.address.town ||
                  data.address.village ||
                  'Unknown';
              })
              .catch((err) => {
                this.locationInput = 'Location error';
                console.error(err);
              });
          },
          (error) => {
            console.error('Geolocation error:', error.message);
            this.locationInput = 'Permission denied';
          }
        );
      } else {
        this.locationInput = 'Geolocation not supported';
      }
    },
    confirmLocation() {
      this.postLocation = this.locationInput;
      this.showLocationPopup = false;
      this.locationInput = '';
    },
    closeLocation() {
      this.showLocationPopup = false;
    },
    pickSuggestion(s) {
      this.locationInput = s.name;
      this.confirmLocation();
    },
    formatCount(num) {
      if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
    },
    updateCommentCount() {
      console.log('Reply added!');
    },
    toggleMenu(index) {
      this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
    },
    confirmDelete(index) {
      this.posts.splice(index, 1);
      this.activeMenuIndex = null;
    },
    startEditPost(index) {
      this.editingIndex = index;
      this.editedCaption = this.posts[index].caption;
      this.activeMenuIndex = null;
    },
    saveEditedPost(index) {
      this.posts[index].caption = this.editedCaption;
      this.editingIndex = null;
    },
    cancelEdit() {
      this.editingIndex = null;
    },
    openStory(index) {
      this.currentStoryIndex = index;
      this.activeStory = this.stories[index];
    },
    closeStory() {
      this.activeStory = null;
      clearTimeout(this.autoCloseTimer);
    },
    nextStory() {
      if (this.currentStoryIndex < this.stories.length - 1) {
        this.openStory(this.currentStoryIndex + 1);
      } else {
        this.closeStory();
      }
    },
    prevStory() {
      if (this.currentStoryIndex > 0) {
        this.openStory(this.currentStoryIndex - 1);
      }
    },
    sendReply() {
      const text = this.replyText.trim();
      if (!text) return;
      this.replyText = '';
    },
    copyLink() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      });
    },
    shareToFacebook() {
      const url = encodeURIComponent(window.location.href);
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      window.open(fbUrl, '_blank', 'width=600,height=600');
    },
    shareToTelegram() {
      const url = encodeURIComponent(window.location.href);
      const tgUrl = `https://t.me/share/url?url=${url}`;
      window.open(tgUrl, '_blank', 'width=600,height=600');
    },
    shareToMessenger() {
      const url = encodeURIComponent(window.location.href);
      const appId = 'FACEBOOK_APP_ID';
      const msgUrl = `https://www.messenger.com/dialog/send?link=${url}&app_id=${appId}&redirect_uri=${url}`;
      window.open(msgUrl, '_blank', 'width=600,height=600');
    },
    handleOutsideClick(event) {
      this.sharePopupRefs.forEach((refEl, index) => {
        if (refEl && !refEl.contains(event.target)) {
          this.posts[index].showShare = false;
        }
      });
    },
    OffComment(index) {
      this.posts[index].commentsDisabled = true;
      this.activeMenuIndex = null;
    },
    copylink(index) {
      const postId = this.posts[index].id;
      const postUrl = `${window.location.origin}/post/${postId}`;
      navigator.clipboard.writeText(postUrl).then(() => {
        alert('Link copied!');
      });
    },
    shareTo(index) {
      this.activeSharedPostIndex = index;
      this.showShareModal = true;
    },
    toggleReplyComment() {
      this.replyCommentVisible = !this.replyCommentVisible;
    },
    handleMentionInput(e) {
      const cursorPos = e.target.selectionStart;
      const textUpToCursor = this.newPost.substring(0, cursorPos);
      const mentionMatch = textUpToCursor.match(/@(\w*)$/);
      if (mentionMatch) {
        this.mentionQuery = mentionMatch[1].toLowerCase();
        this.filteredUsers = this.users.filter((user) =>
          user.name.toLowerCase().startsWith(this.mentionQuery)
        );
        this.showMentionList = this.filteredUsers.length > 0;
      } else {
        this.showMentionList = false;
      }
    },
    selectMention(username) {
      nextTick(() => {
        const textarea = this.textareaRef;
        if (!textarea) return;
        const cursorPos = textarea.selectionStart;
        const textBeforeCursor = this.newPost.substring(0, cursorPos);
        const textAfterCursor = this.newPost.substring(cursorPos);
        const newTextBeforeCursor = textBeforeCursor.replace(/@\w*$/, '@' + username + ' ');
        this.newPost = newTextBeforeCursor + textAfterCursor;
        nextTick(() => {
          textarea.selectionStart = textarea.selectionEnd = newTextBeforeCursor.length;
          textarea.focus();
        });
        this.showMentionList = false;
      });
    },
    toggleFollowerPopup() {
      this.showFollowerPopup = !this.showFollowerPopup;
    },
    switchTab(tab) {
      this.activeTab = tab;
    },
    openPostModal() {
      this.showPostModal = true;
      nextTick(() => {
        const textarea = document.querySelector('textarea[placeholder="What\'s on your mind?"]');
        textarea?.focus();
      });
    },
    closePostModal() {
      this.showPostModal = false;
    },
    handleFriendSelected(friend) {
      this.selectedUser = friend;
    },
    togglechat() {
      this.showChatPopup = !this.showChatPopup;
    },
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    closePopup() {
      this.showRepostPopup = false;
    },
  },
  watch: {
    selectedMedia(newVal) {
      if (newVal) {
        window.addEventListener('keydown', this.handleKeydown);
      } else {
        window.removeEventListener('keydown', this.handleKeydown);
      }
    },
    activeStory(story) {
      clearTimeout(this.autoCloseTimer);
      if (story) {
        this.autoCloseTimer = setTimeout(() => {
          this.nextStory();
        }, 5000);
      }
    },
    showLocationPopup(on) {
      if (on) {
        nextTick(() => {
          this.locationInputRef?.focus();
        });
      }
    },
  },
  mounted() {
    // this.listenRealtime();
    this.posts = this.posts.map((post) => ({
      ...post,
      liked: false,
      showComments: false,
      showShare: false,
      newComment: '',
      commentsList: post.commentsList || [],
      viewAll: false,
    }));
  },
  unmounted() {
    document.removeEventListener('click', this.handleOutsideClick);
    clearTimeout(this.autoCloseTimer);
  },
};
</script>

















<style scoped>
/* Hide scrollbar for all browsers */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/*comment css*/
textarea {
  overflow: hidden;
  resize: none;
}ម

/*PopupChat*/
.slide-in-enter-active {
  transition: transform 0.3s ease;
}
.slide-in-leave-active {
  transition: transform 0.3s ease;
}
.slide-in-enter-from {
  transform: translateX(100%);
}
.slide-in-leave-to {
  transform: translateX(100%);
}



</style>                  