import { ApiService } from './api-service.js';

export class UsersService extends ApiService 
{
  register(user) 
  {
    return this.post('/users/register', { data: user });
  }

  getAll() 
  {
    return this.get('/users/all-users');
  }

  getInvalidEndpoint() 
  {
    return this.get('/users/invalid-endpoint');
  }

  postAllUsers(data) 
  {
    return this.post('/users/all-users', { data });
  }

  replaceAccount(data) 
  {
    return this.put('/users/replace-account', { data });
  }

  putInvalidEndpoint(data) 
  {
    return this.put('/users/invalid-replace-endpoint', { data });
  }

  deleteAccount() 
  {
    return this.delete('/users/delete-account');
  }

  deleteInvalidEndpoint() 
  {
    return this.delete('/users/invalid-delete-endpoint');
  }
}