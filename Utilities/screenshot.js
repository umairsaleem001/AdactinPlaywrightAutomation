import { test } from '@playwright/test';

export async function attachStepScreenshot(page, name) 
{
  await test.info().attach(name, 
  {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
}
export default async function attachScreenshotAfterEach(page, testInfo) 
{
  if (testInfo.status !== testInfo.expectedStatus) 
  {
    await testInfo.attach('screenshot', 
    {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  }
}