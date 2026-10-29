import { randomUUID } from 'node:crypto';
import { expect } from '@playwright/test';
import { readResponseBody } from './api-service.js';

export function createTestUserData() 
{
  const id = randomUUID().replaceAll('-', '');
  return {
    fullname: `Umair Saleem ${id}`,
    email: `umair-${id}@example.com`,
    username: `umair_${id}`,
    password: 'Password123!'
  };
}

export async function createTestUser(users) 
{
  const user = createTestUserData();
  const response = await users.register(user);
  const responseBody = await readResponseBody(response);
  expect(response.status(), `User registration response: ${JSON.stringify(responseBody)}`).toBe(201);
  return user;
}
