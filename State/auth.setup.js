import {test as setup , expect} from '@playwright/test';
import LoginPage from '../Pages/LoginPage';
import loginData from '../testdata/LoginData.json';
import { attachStepScreenshot } from '../Utilities/screenshot';

setup('[StorageState Running]', async ({ page }) => 
{
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);

  await setup.step('Verify successful login', async () => 
  {
    await expect(login.expectedMsg.first()).toContainText(loginData.expected.welcomeMessage);
    await attachStepScreenshot(page, 'Storage state login');
  });

  await page.context().storageState({ path: 'State/state.json' });
});