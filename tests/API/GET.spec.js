import { test, expect } from '@playwright/test';
import { attachStepScreenshot } from '../../API Services/api-screenshot.js';
import { UsersService } from '../../API Services/users-service.js';

test('Get All Users API Test', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);

  await test.step('Get all users', async () => 
  {
    const response = await users.getAll();
    const body = await response.json();

    await attachStepScreenshot(testInfo, 'Get All Users API Test - Response', { status: response.status(), body });
    expect(response.status()).toBe(200);
  });
});

test('Get All Users - Invalid Endpoint Test', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);

  await test.step('Request invalid users endpoint', async () => 
  {
    const response = await users.getInvalidEndpoint();
    const body = await response.json();

    await attachStepScreenshot(testInfo, 'Invalid Endpoint - Response', { status: response.status(), body });
    expect(response.status()).toBe(404);
  });
});

test('Validate User API Response', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);

  await test.step('Validate user list response', async () => 
  {
    const response = await users.getAll();
    const responseBody = await response.json();

    await attachStepScreenshot(testInfo, 'Validate User API Response - Response', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(200);
    expect(responseBody.data.length).toBeGreaterThan(0);
  });
});

test('Get All Users - Invalid Endpoint Expects 404', async ({ request }, testInfo) => 
{
  const users = new UsersService(request);

  await test.step('Request unknown users endpoint', async () => 
  {
    const response = await users.getInvalidEndpoint();
    const responseBody = await response.json();

    await attachStepScreenshot(testInfo, 'Invalid Endpoint Expects 404 - Response', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(404);
  });
});
