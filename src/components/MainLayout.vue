<template>
  <v-layout class="h-100">
    <v-navigation-drawer v-model="drawer">
      <v-list v-if="bookStore.bookAvailable">
        <draggable v-model="bookStore.currentBook.content.idList" item-key="x => x">
          <template #item="{ element, index }">
            <v-list-item link :title="'第' + (index + 1) + '章: ' + bookStore.currentBook.content.data[element].title"
              :active="element == bookStore.editState.currentContentID"
              @click="bookStore.editState.currentContentID = element"></v-list-item>
          </template>
        </draggable>
        <v-list-item link prepend-icon="mdi-plus" title="加新章節" @click="bookStore.addContent"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <app-bar @click-nav-icon="drawer = !drawer"></app-bar>

    <v-main>
      <v-container class="h-100 w-75">
        <editarea v-if="bookStore.contentAvailable" :showLines="settingStore.showLines"
          v-model="bookStore.currentContent.content"></editarea>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import AppBar from "./AppBar.vue"

import Editarea from "./Editarea.vue"

import { useSettingStore } from "@/store/setting"
import { useBookStore } from "@/store/book"

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
  computed: {
    bookStore() {
      return useBookStore()
    },
    settingStore() {
      return useSettingStore()
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