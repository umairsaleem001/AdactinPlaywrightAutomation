import { test, expect } from '@playwright/test';
import SearchPage from '../Pages/SearchPage';
import SelectPage from '../Pages/SelectPage';
import searchData from '../testdata/SearchData.json';
import { attachStepScreenshot } from '../Utilities/screenshot';


test.use({ storageState: 'State/state.json' });

let search;
let select;
let sdata;

test.beforeEach(async ({ page }) => 
{
  search = new SearchPage(page);
  select = new SelectPage(page);
  sdata = searchData.SearchHotel[0];

  await search.gotoSearchPage();
});

test('select Hotel Test Case using with Valid User', async ({ page }) => 
{
  await search.searchHotel(sdata.location,sdata.hotel,sdata.roomType,sdata.numberOfRooms,sdata.checkInDate,sdata.checkOutDate,sdata.adultsPerRoom,sdata.childrenPerRoom);

  await select.selectHotel();
  await test.step('Verify hotel selection', async () => 
  {
    await expect(page).toHaveURL(new RegExp(sdata.expected.selectedHotelPagePath));
    await attachStepScreenshot(page, 'Hotel selection');
  });
});

test('select Hotel Test Case using with Invalid User (No Selection)', async ({ page }) => 
{
  await search.searchHotel(sdata.location,sdata.hotel,sdata.roomType,sdata.numberOfRooms,sdata.checkInDate,sdata.checkOutDate,sdata.adultsPerRoom,sdata.childrenPerRoom);

  await page.locator('#continue').click();
  await test.step('Verify hotel selection is required', async () => 
  {
    await expect(page).toHaveURL(new RegExp(sdata.expected.noSelectionPagePath));
    await attachStepScreenshot(page, 'Hotel selection required');
  });
});

test('hotel result is available for selection', async ({ page }) => 
{
  await search.searchHotel(sdata.location,sdata.hotel,sdata.roomType,sdata.numberOfRooms,sdata.checkInDate,sdata.checkOutDate,sdata.adultsPerRoom,sdata.childrenPerRoom);

  await test.step('Verify hotel result is available', async () => 
  {
    await expect(select.radioButton).toBeVisible();
    await expect(select.radioButton).not.toBeChecked();
    await attachStepScreenshot(page, 'Hotel result available');
  });
});

test('selecting a hotel checks its radio button', async ({ page }) => 
{
  await search.searchHotel(sdata.location,sdata.hotel,sdata.roomType,sdata.numberOfRooms,sdata.checkInDate,sdata.checkOutDate,sdata.adultsPerRoom,sdata.childrenPerRoom);

  await select.radioButton.check();
  await test.step('Verify selected hotel radio button', async () => 
  {
    await expect(select.radioButton).toBeChecked();
    await attachStepScreenshot(page, 'Hotel radio button selected');
  });
});