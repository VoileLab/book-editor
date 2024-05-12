import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => {
    return {
      showFindAndReplace: false,
      select: {},
    }
  },
})

