<template>
  <v-dialog transition="dialog-top-transition" width="auto" v-model="show"
    @update:model-value="v => { if (!v) { resolve(false); } }">
    <v-card>
      <v-toolbar color="red" title="刪除章節" density="compact"></v-toolbar>
      <v-card-text>
        確認刪除 {{ name }} ? 此動作將無法復原。
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="red" @click="resolve(true); show = false">確認</v-btn>
        <v-btn variant="outlined" @click="resolve(false); show = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
<script>
export default {
  name: 'delete-dialog',
  data: () => {
    return {
      show: false,
      name: '',
      resolve: null,
      reject: null,
    }
  },
  computed: {
    bookStore() {
      return useBookStore()
    },
  },
  methods: {
    open(name) {
      this.show = true
      this.name = name
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
  },
}

</script>
