import { test, expect } from '@playwright/test';
import LoginPage from '../Pages/LoginPage';
import SearchPage from '../Pages/SearchPage';
import SelectPage from '../Pages/SelectPage';
import BookHotel from '../Pages/BookHotel';
import loginData from '../testdata/LoginData.json';
import searchData from '../testdata/SearchData.json';
import bookData from '../testdata/BookHotel.json';
import { attachStepScreenshot } from '../Utilities/screenshot';

test.use({ storageState: { cookies: [], origins: [] } });

test('Complete hotel booking flow', async ({ page }) => 
{
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const selectPage = new SelectPage(page);
  const bookHotelPage = new BookHotel(page);
  const search = searchData.SearchHotel[0];
  const booking = bookData.BookHotel[0];

  await test.step('Login', async () => 
  {
    await loginPage.gotoLoginPage();
    await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
    await expect(loginPage.expectedMsg.first()).toContainText(loginData.expected.welcomeMessage);
    await attachStepScreenshot(page, 'Login successful');
  });

  await test.step('Search for a hotel', async () => 
  {
    await searchPage.gotoSearchPage();
    await searchPage.searchHotel(search.location,search.hotel,search.roomType,search.numberOfRooms,search.checkInDate,search.checkOutDate,search.adultsPerRoom,search.childrenPerRoom);
    
    await expect(page).toHaveURL(new RegExp(search.expected.resultsPagePath));
    await attachStepScreenshot(page, 'Hotel search results');
  });

  await test.step('Select a hotel', async () => 
  {
    await selectPage.selectHotel();
    await expect(page).toHaveURL(new RegExp(search.expected.selectedHotelPagePath));
    await attachStepScreenshot(page, 'Hotel selected');
  });

  await test.step('Book the hotel', async () => 
  {
    await bookHotelPage.bookHotel(booking.firstName,booking.lastName,booking.billingAddress,booking.creditCardNumber,booking.creditCardType,booking.expiryMonth,booking.expiryYear,booking.cvvNumber);

    await page.waitForLoadState('networkidle', { timeout: 20000 });
  });

  await test.step('Verify order confirmation', async () => 
  {
   await expect(page).toHaveURL(new RegExp(booking.expected.confirmationPagePath), { timeout: 45000 });
    const orderNumberInput = page.locator('#order_no');
    
    await orderNumberInput.waitFor({ state: 'visible', timeout: 10000 });
    
    await expect(orderNumberInput).toBeVisible();
    await expect(orderNumberInput).toHaveValue(new RegExp(booking.expected.orderNumberPattern));
    await expect(page).toHaveURL(new RegExp(booking.expected.confirmationPagePath), { timeout: 45000 });
    
    await attachStepScreenshot(page, 'Order confirmation');
  });
});

test('Complete flow rejects invalid login credentials', async ({ page }) => 
{
  const loginPage = new LoginPage(page);
  const invalidUser = loginData.invalidUsers[0];

  await loginPage.gotoLoginPage();
  await loginPage.login(invalidUser.username, invalidUser.password);
  await test.step('Verify invalid login is rejected', async () => 
  {
    await expect(page.getByText(loginData.expected.invalidCredentialsMessage)).toBeVisible();
    await attachStepScreenshot(page, 'Invalid login rejected');
  });
});

test('Complete flow reports missing booking details', async ({ page }) => 
{
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const selectPage = new SelectPage(page);
  const bookHotelPage = new BookHotel(page);
  const search = searchData.SearchHotel[0];
  const invalidBooking = bookData.BookHotel[1];

  await loginPage.gotoLoginPage();
  await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  await searchPage.gotoSearchPage();
  await searchPage.searchHotel(search.location,search.hotel,search.roomType,search.numberOfRooms,search.checkInDate,search.checkOutDate,search.adultsPerRoom,search.childrenPerRoom);

  await selectPage.selectHotel();
  await bookHotelPage.bookHotel(invalidBooking.firstName,invalidBooking.lastName,invalidBooking.billingAddress,invalidBooking.creditCardNumber,invalidBooking.creditCardType,invalidBooking.expiryMonth,invalidBooking.expiryYear,invalidBooking.cvvNumber);

  await test.step('Verify missing booking details are reported', async () => 
  {
    await expect(page.locator('#first_name_span')).toHaveText(invalidBooking.expected.validationMessages.firstName);
    await attachStepScreenshot(page, 'Missing booking details');
  });
});
