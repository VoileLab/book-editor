// Utilities
import { defineStore } from 'pinia'

import { Book, Content } from '../util/book'

export const useBookStore = defineStore('book', {
  state: () => {
    return {
      /** @type {Book[]} */
      books: [new Book()],

      editState: {
        currentBookIndex: 0,
        currentContentID: '',
      },
    }
  },
  getters: {
    currentBook() {
      if (!this.bookAvailable) {
        return new Book()
      }
      return this.books[this.editState.currentBookIndex]
    },
    currentContent() {
      if (!this.contentAvailable) {
        return new Content('', '')
      }
      return this.currentBook.getContentByID(this.editState.currentContentID)
    },
    currentContentIdx() {
      if (!this.contentAvailable) {
        return -1
      }
      return this.currentBook.getContentIndex(this.editState.currentContentID)
    },
    bookAvailable() {
      return this.editState.currentBookIndex >= 0 && this.editState.currentBookIndex < this.books.length
    },
    contentAvailable() {
      return this.bookAvailable && this.editState.currentContentID != ''
    },
  },
  actions: {
    /**
     * @param {{title: null | string, content: null | string, index: null | number}} options 
     */
    addContent(options = {}) {
      this.editState.currentContentID = this.currentBook.addContent(options)
    },

    deleteCurrentContent() {
      this.editState.currentContentID = this.currentBook.deleteContent(
        this.editState.currentContentID)
    },

    addBook() {
      this.books.push(new Book())
    },

    selectBook(bookIndex) {
      this.editState.currentBookIndex = bookIndex
      if (this.currentBook.content.idList.length > 0) {
        this.editState.currentContentID = this.currentBook.content.idList[0]
      } else {
        this.editState.currentContentID = ''
      }
    },

    deleteBook(bookIndex) {
      this.books.splice(bookIndex, 1)
      if (this.editState.currentBookIndex >= this.books.length) {
        this.editState.currentBookIndex -= 1
      }
    },
  },
  persist: {
    afterRestore: (ctx) => {
      const newBooks = []
      for (const v of ctx.store.books) {
        const book = new Book()
        book.restoreFromDict(v)
        newBooks.push(book)
      }
      ctx.store.books = newBooks
    },
  },
})
