<template>
  <v-navigation-drawer>
    <v-card class="mx-auto" color="grey-lighten-3">
      <v-card-text>
        <v-text-field label="尋找文字" variant="outlined" append-inner-icon="mdi-magnify" density="compact"
          v-model="findText" @click:append-inner="find" />
        <v-list v-if="results.length">
          <v-list-item v-for="(result, idx) in results" :key="idx"
            :title="bookStore.currentBook.getContentByID(result.id).title" :subtitle="result.line"
            @click="select(idx)"></v-list-item>
        </v-list>
        <p v-else>
          No result.
        </p>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import { useBookStore } from "@/store/book"
import { useUIStore } from '@/store/ui'

export default {
  name: 'find-drawer',
  computed: {
    bookStore() {
      return useBookStore()
    },
    uiStore() {
      return useUIStore()
    },
  },
  data: () => {
    return {
      findText: '',
      results: [],
    }
  },
  methods: {
    find() {
      const searchStrLen = this.findText.length

      if (searchStrLen == 0) {
        return
      }

      const currentBook = this.bookStore.currentBook
      let results = []
      for (const contentID of currentBook.content.idList) {
        const content = currentBook.content.data[contentID]

        let startIndex = 0
        let index = 0
        while ((index = content.content.indexOf(this.findText, startIndex)) > -1) {
          results.push({
            id: contentID,
            line: content.content.substring(index - 5, index + searchStrLen + 5),
            start: index,
            end: index + searchStrLen,
          })
          startIndex = index + searchStrLen;
        }

        this.results = results
      }
    },
    select(idx) {
      const result = this.results[idx]
      this.bookStore.editState.currentContentID = result.id
      this.uiStore.select = {
        start: result.start,
        end: result.end,
      }
    },
  },
}
</script>
