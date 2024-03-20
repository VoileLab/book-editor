<template>
  <v-dialog transition="dialog-top-transition" v-model="show">
    <v-card>
      <v-toolbar color="primary" title="插圖" density="compact"></v-toolbar>
      <v-card-text>
        <v-file-input label="Upload images" :key="fileInputKey"
          @change="addImages($event); this.fileInputKey++"></v-file-input>
        <v-row>
          <v-col cols="12" md="4" v-for="element, index in bookStore.currentContent.imgs">
            <v-img :src="element" class="text-right pa-2">
              <v-btn icon="mdi-trash-can" color="warning" @click="bookStore.currentContent.imgs.splice(index, 1)"></v-btn>
            </v-img>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useBookStore } from '@/store/book';
import { fileToBase64 } from '@/util/base64';

export default {
  name: 'images-dialog',
  data: () => {
    return {
      show: false,
      fileInputKey: 0,
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
    async addImages(event) {
      if (!event.target.files) {
        return
      }

      for (var imgFile of event.target.files) {
        const base64 = await fileToBase64(imgFile)
        this.bookStore.currentContent.imgs.push(base64)
      }
    },
  },
}

</script>