import { test, expect } from '@playwright/test';
import LoginPage from '../Pages/LoginPage';
import LogoutPage from '../Pages/LogoutPage';
import loginData from '../testdata/LoginData.json';
import { attachStepScreenshot } from '../Utilities/screenshot';

test.use({ storageState: { cookies: [], origins: [] } });

test.afterEach(async ({ page }) => 
{
  const logout = new LogoutPage(page);
  if (await logout.logoutLink.isVisible()) 
  {
    await logout.gotoLogoutPage();
  }
});

test('Login succeeds with valid credentials', async ({ page }) => 
{
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  await test.step('Verify successful login', async () => 
  {
    await expect(page).toHaveURL(new RegExp(loginData.expected.searchHotelPagePath));
    await expect(login.expectedMsg.first()).toContainText(loginData.expected.welcomeMessage);
    await attachStepScreenshot(page, 'Successful login');
  });
});

test('Login shows an error when both fields are empty', async ({ page }) => 
{
  const login = new LoginPage(page);

  await login.gotoLoginPage();
  await login.login('', '');
  await test.step('Verify empty-field validation', async () => 
  {
    await expect(page.getByText(loginData.expected.emptyUsernameMessage)).toBeVisible();
    await attachStepScreenshot(page, 'Empty-field validation');
  });
});

test('Login shows an error when username is empty', async ({ page }) => 
{
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login('', process.env.TEST_PASSWORD);
  await test.step('Verify missing-username validation', async () => 
  {
    await expect(page.getByText(loginData.expected.emptyUsernameMessage)).toBeVisible();
    await attachStepScreenshot(page, 'Missing username validation');
  });
});

test('Login shows an error when password is empty', async ({ page }) => 
{
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login(process.env.TEST_USERNAME, '');
  await test.step('Verify missing-password validation', async () => 
  {
    await expect(page.getByText(loginData.expected.emptyPasswordMessage)).toBeVisible();
    await attachStepScreenshot(page, 'Missing password validation');
  });
});

test('Login rejects invalid credentials', async ({ page }) => 
{
  const login = new LoginPage(page);
  const data = loginData.invalidUsers[0];

  await login.gotoLoginPage();
  await login.login(data.username, data.password);
  await test.step('Verify invalid-credentials validation', async () => 
  {
    await expect(page.getByText(loginData.expected.invalidCredentialsMessage)).toBeVisible();
    await attachStepScreenshot(page, 'Invalid credentials validation');
  });
});

test('Login page displays all required controls', async ({ page }) => 
{
  const login = new LoginPage(page);

  await login.gotoLoginPage();
  await test.step('Verify login controls', async () => 
  {
    await expect(login.username).toBeVisible();
    await attachStepScreenshot(page, 'Login Username');
    await expect(login.password).toBeVisible();
    await attachStepScreenshot(page, 'Login Password');
    await expect(login.loginButton).toBeVisible();
    await attachStepScreenshot(page, 'Login Button');
  });
});

test('Login password field masks entered text', async ({ page }) => 
{
  const login = new LoginPage(page);

  await login.gotoLoginPage();
  await login.password.fill('test-password');
  await test.step('Verify password masking', async () => 
  {
    await expect(login.password).toHaveAttribute('type', loginData.expected.passwordInputType);
    await attachStepScreenshot(page, 'Password masking');
  });
});
