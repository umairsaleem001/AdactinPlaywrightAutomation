import { randomUUID } from 'node:crypto';
import { test, expect } from '@playwright/test';
import { createTestUser, createTestUserData } from '../../API Services/users.js';
import { attachStepScreenshot } from '../../API Services/api-screenshot.js';
import { AuthService } from '../../API Services/auth-service.js';
import { UsersService } from '../../API Services/users-service.js';
import { readResponseBody } from '../../API Services/api-service.js';

test('Create User API Test', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);
  const user = createTestUserData();

  await test.step('Register user', async () => 
  {
    const response = await users.register(user);
    const responseBody = await readResponseBody(response);

    await attachStepScreenshot(testInfo, 'Create User API Test - Response', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(201);
  });
});

test('Create User - Missing Required Field Expects 400', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);

  await test.step('Register without password', async () => 
  {
    const response = await users.register

    ({
      fullname: 'Umair Saleem',
      email: 'umair_missing@example.com',
      username: 'umair_missing'
    });

    const responseBody = await readResponseBody(response);

    await attachStepScreenshot(testInfo, 'Create User - Missing Required Field Expects 400', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(400);
  });
});

test('Create User - Invalid Email Format Expects 409', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);

  await test.step('Register with invalid email', async () => 
  {
    const response = await users.register

    ({
      fullname: 'Umair Saleem',
      email: 'invalid-email-format',
      username: 'umair_email_test',
      password: 'Password123!'
    });

    const responseBody = await readResponseBody(response);

    await attachStepScreenshot(testInfo, 'Create User - Invalid Email Format Expects 409', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(409);
  });
});

test('Login User API Test', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);
  const auth = new AuthService(request);
  let user;

  await test.step('Register user', async () => 
  {
    user = await createTestUser(users);
  });

  await test.step('Login user', async () => 
  {
    const response = await auth.login(user);
    const responseBody = await readResponseBody(response);

    await attachStepScreenshot(testInfo, 'Login User API Test - Response', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(200);
  });
});

test('Login User - Incorrect Password Expects 401', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);
  const auth = new AuthService(request);
  let user;

  await test.step('Register user', async () => 
  {
    user = await createTestUser(users);
  });

  await test.step('Login with incorrect password', async () => 
  {
    const response = await auth.login({ ...user, password: 'WrongPassword999!' });
    const responseBody = await readResponseBody(response);

    await attachStepScreenshot(testInfo, 'Login User - Incorrect Password Expects 401', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(401);
  });
});

test('Login User - Missing Field Expects 400', async ({ request }, testInfo) => 
{
  const auth = new AuthService(request);

  await test.step('Login without password', async () => 
  {
    const response = await auth.login
    ({
      email: 'haristester@example.com',
      username: 'haristester'
    });

    const responseBody = await readResponseBody(response);

    await attachStepScreenshot(testInfo, 'Login User - Missing Field Expects 400', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(400);
  });
});

test('Login User - Unregistered Email Expects 404', async ({ request }, testInfo) => 
{
  const auth = new AuthService(request);
  const id = randomUUID().replaceAll('-', '');

  await test.step('Login with unregistered credentials', async () => 
  {
    const response = await auth.login
    ({
      email: `unregistered-${id}@example.com`,
      username: `unregistered_${id}`,
      password: 'Password123!'
    });

    const responseBody = await readResponseBody(response);
    
    await attachStepScreenshot(testInfo, 'Login User - Unregistered Email Expects 404', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(404);
  });
});
