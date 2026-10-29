import { ApiService } from './api-service.js';

export class AuthService extends ApiService 
{
  login(credentials) 
  {
    return this.post('/users/login', { data: credentials });
  }
}
