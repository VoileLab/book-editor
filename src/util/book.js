export class Content {
  /**
   * @param {string} title 
   * @param {string} content 
   */
  constructor(title, content) {
    this.title = title
    this.content = content

    /** @type {string[]} */
    this.imgs = []
  }

  restoreFromDict(o) {
    this.title = o.title
    this.content = o.content
    this.imgs = o.imgs || []
  }
}

export class Book {
  constructor() {
    this.meta = {
      title: '',
      author: '',
      description: '',
      bookCover: '',
    }

    this.content = {
      /** @type {string[]} */
      idList: [],

      /** @type {Object.<string, Content>} */
      data: {},
    }
  }

  usedSize() {
    return JSON.stringify(this).length
  }

  restoreFromDict(o) {
    this.meta = o.meta
    this.content.idList = o.content.idList
    for (const [k, v] of Object.entries(o.content.data)) {
      const c = new Content()
      c.restoreFromDict(v)
      this.content.data[k] = c
    }
  }

  genNewContentID() {
    let i = this.content.idList.length
    while (true) {
      const newID = 'id' + i
      if (this.content.data[newID]) {
        i += 1
        continue
      }
      return newID
    }
  }

  /**
   * @param {{title: null | string, content: null | string, index: null | number}} options 
   * @returns {string} new content id
   */
  addContent(options = {}) {
    const newID = this.genNewContentID()
    this.content.data[newID] = new Content(
      options.title || 'NewContent',
      options.content || '',
    )

    if (options.index == null) {
      this.content.idList.push(newID)
    } else {
      this.content.idList.splice(options.index, 0, newID)
    }

    return newID
  }

  /**
   * @param {string} contentID
   * @returns {string} next content id
   */
  deleteContent(contentID) {
    delete this.content.data[contentID]
    const idx = this.content.idList.indexOf(contentID)
    this.content.idList.splice(idx, 1)
    if (idx - 1 >= 0) {
      return this.content.idList[idx - 1]
    }
    return ''
  }

  /**
   * @param {string} contentID 
   * @returns {Content} content
   */
  getContentByID(contentID) {
    return this.content.data[contentID]
  }

  /**
   * @param {number} contentIndex 
   * @returns {Content} content
   */
  getContentByIndex(contentIndex) {
    return this.content.data[this.content.idList[contentIndex]]
  }

  /**
   * @param {string} contentID 
   * @returns {number}
   */
  getContentIndex(contentID) {
    return this.content.idList.indexOf(contentID)
  }
}
