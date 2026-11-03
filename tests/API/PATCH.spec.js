import { test, expect } from '@playwright/test';
import { API_BASE_URL, readResponseBody } from '../../API Services/api-service.js';
import { attachStepScreenshot } from '../../API Services/api-screenshot.js';

const JSON_PLACEHOLDER_API_BASE_URL = 'https://jsonplaceholder.typicode.com';

test('PATCH TC 01 - Valid Post Update', async ({ request }, testInfo) =>
{
  await test.step('Update post with valid data on JSONPlaceholder', async () =>
  {
    const response = await request.patch(`${JSON_PLACEHOLDER_API_BASE_URL}/posts/1`,
    {
      data:
      {
        title: 'Updated post title',
        body: 'Updated post body'
      }
    });
    const responseBody = await readResponseBody(response);

    await attachStepScreenshot(testInfo, 'PATCH Post API Test - Response', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(200);
    expect(responseBody.id).toBe(1);
    expect(responseBody.title).toBe('Updated post title');
    expect(responseBody.body).toBe('Updated post body');
  });
});

test('PATCH TC 02 - Update Single Field', async ({ request }, testInfo) =>
{
  await test.step('Update only the post title on JSONPlaceholder', async () =>
  {
    const response = await request.patch(`${JSON_PLACEHOLDER_API_BASE_URL}/posts/1`,
    {
      data: { title: 'Updated single-field title' }
    });
    const responseBody = await readResponseBody(response);

    await attachStepScreenshot(testInfo, 'PATCH Post - Update Single Field - Response', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(200);
    expect(responseBody.id).toBe(1);
    expect(responseBody.title).toBe('Updated single-field title');
    expect(responseBody.body).toBeTruthy();
  });
});

test('PATCH TC 03 - Update Multiple Fields', async ({ request }, testInfo) =>
{
  await test.step('Update the post title and body on JSONPlaceholder', async () =>
  {
    const response = await request.patch(`${JSON_PLACEHOLDER_API_BASE_URL}/posts/1`,
    {
      data:
      {
        title: 'Updated multiple-field title',
        body: 'Updated multiple-field body'
      }
    });
    const responseBody = await readResponseBody(response);

    await attachStepScreenshot(testInfo, 'PATCH Post - Update Multiple Fields - Response', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(200);
    expect(responseBody.id).toBe(1);
    expect(responseBody.title).toBe('Updated multiple-field title');
    expect(responseBody.body).toBe('Updated multiple-field body');
  });
});

test('PATCH TC 04 - Update Unknown Post ID', async ({ request }, testInfo) =>
{
  await test.step('Update a post ID that does not exist on JSONPlaceholder', async () =>
  {
    const response = await request.patch(`${JSON_PLACEHOLDER_API_BASE_URL}/posts/101`,
    {
      data: { title: 'Updated unknown post' }
    });
    const responseBody = await readResponseBody(response);

    await attachStepScreenshot(testInfo, 'PATCH Post - Unknown ID Returns Submitted Fields - Response', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(200);
    expect(responseBody).toEqual({ title: 'Updated unknown post' });
  });
});

test('PATCH TC 05 - Unsupported PATCH Endpoint', async ({ request }, testInfo) =>
{
  await test.step('Request PATCH on existing account endpoint', async () =>
  {
    const response = await request.patch(`${API_BASE_URL}/users/replace-account`);
    const responseBody = await readResponseBody(response);

    await attachStepScreenshot(testInfo, 'PATCH User - Unsupported Method Expects 404', { status: response.status(), body: responseBody });
    expect(response.status()).toBe(404);
  });
});
