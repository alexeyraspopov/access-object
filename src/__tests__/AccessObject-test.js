import co from 'co';
import ff from 'fetch-mock';
import assert from 'assert';
import AccessObject from '../AccessObject';

describe('AccessObject', () => {
  let Resources;

  beforeEach(() => {
    Resources = new AccessObject('/resources/');
  });

  afterEach(() => {
    ff.restore();
  });

  it('should create new instances', co.wrap(function*() {
    const data = { firstName: 'Jon', lastName: 'Snow' };
    const body = { id: '48fga412bca', firstName: 'Jon', lastName: 'Snow' };

    ff.mock('/resources/', 'POST', { status: 201, body });

    const response = yield Resources.create(data);
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'POST', body: data, headers: {},
                       credentials: null };

    assert.equal(path, '/resources/');
    assert.deepEqual(request, expected, 'Request is missing some fields');
    assert.deepEqual(response, body, 'Response should be a created entity');
  }));

  it('should retrieve full list', co.wrap(function*() {
    // TODO: test for query
    const body = [{ id: '48fga412bca', firstName: 'Jon', lastName: 'Snow' }];

    ff.mock('/resources/', 'GET', { status: 200, body });

    const response = yield Resources.retrieve();
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'GET', body: null, headers: {},
                       credentials: null };

    assert.equal(path, '/resources/');
    assert.deepEqual(request, expected);
    assert.deepEqual(response, body);
  }));

  it('should retrieve one instance', co.wrap(function*() {
    const body = { id: '48fga412bca', firstName: 'Jon', lastName: 'Snow' };

    ff.mock('/resources/48fga412bca', 'GET', { status: 200, body });

    const response = yield Resources.retrieve('48fga412bca');
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'GET', body: null, headers: {},
                       credentials: null };

    assert.equal(path, '/resources/48fga412bca');
    assert.deepEqual(request, expected);
    assert.deepEqual(response, body);
  }));

  it('should retrieve with query', co.wrap(function*() {
    const body = [{ id: '48fga412bca', firstName: 'Jon', lastName: 'Snow' }];

    ff.mock(/\/resources\/\?.+/, 'GET', { status: 200, body });

    const response = yield Resources.retrieve(null, { age: 23, name: 'Jon' });
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'GET', body: null, headers: {},
                       credentials: null };

    assert.equal(path, '/resources/?age=23&name=Jon');
    assert.deepEqual(request, expected);
    assert.deepEqual(response, body);
  }));

  it('should retrieve one item with query', co.wrap(function*() {
    const body = { id: '48fga412bca', firstName: 'Jon', lastName: 'Snow' };

    ff.mock(/\/resources\/48fga412bca\?.+/, 'GET', { status: 200, body });

    const response = yield Resources.retrieve('48fga412bca', { age: 23,
                                                               name: 'Jon' });
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'GET', body: null, headers: {},
                       credentials: null };

    assert.equal(path, '/resources/48fga412bca?age=23&name=Jon');
    assert.deepEqual(request, expected);
    assert.deepEqual(response, body);
  }));

  it('should update instance', co.wrap(function*() {
    const body = { age: 23 };

    ff.mock('/resources/48fga412bca', 'PATCH', { status: 200, body });

    const response = yield Resources.update('48fga412bca', body);
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'PATCH', body, headers: {}, credentials: null };

    assert.equal(path, '/resources/48fga412bca');
    assert.deepEqual(request, expected);
    assert.deepEqual(response, body);
  }));

  it('should destroy instance', co.wrap(function*() {
    ff.mock('/resources/48fga412bca', 'DELETE', { status: 204 });

    const response = yield Resources.destroy('48fga412bca');
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'DELETE', body: null, headers: {},
                       credentials: null };

    assert.equal(path, '/resources/48fga412bca');
    assert.deepEqual(request, expected);
    assert.deepEqual(response, null);
  }));
});
