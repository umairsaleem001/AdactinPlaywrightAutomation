import { test } from '@playwright/test';
import { attachStepScreenshot } from '../Utilities/screenshot';

class SearchPage 
{
  constructor(page) 
  {
    this.page = page;

    this.location = page.locator('#location');
    this.hotels = page.locator('#hotels');
    this.roomType = page.locator('#room_type');
    this.numberOfRooms = page.locator('#room_nos');
    this.checkInDate = page.locator('#datepick_in');
    this.checkOutDate = page.locator('#datepick_out');
    this.adultsPerRoom = page.locator('#adult_room');
    this.childrenPerRoom = page.locator('#child_room');
    this.searchButton = page.locator('#Submit');
  }

  async gotoSearchPage() 
  {
    await test.step('Navigate to Search Hotel Page', async () => 
    {
      await this.page.goto('/SearchHotel.php');
      await attachStepScreenshot(this.page, '01 - Search Hotel page opened');
    });
  }

  async searchHotel(location, hotel, roomType, numberOfRooms, checkInDate, checkOutDate, adultsPerRoom, childrenPerRoom) 
  {
    await test.step('Select Location', async () => 
    {
      await this.location.selectOption(location);
      await attachStepScreenshot(this.page, '02 - After selecting location');
    });

    await test.step('Select Hotel', async () => 
    {
      await this.hotels.selectOption(hotel);
      await attachStepScreenshot(this.page, '03 - After selecting hotel');
    });

    await test.step('Select Room Type', async () => 
    {
      await this.roomType.selectOption(roomType);
      await attachStepScreenshot(this.page, '04 - After selecting room type');
    });

    await test.step('Select Number of Rooms', async () => 
    {
      await this.numberOfRooms.selectOption(numberOfRooms);
      await attachStepScreenshot(this.page, '05 - After selecting number of rooms');
    });

    await test.step('Enter Check-in Date', async () => 
    {
      await this.checkInDate.fill(checkInDate);
      await attachStepScreenshot(this.page, '06 - After entering check-in date');
    });

    await test.step('Enter Check-out Date', async () => 
    {
      await this.checkOutDate.fill(checkOutDate);
      await attachStepScreenshot(this.page, '07 - After entering check-out date');
    });

    await test.step('Select Adults per Room', async () => 
    {
      await this.adultsPerRoom.selectOption(adultsPerRoom);
      await attachStepScreenshot(this.page, '08 - After selecting adults per room');
    });

    await test.step('Select Children per Room', async () => 
    {
      await this.childrenPerRoom.selectOption(childrenPerRoom);
      await attachStepScreenshot(this.page, '09 - After selecting children per room');
    });

    await test.step('Click Search Button', async () => 
    {
      await this.searchButton.click();
      await attachStepScreenshot(this.page, '10 - After clicking Search button');
    });
  }
}

export default SearchPage;