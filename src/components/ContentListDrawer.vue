<template>
  <v-navigation-drawer>
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
</template>

<script>
import { useBookStore } from "@/store/book"

import draggable from 'vuedraggable'

export default {
  name: 'find-drawer',
  components: {
    draggable,
  },
  computed: {
    bookStore() {
      return useBookStore()
    },
  },
}
</script>
