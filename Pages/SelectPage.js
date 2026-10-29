import { test } from '@playwright/test';
import { attachStepScreenshot } from '../Utilities/screenshot';

class SelectPage 
{
  constructor(page) 
  {
    this.page = page;

    this.radioButton = page.locator('#radiobutton_0');
    this.continueButton = page.locator('#continue');
  }

  async gotoSelectPage() 
  {
    await test.step('Navigate to Select Hotel Page', async () => 
    {
      await this.page.goto('/SelectHotel.php');
      await attachStepScreenshot(this.page, '01 - Select Hotel page opened');
    });
  }

  async selectHotel() {
    await test.step('Select Hotel Radio Button', async () => 
    {
      await this.radioButton.click();
      await attachStepScreenshot(this.page, '02 - After selecting hotel radio button');
    });

    await test.step('Click Continue Button', async () => 
    {
      await this.continueButton.click();
      await attachStepScreenshot(this.page, '03 - After clicking Continue button');
    });
  }
}

export default SelectPage;