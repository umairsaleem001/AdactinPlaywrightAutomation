import { test, expect } from '@playwright/test';
import SearchPage from '../Pages/SearchPage';
import SelectPage from '../Pages/SelectPage';
import BookHotel from '../Pages/BookHotel';
import searchData from '../testdata/SearchData.json';
import bookData from '../testdata/BookHotel.json';
import { attachStepScreenshot } from '../Utilities/screenshot';

test.use({ storageState: 'State/state.json' });

let search;
let select;
let bookPage;
let sdata;
let bdata;

test.beforeEach(async ({ page }) => 
{
  search = new SearchPage(page);
  select = new SelectPage(page);
  bookPage = new BookHotel(page);
  sdata = searchData.SearchHotel[0];
  bdata = bookData.BookHotel[0];

  await search.gotoSearchPage();
  await search.searchHotel(sdata.location,sdata.hotel,sdata.roomType,sdata.numberOfRooms,sdata.checkInDate,sdata.checkOutDate,sdata.adultsPerRoom,sdata.childrenPerRoom);

  await select.gotoSelectPage();
  await select.selectHotel(); 
});


test('Book Hotel Test Case using with Valid User', async ({ page }) => 
{
  await bookPage.bookHotel(bdata.firstName,bdata.lastName,bdata.billingAddress,bdata.creditCardNumber,bdata.creditCardType,bdata.expiryMonth,bdata.expiryYear,bdata.cvvNumber);

  await test.step('Verify booking confirmation', async () => 
  {
    await expect(page).toHaveURL(new RegExp(bdata.expected.confirmationPagePath), { timeout: 30000 });
    await expect(page.locator('#order_no')).toHaveValue(new RegExp(bdata.expected.orderNumberPattern));
    await attachStepScreenshot(page, 'Booking confirmation');
  });
});

test('Book Hotel Test Case using with Invalid User', async ({ page }) => 
{
  const invalidBdata = bookData.BookHotel[1];
  await bookPage.bookHotel(invalidBdata.firstName,invalidBdata.lastName,invalidBdata.billingAddress,invalidBdata.creditCardNumber,invalidBdata.creditCardType,invalidBdata.expiryMonth,invalidBdata.expiryYear,invalidBdata.cvvNumber);

  const expected = invalidBdata.expected.validationMessages;
  await test.step('Verify booking validation messages', async () => 
  {
    await expect(page.locator('#first_name_span')).toHaveText(expected.firstName);
    await attachStepScreenshot(page, 'First Name Valdidation');
    await expect(page.locator('#last_name_span')).toHaveText(expected.lastName);
    await attachStepScreenshot(page, 'Last Name Valdidation');
    await expect(page.locator('#address_span')).toHaveText(expected.address);
    await attachStepScreenshot(page, 'Address Valdidation');
    await expect(page.locator('#cc_num_span')).toHaveText(expected.creditCardNumber);
    await attachStepScreenshot(page, 'CC Number Valdidation');
    await expect(page.locator('#cc_type_span')).toHaveText(expected.creditCardType);
    await attachStepScreenshot(page, 'CC Type Valdidation');
    await expect(page.locator('#cc_expiry_span')).toHaveText(expected.expiryMonth);
    await attachStepScreenshot(page, 'CC Expiry Valdidation');
    await expect(page.locator('#cc_cvv_span')).toHaveText(expected.cvvNumber);
    await attachStepScreenshot(page, 'Booking validation messages');
  });
});

test('Booking requires a first name when other details are valid', async ({ page }) => 
{
  const invalidBdata = bookData.BookHotel[1];
  const validBdata = bookData.BookHotel[0];

  await bookPage.bookHotel('',validBdata.lastName,validBdata.billingAddress,validBdata.creditCardNumber,validBdata.creditCardType,validBdata.expiryMonth,validBdata.expiryYear,validBdata.cvvNumber);

  await test.step('Verify first name is required', async () => 
  {
    await expect(page.locator('#first_name_span')).toHaveText(invalidBdata.expected.validationMessages.firstName);
    await attachStepScreenshot(page, 'Missing first name');
  });
});

test('Booking requires a card expiry month when other details are valid', async ({ page }) => 
{
  const invalidBdata = bookData.BookHotel[1];
  const validBdata = bookData.BookHotel[0];

  await bookPage.bookHotel(validBdata.firstName,validBdata.lastName,validBdata.billingAddress,validBdata.creditCardNumber,validBdata.creditCardType,'',validBdata.expiryYear,validBdata.cvvNumber);

  await test.step('Verify expiry month is required', async () => 
  {
    await expect(page.locator('#cc_expiry_span')).toHaveText(invalidBdata.expected.validationMessages.expiryMonth);
    await attachStepScreenshot(page, 'Missing expiry month');
  });
});