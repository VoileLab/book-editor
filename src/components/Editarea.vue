<template>
  <textarea spellcheck="false" class="w-100 writer" :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)" :class="{ lines: showLines }"></textarea>
</template>

<script>
export default {
  name: 'editarea',
  props: {
    modelValue: {
      type: String,
    },
    showLines: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
}
</script>

<style scoped>
textarea.writer {
  height: 98%;

  outline: none;
  resize: none;

  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;

  padding: 8px 10px;
  line-height: 31px;
}

textarea.lines {
  background-attachment: local;
  background-image:
    linear-gradient(to right, white 10px, transparent 10px),
    linear-gradient(to left, white 10px, transparent 10px),
    repeating-linear-gradient(white, white 30px, #ccc 30px, #ccc 31px, white 31px);
}
</style>
