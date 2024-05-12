<template>
  <v-navigation-drawer>
    <v-card class="mx-auto" color="grey-lighten-3">
      <v-card-text>
        <v-text-field label="尋找文字" variant="outlined" append-inner-icon="mdi-magnify" density="compact"
          v-model="findText" @click:append-inner="find" />
        <v-list v-if="results.length">
          <v-list-item v-for="(result, idx) in results" :key="idx"
            :title="bookStore.currentBook.getContentByID(result.id).title"
            :subtitle="result.line"
            @click="bookStore.editState.currentContentID = result.id"></v-list-item>
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

export default {
  name: 'find-drawer',
  computed: {
    bookStore() {
      return useBookStore()
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
      const currentBook = this.bookStore.currentBook
      let results = []
      for (const contentID of currentBook.content.idList) {
        const content = currentBook.content.data[contentID]
        const lines = content.content.split('\n')
        for (const lineIdx in lines) {
          const line = lines[lineIdx]
          if (line.includes(this.findText)) {
            results.push({
              id: contentID,
              line: line,
            })
          }
        }
        this.results = results
      }
    },
  }, 
}
</script>
