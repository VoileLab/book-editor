import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => {
    return {
      show_find_and_replace: false,
      select: {},
    }
  },
})

