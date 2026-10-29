import { test, expect } from '@playwright/test';
import { createTestUser } from '../../API Services/users.js';
import { attachStepScreenshot } from '../../API Services/api-screenshot.js';
import { AuthService } from '../../API Services/auth-service.js';
import { UsersService } from '../../API Services/users-service.js';

test('Delete User API Test', async ({ request }, testInfo) => 
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
    const loginBody = await response.json();

    await attachStepScreenshot(testInfo, 'Delete User API Test - Login Step', { status: response.status(), body: loginBody });
    expect(response.status()).toBe(200);
  });

  await test.step('Delete account', async () => 
  {
    const response = await users.deleteAccount();
    const responseBody = await response.json();

    await attachStepScreenshot(testInfo, 'Delete User API Test - Delete Step', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(200);
  });
});

test('Delete User - Without Login Expects 401', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);

  await test.step('Delete account without login', async () => 
  {
    const response = await users.deleteAccount();
    const responseBody = await response.json();

    await attachStepScreenshot(testInfo, 'Delete User - Without Login Expects 401', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(401);
  });
});

test('Delete User - Invalid Endpoint Expects 404', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);

  await test.step('Delete invalid endpoint', async () => 
  {
    const response = await users.deleteInvalidEndpoint();
    const responseBody = await response.json();

    await attachStepScreenshot(testInfo, 'Delete User - Invalid Endpoint Expects 404', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(404);
  });
});
