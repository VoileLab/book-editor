import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
  state: () => {
    return {
      showLines: true,
      showTime: true,
      showWordCount: true,
      view: false,
    }
  },
  persist: true,
})

