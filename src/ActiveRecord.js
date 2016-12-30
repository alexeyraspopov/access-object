export default class ActiveRecord {
  /**
   * @param {string} endpoint
   * @param {object} options
   */
  constructor(endpoint, options = {}) {

  }

  /**
   * @param {string} key — property name to fetch
   */
  get(key) { }

  /**
   * @param {string} key — property name to set
   * @param {any} value — new value
   */
  set(key, value) { }

  /**
   * @return {Promise} — send current state of a record to its endpoint
   */
  save() { }

  /**
   * @return {Promise} — make DELETE request to record's endpoint
   */
  destroy() { }
}
