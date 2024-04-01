<template>
  <v-dialog transition="dialog-top-transition" max-width="50%" v-model="show">
    <v-card>
      <v-toolbar color="primary" title="設定" density="compact"></v-toolbar>
      <div class="d-flex flex-row">
        <v-tabs v-model="tab" direction="vertical" color="primary">
          <v-tab value="appearance">
            外觀
          </v-tab>
          <v-tab value="books">
            書籍
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="appearance">
            <v-card flat>
              <v-card-text>
                <v-switch color="primary" label="顯示行線" v-model="settingStore.showLines"></v-switch>
                <v-switch color="primary" label="顯示時間" v-model="settingStore.showTime"></v-switch>
                <v-switch color="primary" label="顯示字數" v-model="settingStore.showWordCount"></v-switch>
              </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item value="books">
            <v-btn @click="bookStore.addBook()" color="primary" variant="outlined">新增書籍</v-btn>
            <v-card flat>
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">
                      封面
                    </th>
                    <th class="text-left">
                      標題
                    </th>
                    <th class="text-left">
                      作者
                    </th>
                    <th class="text-middle">
                      編輯
                    </th>
                    <th class="text-middle">
                      刪除
                    </th>
                    <th class="text-left">
                      大小 (MBs)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book, i in bookStore.books" :key="i">
                    <td>
                      <v-img v-if="book.meta.bookCover" :src="book.meta.bookCover" />
                    </td>
                    <td>
                      {{ book.meta.title || 'untitled' }}
                    </td>
                    <td>
                      {{ book.meta.author || '-' }}
                    </td>
                    <td>
                      <v-btn color="primary" variant="outlined" v-if="bookStore.editState.currentBookIndex != i"
                        @click="bookStore.selectBook(i)">
                        <v-icon> mdi-pencil </v-icon>
                      </v-btn>
                      <p v-else>
                        <v-icon> mdi-pencil </v-icon>
                      </p>
                    </td>
                    <td>
                      <v-btn color="warning" variant="outlined" @click="deleteBook(i)">
                        <v-icon> mdi-delete </v-icon>
                      </v-btn>
                    </td>
                    <td>
                      {{ (book.usedSize() / 1024 / 1024).toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-window-item>
        </v-window>
      </div>
    </v-card>
    <delete-dialog ref="deleteDialog"></delete-dialog>
  </v-dialog>
</template>

<script>
import { useSettingStore } from '@/store/setting';
import { useBookStore } from '@/store/book';
import DeleteDialog from './DeleteDialog.vue';

export default {
  name: 'setting-dialog',
  data: () => {
    return {
      show: false,
      tab: '',
    }
  },
  computed: {
    settingStore() {
      return useSettingStore()
    },
    bookStore() {
      return useBookStore()
    },
  },
  methods: {
    open() {
      this.show = true
    },
    async deleteBook(idx) {
      if (await this.$refs.deleteDialog.open(this.bookStore.books[idx].meta.title)) {
        this.bookStore.deleteBook(idx)
      }
    },
  },
}

</script>