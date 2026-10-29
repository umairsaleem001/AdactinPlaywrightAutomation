import { exec, spawn } from 'child_process';
import { promisify } from 'util';
 
const execAsync = promisify(exec);

export default async function globalTeardown() 
{
  await execAsync('npx allure generate allure-results --clean -o allure-report');
  console.log('--[Allure report successfully generated!]--');
  const report = spawn
  (
    process.platform === 'win32' ? 'cmd.exe' : 'npx',
    process.platform === 'win32'
      ? ['/d', '/s', '/c', 'npx allure open allure-report']
      : ['allure', 'open', 'allure-report'],
    {
      detached: true,
      stdio: 'ignore',
    }
  );
  report.on('error', error => console.error('Error opening Allure report:', error));
  report.unref();
}