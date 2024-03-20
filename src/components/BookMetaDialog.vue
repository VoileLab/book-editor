<template>
  <v-dialog transition="dialog-top-transition" v-model="show">
    <v-card>
      <v-toolbar color="primary" title="書籍資料" density="compact"></v-toolbar>
      <v-card-text>
        <v-tabs v-model="tab">
          <v-tab value="meta">Meta</v-tab>
          <v-tab value="bookcover">封面</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="meta">
            <v-text-field label="書名" v-model="bookStore.currentBook.meta.title"></v-text-field>
            <v-text-field label="作者" v-model="bookStore.currentBook.meta.author"></v-text-field>
            <v-textarea label="簡介" v-model="bookStore.currentBook.meta.description"></v-textarea>
          </v-window-item>
          <v-window-item value="bookcover">
            <v-file-input label="上傳書籍封面" :key="fileInputKey"
              @change="setBookcover($event); this.fileInputKey++"></v-file-input>
            <v-row>
              <v-col cols="12" md="4">
                <v-img v-if="bookStore.currentBook.meta.bookCover" :src="bookStore.currentBook.meta.bookCover" />
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useBookStore } from '@/store/book';
import { fileToBase64 } from '@/util/base64';

export default {
  name: 'book-meta-dialog',
  data: () => {
    return {
      show: false,
      fileInputKey: 0,
      tab: '',
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
    async setBookcover(event) {
      if (!event.target.files) {
        return
      }

      const file = event.target.files[0]
      this.bookStore.currentBook.meta.bookCover = await fileToBase64(file)
    },
  },
}

</script>