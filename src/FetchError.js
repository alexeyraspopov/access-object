/** Custom error type that contains failed response data */
class FetchError extends Error {
  /**
   * @param {string} message
   * @param {Response} response
   */
  constructor(message, response) {
    super(message);
    this.url = response.url;
    this.status = response.status;
    this.headers = response.headers;
  }

  get name() {
    return 'FetchError';
  }
}

module.exports = FetchError;
