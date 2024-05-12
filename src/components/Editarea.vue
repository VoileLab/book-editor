<template>
  <textarea spellcheck="false" class="w-100 writer" :value="modelValue" :readonly="readonly"
    @input="$emit('update:modelValue', $event.target.value)" :class="{ lines: showLines }" ref="textarea"></textarea>
</template>

<script>
function scrollTo(textarea, offset) {
  const txt = textarea.value;
  if (offset >= txt.length || offset < 0) {
    return;
  }

  // Important, so that scrollHeight will be adjusted
  textarea.scrollTop = 0;

  textarea.value = txt.substring(0, offset)
  let height = textarea.scrollHeight
  textarea.value = txt

  const textareaHeight = textarea.clientHeight;

  if (height > textareaHeight) {
    // scroll selection to center of textarea
    height -= textareaHeight / 2;
  } else {
    height = 0;
  }

  textarea.scrollTop = height
}

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
    readonly: {
      type: Boolean,
      default: false,
    },
    select: {
      type: [Object, null],
      default: null,
    },
  },
  watch: {
    select: function (newVal, oldVal) {
      let start = newVal.start
      let end = newVal.end
      if (start == null || end == null) {
        return
      }

      let textarea = this.$refs.textarea

      scrollTo(textarea, start)

      textarea.setSelectionRange(start, end)
      textarea.blur()
      textarea.focus()
    }
  },
  emits: ['update:modelValue'],
  methods: {
    scrollTop(x) {
      this.$refs.textarea.scrollTop = 0
    }
  },
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
