<template>
  <v-dialog transition="dialog-top-transition" width="auto" v-model="show"
    @update:model-value="v => { if (!v) { closeExportJSON() } }">
    <v-card>
      <v-toolbar color="primary" title="Export JSON" density="compact"></v-toolbar>
      <v-card-text>
        <v-btn color="primary" :disabled="prepared" @click="prepared = true; prepareJSON()"> 準備
        </v-btn>
        <v-btn color="primary" :disabled="!body" :download="bookStore.currentBook.meta.title + '.json'"
          :href="'data:text/plain;charset=utf-8,' + encodeURIComponent(body)">
          下載 </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useBookStore } from '@/store/book'

export default {
  name: 'export-json-dialog',
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
    async prepareJSON() {
      this.body = JSON.stringify(this.bookStore.currentBook)
    },
    closeExportJSON() {
      this.prepared = false
      this.body = ''
    },
  },
}

</script>
