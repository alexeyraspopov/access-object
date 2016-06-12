# access-object

Data Access Object for your resources.

`AccessObject` works best with RESTful APIs.

## Example

```javascript
const Users = new AccessObject('/users');

Users.create({ firstName: 'Jon', lastName: 'Snow' });
// POST /users
// { firstName: 'Jon', lastName: 'Snow' }

Users.retrieve();
// GET /users

Users.retrieve('48fga412bca');
// GET /users/48fga412bca

Users.retrieve(null, { isActive: true });
// GET /users?isActive=true

Users.update('48fga412bca', { age: 23 });
// PATCH /users/48fga412bca
// { age: 23 }

Users.destroy('48fga412bca');
// DELETE /users/48fga412bca
```
