<template>
  <v-dialog transition="dialog-top-transition" v-model="show" @update:model-value="v => { if (!v) { close(); } }">
    <v-card>
      <v-toolbar color="primary" title="引入純文字檔" density="compact"></v-toolbar>
      <v-card-text>
        <v-file-input :key="fileInputKey" ref="fileInput" label="純文字檔" show-size accept="text/*"
          @change="addFile($event)"></v-file-input>
        【前 {{ previewLines.length }} 行】
        <v-virtual-scroll :items="previewLines" height="300">
          <template v-slot:default="{ item }">
            <p> {{ item }} </p>
          </template>
        </v-virtual-scroll>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="red" @click="bookStore.addContent({ content: text }); close()"
          :disabled="!text">確認</v-btn>
        <v-btn variant="outlined" @click="close">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useBookStore } from '@/store/book';
import { detect } from 'jschardet'
import iconv from 'iconv-lite'

const JSCHARDET_TO_ICONV_ENCODINGS = {
  'ibm866': 'cp866',
  'big5': 'cp950'
}

export default {
  name: 'import-txt-dialog',
  data: () => {
    return {
      show: false,
      text: '',
      encoding: '',
      previewLines: [],
      fileInputKey: 0,
    }
  },
  computed: {
    bookStore() {
      return useBookStore()
    },
  },
  methods: {
    open() {
      this.show = true
    },
    addFile(event) {
      if (!event.target.files) {
        return
      }

      const file = event.target.files[0]

      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        const rawContent = event.target.result
        console.log(rawContent)

        const { encoding, confidence } = detect(rawContent.toString())
        console.log(encoding, confidence)

        const iconvEncoding = JSCHARDET_TO_ICONV_ENCODINGS[encoding] || encoding
        const content = iconv.decode(rawContent, iconvEncoding)

        this.text = content
        this.encoding = encoding
        this.previewLines = content.split('\n').slice(0, 200)
      });
      reader.readAsBinaryString(file);
    },
    close() {
      this.show = false
      this.text = ''
      this.previewLines = []
      this.fileInputKey++
    },
  },
}

</script>