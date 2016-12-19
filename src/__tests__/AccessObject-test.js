import ff from 'fetch-mock';
import AccessObject from '../AccessObject';

describe('AccessObject', () => {
  let Resources;

  beforeEach(() => {
    Resources = new AccessObject('/resources/');
  });

  afterEach(() => {
    ff.restore();
  });

  it('should create new instances', async () => {
    const data = { firstName: 'Jon', lastName: 'Snow' };
    const body = { id: '48fga412bca', firstName: 'Jon', lastName: 'Snow' };

    ff.mock('/resources/', 'POST', { status: 201, body });

    const response = await Resources.create(data);
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'POST', body: data, headers: {},
                       credentials: null };

    expect(path).toBe('/resources/');
    expect(request).toMatchObject(expected);
    expect(response).toMatchObject(body);
  });

  it('should retrieve full list', async () => {
    // TODO: test for query
    const body = [{ id: '48fga412bca', firstName: 'Jon', lastName: 'Snow' }];

    ff.mock('/resources/', 'GET', { status: 200, body });

    const response = await Resources.retrieve();
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'GET', body: null, headers: {},
                       credentials: null };

    expect(path).toBe('/resources/');
    expect(request).toMatchObject(expected);
    expect(response).toMatchObject(body);
  });

  it('should retrieve one instance', async () => {
    const body = { id: '48fga412bca', firstName: 'Jon', lastName: 'Snow' };

    ff.mock('/resources/48fga412bca', 'GET', { status: 200, body });

    const response = await Resources.retrieve('48fga412bca');
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'GET', body: null, headers: {},
                       credentials: null };

    expect(path).toBe('/resources/48fga412bca');
    expect(request).toMatchObject(expected);
    expect(response).toMatchObject(body);
  });

  it('should retrieve with query', async () => {
    const body = [{ id: '48fga412bca', firstName: 'Jon', lastName: 'Snow' }];

    ff.mock(/\/resources\/\?.+/, 'GET', { status: 200, body });

    const response = await Resources.retrieve(null, { age: 23, name: 'Jon' });
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'GET', body: null, headers: {},
                       credentials: null };

    expect(path).toBe('/resources/?age=23&name=Jon');
    expect(request).toMatchObject(expected);
    expect(response).toMatchObject(body);
  });

  it('should retrieve one item with query', async () => {
    const body = { id: '48fga412bca', firstName: 'Jon', lastName: 'Snow' };

    ff.mock(/\/resources\/48fga412bca\?.+/, 'GET', { status: 200, body });

    const response = await Resources.retrieve('48fga412bca', { age: 23,
                                                               name: 'Jon' });
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'GET', body: null, headers: {},
                       credentials: null };

    expect(path).toBe('/resources/48fga412bca?age=23&name=Jon');
    expect(request).toMatchObject(expected);
    expect(response).toMatchObject(body);
  });

  it('should update instance', async () => {
    const body = { age: 23 };

    ff.mock('/resources/48fga412bca', 'PATCH', { status: 200, body });

    const response = await Resources.update('48fga412bca', body);
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'PATCH', body, headers: {}, credentials: null };

    expect(path).toBe('/resources/48fga412bca');
    expect(request).toMatchObject(expected);
    expect(response).toMatchObject(body);
  });

  it('should destroy instance', async () => {
    ff.mock('/resources/48fga412bca', 'DELETE', { status: 204 });

    const response = await Resources.destroy('48fga412bca');
    const [path, request] = ff.calls().matched[0];

    const expected = { method: 'DELETE', body: null, headers: {},
                       credentials: null };

    expect(path).toBe('/resources/48fga412bca');
    expect(request).toMatchObject(expected);
    expect(response).toBe(null);
  });
});
