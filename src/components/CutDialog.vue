<template>
  <v-dialog transition="dialog-top-transition" v-model="show" @update:model-value="v => { if (!v) { close(); } }"
    width="600">
    <v-card>
      <v-toolbar color="primary" title="切割當前章節"></v-toolbar>
      <v-card-text>
        <v-text-field label="標題正規表達式" v-model="reg" @change="regChange"></v-text-field>
        <v-divider></v-divider>
        <p>符合條件的標題：</p>
        <v-virtual-scroll :items="previewMatchedLines" height="320">
          <template v-slot:default="{ item }">
            <p>{{ item }}</p>
          </template>
        </v-virtual-scroll>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="primary" @click="apply(); close()" :disabled="!previewMatchedLines">確認</v-btn>
        <v-btn variant="outlined" @click="close">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useBookStore } from '@/store/book';

export default {
  name: 'cut-dialog',
  data: () => {
    return {
      show: false,
      reg: '第.*章',
      previewMatchedLines: [],
    }
  },
  computed: {
    bookStore() {
      return useBookStore()
    },
  },
  methods: {
    open() {
      this.show = true
    },
    regChange(event) {
      const newReg = new RegExp(event.target.value)
      const lines = []
      for (const line of this.bookStore.currentContent.content.split('\n')) {
        if (line.match(newReg)) {
          lines.push(line)
        }
      }
      this.previewMatchedLines = lines
    },
    apply() {
      const reg = new RegExp(this.reg)
      const content = this.bookStore.currentContent

      let curIdx = this.bookStore.currentContentIdx
      this.bookStore.deleteCurrentContent()

      let currentBody = ''
      let currentTitle = content.title
      for (const line of content.content.split('\n')) {
        if (line.match(reg)) {
          this.bookStore.addContent({
            title: currentTitle,
            content: currentBody,
            index: curIdx,
          })
          curIdx++
          currentTitle = line
          currentBody = ''
          continue
        }

        currentBody += line + '\n'
      }

      this.bookStore.addContent({
        title: currentTitle,
        content: currentBody,
        index: curIdx,
      })
    },
    close() {
      this.show = false
    },
  },
}

</script>