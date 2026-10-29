import { test, expect } from '@playwright/test';
import SearchPage from '../Pages/SearchPage'; 
import searchData from '../testdata/SearchData.json';
import { attachStepScreenshot } from '../Utilities/screenshot';

test.use({ storageState: 'State/state.json' });

let search;
let sdata;

test.describe('Adactin Hotel Search Feature', () => 
{
  test.beforeEach(async ({ page }) => 
  {
    search = new SearchPage(page);
    sdata = searchData.SearchHotel[0];

    await search.gotoSearchPage();
  });

  test('Search Hotel Test Case using with Valid User', async ({ page }) => 
  {
    await search.searchHotel(sdata.location,sdata.hotel,sdata.roomType,sdata.numberOfRooms,sdata.checkInDate,sdata.checkOutDate,sdata.adultsPerRoom,sdata.childrenPerRoom);
    await test.step('Verify search results', async () => 
    {
      await expect(page).toHaveURL(new RegExp(sdata.expected.resultsPagePath));
      await attachStepScreenshot(page, 'Search results');
    });
  });

  test('Search Hotel Test Case using with Invalid User', async ({ page }) => 
  {
    const invalidData = searchData.SearchHotel[1]; 
    await search.searchHotel(invalidData.location,invalidData.hotel,invalidData.roomType,invalidData.numberOfRooms,invalidData.checkInDate,invalidData.checkOutDate,invalidData.adultsPerRoom,invalidData.childrenPerRoom);
    await test.step('Verify invalid date messages', async () => 
    {
      await expect(page.locator('#checkin_span')).toHaveText(invalidData.expected.checkInMessage);
      await attachStepScreenshot(page, 'Invalid Check-In messages');
      await expect(page.locator('#checkout_span')).toHaveText(invalidData.expected.checkOutMessage);
      await attachStepScreenshot(page, 'Invalid Check-Out messages');
    });
  });

  test('Search form displays all hotel criteria controls', async ({ page }) => 
  {
    await test.step('Verify search criteria controls', async () => 
    {
      await expect(search.location).toBeVisible();
      await attachStepScreenshot(page, 'Check Location');
      await expect(search.hotels).toBeVisible();
      await attachStepScreenshot(page, 'Check Hotel');
      await expect(search.roomType).toBeVisible();
      await attachStepScreenshot(page, 'Check RoomType');
      await expect(search.numberOfRooms).toBeVisible();
      await attachStepScreenshot(page, 'Check Number Of Rooms');
      await expect(search.checkInDate).toBeVisible();
      await attachStepScreenshot(page, 'Check Check-In Date');
      await expect(search.checkOutDate).toBeVisible();
      await attachStepScreenshot(page, 'Check Check-Out Date');
      await expect(search.adultsPerRoom).toBeVisible();
      await attachStepScreenshot(page, 'Check Number of Adults');
      await expect(search.childrenPerRoom).toBeVisible();
      await attachStepScreenshot(page, 'Check Number of Childrens');
      await expect(search.searchButton).toBeEnabled();
      await attachStepScreenshot(page, 'Search Button');
    });
  });

  test('Search form accepts the requested location and room type', async ({ page }) => 
  {
    await search.location.selectOption(sdata.location);
    await search.roomType.selectOption(sdata.roomType);

    await test.step('Verify selected search criteria', async () => 
    {
      await expect(search.location).toHaveValue(sdata.location);
      await attachStepScreenshot(page, 'Search Location');
      await expect(search.roomType).toHaveValue(sdata.roomType);
      await attachStepScreenshot(page, 'Search Room Type');
    });
  });
}); 