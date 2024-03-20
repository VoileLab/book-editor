<template>
  <v-dialog transition="dialog-top-transition" width="auto" v-model="show"
    @update:model-value="v => { if (!v) { closeExportTxt() } }">
    <v-card>
      <v-toolbar color="primary" title="Export TXT" density="compact"></v-toolbar>
      <v-card-text>
        <v-btn color="primary" :disabled="prepared" @click="prepared = true; prepareTxt()"> 準備
        </v-btn>
        <v-btn color="primary" :disabled="!body" :download="bookStore.currentBook.meta.title + '.txt'"
          :href="'data:text/plain;charset=utf-8,' + encodeURIComponent(body)">
          下載 </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
  
<script>
import { useBookStore } from '@/store/book'

export default {
  name: 'export-txt-dialog',
  data: () => {
    return {
      show: false,
      prepared: false,
      body: '',
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
    async prepareTxt() {
      const book = this.bookStore.currentBook
      const bodyList = []
      bodyList.push(`${book.meta.title}`)
      bodyList.push(`作者: ${book.meta.author}`)
      bodyList.push(`${book.meta.description}`)
      for (const [i, contentID] of book.content.idList.entries()) {
        const data = book.content.data[contentID]
        bodyList.push(`第${i + 1}章 ${data.title}`)
        bodyList.push(`${data.content}`)
      }

      this.body = bodyList.join('\n')
    },
    closeExportTxt() {
      this.prepared = false
      this.body = ''
    },
  },
}

</script>
