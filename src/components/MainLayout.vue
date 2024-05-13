<template>
  <v-layout class="h-100">
    <v-navigation-drawer permanent rail>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" @click="showContentList = !showContentList"></v-list-item>
        <v-list-item prepend-icon="mdi-find-replace" @click="showFindAndReplace = !showFindAndReplace"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <content-list-drawer v-model="showContentList" />
    <find-drawer v-model="showFindAndReplace" />

    <app-bar></app-bar>

    <v-main>
      <v-container class="h-100 w-75">
        <editarea v-if="bookStore.contentAvailable" :readonly="settingStore.view" :showLines="settingStore.showLines"
          :select="uiStore.select" v-model="bookStore.currentContent.content" ref="editarea"></editarea>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import AppBar from "./AppBar.vue"
import Editarea from "./Editarea.vue"
import FindDrawer from "./FindDrawer.vue"
import ContentListDrawer from "./ContentListDrawer.vue"

import { useSettingStore } from "@/store/setting"
import { useBookStore } from "@/store/book"
import { useUIStore } from '@/store/ui'

export default {
  components: {
    Editarea,
  },
  data: () => {
    return {
      showContentList: true,
      showFindAndReplace: false,
    }
  },
  mounted() {
    document.addEventListener("keydown", this.onKeydown);
  },
  methods: {
    /** @param {KeyBoardEvent} e */
    onKeydown(e) {
      if (e.defaultPrevented) {
        // Do nothing if the event was already processed
        return
      }

      if (!this.settingStore.view) {
        return
      }

      let idx = this.bookStore.currentContentIdx
      if (idx == -1) {
        return
      }

      switch (e.key) {
        case "ArrowLeft":
          idx -= 1
          break
        case "ArrowRight":
          idx += 1
          break
        default:
          return
      }

      this.bookStore.setCurrentContentIdx(idx)
      this.$refs.selectedContentListItem.$el.scrollIntoView()
      this.$refs.editarea.scrollTop(0)
    }
  },
  computed: {
    bookStore() {
      return useBookStore()
    },
    settingStore() {
      return useSettingStore()
    },
    uiStore() {
      return useUIStore()
    },
  },
}
</script>
