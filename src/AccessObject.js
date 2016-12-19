/* global fetch */
import url from 'url';
import invariant from 'invariant';
import warning from 'warning';

const DEFAULT_OPTIONS = { key: 'id', cache: false, credentials: null,
                          headers: {} };

const ALLOWED_METHODS = ['GET', 'POST', 'PATCH', 'DELETE',
                         'PUT', 'OPTIONS', 'HEAD'];

export default class AccessObject {
  /**
   * @param {string} endpoint
   * @param {object} options
   */
  constructor(endpoint, options = {}) {
    invariant(typeof endpoint === 'string' && endpoint.length > 0,
              'AccessObject: resource endpoint should be a non empty string. ' +
              'Instead got %s', endpoint);

    // https://nodejs.org/api/url.html
    this.endpoint = url.parse(endpoint);
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  /**
   * Make an HTTP request to provided endpoint. Utility method that is used
   * by higher level API methods.
   * @protected
   * @param {string} method
   * @param {object} body
   * @param {object} options
   * @return Promise<Response>
   */
  request(endpoint, method, body = null, options) {
    const headers = Object.assign({}, this.options.headers,
                                  options.headers || {});

    invariant(ALLOWED_METHODS.includes(method),
              'AccessObject: unacceptable HTTP method %s. Please consider ' +
              'using one of these: %s', method, ALLOWED_METHODS);

    return fetch(endpoint, { method, body, headers,
                             credentials: this.options.credentials });
  }

  /**
   * Make a POST request to create new entity with provided data.
   * @param {object} data
   * @param {object} options
   * @return Promise<Resource|Location>
   */
  create(data, options = {}) {
    const endpoint = url.format(this.endpoint);

    return this.request(endpoint, 'POST', data, options).then(response => {
      if (!response.ok) {
        throw response;
      }

      switch (response.status) {
      case 201:
        return response.json().then(data => {
          warning(data instanceof Object,
                  'AccessObject: status code is 201 and created resource is ' +
                  'expected to be an object in response body. ' +
                  'Instead got %s', data);

          warning(!Array.isArray(data),
                  'AccessObject: expected to receive created entity only. ' +
                  'Instead got an array %s', data);

          return data;
        });
      case 202:
        const location = response.headers.get('Location');

        warning(typeof location === 'string',
                'AccessObject: status code is 202, expected header Location');

        return location || response.json();
      default:
        warning(false,
                'AccessObject: status code 201 or 202 is expected. ' +
                'Instead got %s', response.status);

        return response.json();
      }
    });
  }

  /**
   * Make a GET request to retrieve single or list of entities.
   * @param {string|null} key
   * @param {object} query
   * @param {object} options
   * @return Promise
   */
  retrieve(key = null, query = {}, options = {}) {
    const shouldRetrieveList = key === null;

    const resolved = url.resolve(this.endpoint, key || '');

    const parsed = url.parse(resolved);
    parsed.query = query;

    const endpoint = url.format(parsed);

    return this.request(endpoint, 'GET', null, options).then(response => {
      if (!response.ok) {
        throw response;
      }

      warning(response.status === 200,
              'AccessObject: expected status code is 200. ' +
              'Instead got %s', response.status);

      return response.json();
    }).then(data => {
      warning(!shouldRetrieveList || Array.isArray(data),
              'AccessObject: expected to receive an array. ' +
              'Instead got %s', data);

      return data;
    });
  }

  /**
   * Make a PATCH request to update single entity.
   * http://restful-api-design.readthedocs.io/en/latest/methods.html#patch-vs-put
   * @param {string} key
   * @param {object} data
   * @param {object} options
   * @return Promise
   */
  update(key, data, options = {}) {
    invariant(typeof key === 'string',
              'AccessObject: resource id should be a non empty string. ' +
              'Instead got %s', key);

    const endpoint = url.resolve(this.endpoint, key);

    return this.request(endpoint, 'PATCH', data, options).then(response => {
      if (!response.ok) {
        throw response;
      }

      switch (response.status) {
      case 200:
        return response.json();

      case 202:
        const location = response.headers.get('Location');

        warning(typeof location === 'string',
                'AccessObject: status code is 202 and Location is expected');

        return location || response.json();

      default:
        warning(false,
                'AccessObject: status code 200 or 202 is expected. ' +
                'Instead got %s', response.status);

        return response.json();
      }
    });
  }

  /**
   * Make a DELETE request to destroy single entity.
   * @param {object} key
   * @param {object} options
   * @return Promise
   */
  destroy(key, options = {}) {
    invariant(typeof key === 'string',
              'AccessObject: resource id should be a non empty string. ' +
              'Instead got %s', key);

    const endpoint = url.resolve(this.endpoint, key);

    return this.request(endpoint, 'DELETE', null, options).then(response => {
      if (!response.ok) {
        throw response;
      }

      switch (response.status) {
      case 204:
        return null;

      case 202:
        const location = response.headers.get('Location');

        warning(typeof location === 'string',
                'AccessObject: status code is 202 and Location is expected');

        return location || response.json();

      default:
        warning(false,
                'AccessObject: status code 204 or 202 is expected. ' +
                'Instead got %s', response.status);

        return response.json();
      }
    });
  }
}
