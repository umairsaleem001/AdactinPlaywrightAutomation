import fs from 'fs';
import path from 'path';
 
export default async function globalSetup() 
{
  const resultsDir = path.resolve('allure-results');

  if (fs.existsSync(resultsDir)) 
  {
    fs.rmSync(resultsDir, { recursive: true, force: true });
    console.log('--[Allure results clean]--');
  }
}