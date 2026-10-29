import { test, expect } from '@playwright/test';
import { createTestUser } from '../../API Services/users.js';
import { attachStepScreenshot } from '../../API Services/api-screenshot.js';
import { AuthService } from '../../API Services/auth-service.js';
import { UsersService } from '../../API Services/users-service.js';

test('PUT User API Test', async ({ request }, testInfo) => 
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

    await attachStepScreenshot(testInfo, 'PUT User API Test - Login Step', { status: response.status(), body: loginBody });
    expect(response.status()).toBe(200);
  });

  await test.step('Replace account details', async () => 
  {
    const response = await users.replaceAccount(
    {
      fullname: 'Updated User',
      email: `updated-${user.email}`,
      username: `updated_${user.username}`
    });

    const responseBody = await response.json();

    await attachStepScreenshot(testInfo, 'PUT User API Test - Update Step', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(200);
  });
});

test('PUT User - Without Login Expects 401', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);

  await test.step('Update account without login', async () => 
  {
    const response = await users.replaceAccount(
    {
      fullname: 'Updated User',
      email: 'updateduser@example.com',
      username: 'updatedUser'
    });

    const responseBody = await response.json();

    await attachStepScreenshot(testInfo, 'PUT User - Without Login Expects 401', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(401);
  });
});

test('PUT User - Missing Required Fields Expects 400', async ({ request }, testInfo) => 
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

    await attachStepScreenshot(testInfo, 'PUT User - Missing Required Fields Expects 400 - Login Step', { status: response.status(), body: loginBody });
    expect(response.status()).toBe(200);
  });

  await test.step('Replace account with missing fields', async () => 
  {
    const response = await users.replaceAccount(
    {
      email: 'incomplete@example.com',
      username: 'incompleteUser'
    });

    const responseBody = await response.json();

    await attachStepScreenshot(testInfo, 'PUT User - Missing Required Fields Expects 400 - Update Step', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(400);
  });
});

test('PUT User - Invalid Endpoint Expects 404', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);

  await test.step('Update invalid endpoint', async () => 
  {
    const response = await users.putInvalidEndpoint(
    {
      fullname: 'Updated User',
      email: 'updateduser@example.com',
      username: 'updatedUser'
    });

    const responseBody = await response.json();

    await attachStepScreenshot(testInfo, 'PUT User - Invalid Endpoint Expects 404', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(404);
  });
});
