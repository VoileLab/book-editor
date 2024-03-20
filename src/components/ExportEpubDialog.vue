<template>
  <v-dialog transition="dialog-top-transition" width="auto" v-model="show"
    @update:model-value="v => { if (!v) { closeExportEpub() } }">
    <v-card>
      <v-toolbar color="primary" title="Export EPUB" density="compact"></v-toolbar>
      <v-card-text>
        <v-btn color="primary" :disabled="prepared" @click="prepared = true; prepareEpub()"> 準備
        </v-btn>
        <v-btn color="primary" :disabled="!uri" :download="bookStore.currentBook.meta.title + '.epub'" :href="uri">
          下載 </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
  
<script>
import { makeEpub } from "@/util/epub.js"

import { useBookStore } from '@/store/book'


export default {
  name: 'export-epub-dialog',
  data: () => {
    return {
      show: false,
      prepared: false,
      uri: '',
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
    async prepareEpub() {
      const blob = await makeEpub(this.bookStore.currentBook)
      this.uri = window.URL.createObjectURL(blob)
    },
    closeExportEpub() {
      this.prepared = false
      this.uri = ''
    },
  },
}

</script>
