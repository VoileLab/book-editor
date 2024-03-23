<template>
  <v-app-bar density="compact" scroll-behavior="hide">
    <v-app-bar-nav-icon @click="$emit('click-nav-icon')"></v-app-bar-nav-icon>

    <input v-if="bookStore.contentAvailable" v-model="bookStore.currentContent.title" class="title" spellcheck="false" />

    <v-btn v-if="bookStore.contentAvailable" icon="mdi-trash-can" @click="deleteContent"> </v-btn>
    <v-btn v-if="bookStore.contentAvailable" icon="mdi-content-cut" @click="$refs.cutDialog.open()"></v-btn>
    <v-btn v-if="bookStore.contentAvailable" :icon="settingStore.view ? 'mdi-eye': 'mdi-pen'"
      @click="settingStore.view = !settingStore.view"></v-btn>

    <v-btn v-if="bookStore.bookAvailable" icon="mdi-plus" @click="bookStore.addContent({index: bookStore.editState.currentBookIndex})"></v-btn>

    <v-spacer></v-spacer>

    <v-menu v-if="bookStore.bookAvailable">
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-import" v-bind="props"> </v-btn>
      </template>
      <v-list>
        <v-list-item @click="$refs.importTxtDialog.open()">
          <v-list-item-title>匯入純文字檔案(.txt)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu v-if="bookStore.bookAvailable">
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-export" v-bind="props"> </v-btn>
      </template>
      <v-list>
        <v-list-item @click="$refs.exportTxtDialog.open()">
          <v-list-item-title>輸出純文字檔案(.txt)</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$refs.exportEpubDialog.open()">
          <v-list-item-title>輸出EPUB(.epub)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn icon="mdi-cog" @click="$refs.settingDialog.open()"> </v-btn>
    <v-btn v-if="bookStore.bookAvailable" icon="mdi-image" @click="$refs.imagesDialog.open()"></v-btn>
    <v-btn v-if="bookStore.bookAvailable" icon="mdi-book-settings" @click="$refs.bookMetaDialog.open()"> </v-btn>

    <v-chip v-if="settingStore.showWordCount && bookStore.contentAvailable" variant="text">字數: {{ wordCount }}</v-chip>
    <v-chip v-if="settingStore.showTime" variant="text"> {{ timeStr }} </v-chip>

    <setting-dialog ref="settingDialog"></setting-dialog>
    <images-dialog ref="imagesDialog"></images-dialog>
    <book-meta-dialog ref="bookMetaDialog"></book-meta-dialog>
    <export-txt-dialog ref="exportTxtDialog"></export-txt-dialog>
    <export-epub-dialog ref="exportEpubDialog"></export-epub-dialog>
    <import-txt-dialog ref="importTxtDialog"></import-txt-dialog>
    <delete-dialog ref="deleteDialog"></delete-dialog>
    <cut-dialog ref="cutDialog"></cut-dialog>
  </v-app-bar>
</template>

<script>
import SettingDialog from "./SettingDialog.vue"
import ImagesDialog from "./ImagesDialog.vue"
import BookMetaDialog from "./BookMetaDialog.vue"
import ExportTxtDialog from "./ExportTxtDialog.vue"
import ExportEpubDialog from "./ExportEpubDialog.vue"
import ImportTxtDialog from "./ImportTxtDialog.vue"
import DeleteDialog from "./DeleteDialog.vue"
import CutDialog from "./CutDialog.vue"

import { useBookStore } from "@/store/book"
import { useSettingStore } from "@/store/setting"

export default {
  name: 'app-bar',
  data: () => {
    return {
      timeStr: '',
    }
  },
  mounted() {
    this.getNow()
    setInterval(() => {
      this.getNow()
    }, 20000)
  },
  computed: {
    bookStore() {
      return useBookStore()
    },
    settingStore() {
      return useSettingStore()
    },
    wordCount() {
      if (!this.bookStore.currentContent) {
        return 0
      }

      let c = 0
      for (let ch of this.bookStore.currentContent.content) {
        if ('。，\n'.includes(ch)) {
          continue
        }
        c += 1
      }
      return c
    },
  },
  methods: {
    getNow() {
      const now = new Date()
      this.timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    async deleteContent() {
      const res = await this.$refs.deleteDialog.open(this.bookStore.currentContent.title)
      if (res) {
        this.bookStore.deleteCurrentContent()
      }
    }
  },
}

</script>

<style scoped>
input.title {
  outline: none;
  font-size: x-large;
  padding: 2px 2px;
}
</style>
