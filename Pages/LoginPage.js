import { test } from '@playwright/test';
import { attachStepScreenshot } from '../Utilities/screenshot';

class LoginPage 
{
  constructor(page) 
  {
    this.page = page;

    this.username = page.locator('#username');
    this.password = page.locator('#password');
    this.loginButton = page.locator('#login');
    this.expectedMsg = page.locator('.welcome_menu');
  }

  async gotoLoginPage() 
  {
    await test.step('Navigate to Login Page', async () => 
    {
      await this.page.goto('/');
      await attachStepScreenshot(this.page, '01 - Login page opened'); 
    });
  }

  async login(username, password) 
  {
    await test.step('Enter Username', async () => 
    {
      await this.username.fill(username);
      await attachStepScreenshot(this.page, '02 - After entering username'); 
    });

    await test.step('Enter Password', async () => 
    {
      await this.password.fill(password);
      await attachStepScreenshot(this.page, '03 - After entering password'); 
    });

    await test.step('Click Login Button', async () => 
    {
      await this.loginButton.click();
      await attachStepScreenshot(this.page, '04 - After clicking Login'); 
    });
  }
}

export default LoginPage;