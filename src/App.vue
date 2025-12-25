<template>
<router-view></router-view>
</template>


<script>

</script>

<style>
/* Global cursor fix */
body, div, p, span {
  user-select: none;        /* Can't select text */
  caret-color: transparent; /* Hide the blinking cursor */
}

input, textarea {
  user-select: text;
  caret-color: auto;        /* Show cursor normally */
}
</style>
