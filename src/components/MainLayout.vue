<template>
  <v-layout class="h-100">
    <v-navigation-drawer v-model="drawer">
      <v-list v-if="bookStore.bookAvailable">
        <draggable v-model="bookStore.currentBook.content.idList" item-key="x => x">
          <template #item="{ element, index }">
            <v-list-item link :title="'第' + (index + 1) + '章: ' + bookStore.currentBook.content.data[element].title"
              :active="element == bookStore.editState.currentContentID"
              :ref="element == bookStore.editState.currentContentID ? 'selectedContentListItem' : ''"
              @click="bookStore.editState.currentContentID = element"></v-list-item>
          </template>
        </draggable>
        <v-list-item link prepend-icon="mdi-plus" title="加新章節" @click="bookStore.addContent"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="uiStore.show_find_and_replace">
      <v-card class="mx-auto" color="grey-lighten-3">
        <v-card-text>
          <v-text-field label="尋找文字" variant="outlined" append-inner-icon="mdi-magnify" density="compact"
            @click:append-inner="alert(1)" />
          <v-text-field label="取代文字" variant="outlined" append-inner-icon="mdi-find-replace" density="compact"
            @click:append-inner="alert(1)" />
        </v-card-text>
      </v-card>
    </v-navigation-drawer>

    <app-bar @click-nav-icon="drawer = !drawer"></app-bar>

    <v-main>
      <v-container class="h-100 w-75">
        <editarea v-if="bookStore.contentAvailable" :readonly="settingStore.view" :showLines="settingStore.showLines"
          v-model="bookStore.currentContent.content" ref="editarea"></editarea>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import AppBar from "./AppBar.vue"

import Editarea from "./Editarea.vue"

import { useSettingStore } from "@/store/setting"
import { useBookStore } from "@/store/book"
import { useUIStore } from '@/store/ui'

import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
    Editarea,
  },
  data: () => {
    return {
      drawer: null,
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

<style scoped>
input.title {
  outline: none;
  font-size: x-large;
  padding: 2px 2px;
}
</style>