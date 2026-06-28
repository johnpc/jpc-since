import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the test user opens settings', async ({ page }) => {
  // The toolbar entry renders as a routerLink (<a>), not a button.
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page).toHaveURL(/\/settings$/, { timeout: 15_000 });
});

Then('the settings screen shows the support email', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'john@johncorser.com' })).toBeVisible();
});

Then('the settings screen shows a sign-out control', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
});

When('the test user chooses the {string} sort', async ({ page }, label: string) => {
  await page.getByRole('button', { name: label }).click();
});

Then('the {string} sort is selected', async ({ page }, label: string) => {
  await expect(page.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true');
});
