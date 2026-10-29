import { test as base, expect } from '@playwright/test';
import BasePage from '../Pages/BasePage.js';

export const test = base.extend(
{
  pageSetup: [async ({ page }, use) => 
  {
    await new BasePage(page).navigate('/');
    await use();
  }, { auto: true }]
});

export { expect };