<template>
  <v-navigation-drawer>
    <v-card class="mx-auto" color="grey-lighten-3">
      <v-card-text>
        <v-text-field label="尋找文字" variant="outlined" append-inner-icon="mdi-magnify" density="compact"
          v-model="findText" @click:append-inner="find" />

        <v-expansion-panels v-model="expandList">
          <v-expansion-panel title="取代" value="replace">
            <v-expansion-panel-text>
              <v-text-field label="取代文字" variant="outlined" append-inner-icon="mdi-find-replace" density="compact"
                v-model="replaceText" @click:append-inner="replaceAll" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-divider></v-divider>

        <v-list v-if="results.length">
          <v-virtual-scroll :height="300" :items="results">
            <template v-slot:default="{ item, index }">
              <v-list-item :key="index" :title="bookStore.currentBook.getContentByID(item.id).title"
                append-icon="mdi-close" :subtitle="item.line" @click="select(index)">
                <template v-slot:append>
                  <v-btn color="grey-lighten-1" icon="mdi-find-replace" variant="text" @click="replace(index)"
                    v-if="expandList"></v-btn>
                  <v-btn color="grey-lighten-1" icon="mdi-close" variant="text"
                    @click="results.splice(index, 1)"></v-btn>
                </template>
              </v-list-item>
            </template>
          </v-virtual-scroll>
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
      expandList: [],
      findText: '',
      replaceText: '',
      results: [],
    }
  },
  methods: {
    find() {
      const searchStrLen = this.findText.length

      if (searchStrLen == 0) {
        this.results = []
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
    replaceAll() {
      const currentBook = this.bookStore.currentBook
      for (const contentID of currentBook.content.idList) {
        let content = currentBook.content.data[contentID]

        content.content = content.content.replace(this.findText, this.replaceText)
      }
    },
    replace(idx) {
      const result = this.results[idx]

      let content = this.bookStore.currentBook.getContentByID(result.id)
      let data = content.content

      content.content = data.substring(0, result.start) + this.replaceText + data.substring(result.end)

      this.results.splice(idx, 1)
    }
  },
}
</script>
