import { expect, test } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

const USERNAME = process.env.TEST_USERNAME;
const PASSWORD = process.env.TEST_PASSWORD;

Given('the test user opens the sign-in screen', async ({ page }) => {
  // Skip gracefully when credentials are not configured (e.g. forks).
  if (!USERNAME || !PASSWORD) test.skip(true, 'TEST_USERNAME / TEST_PASSWORD not set');
  await page.goto('/signin');
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
});

When('the test user signs in with their credentials', async ({ page }) => {
  await page.locator('input[type="email"]').fill(USERNAME as string);
  await page.locator('input[type="password"]').fill(PASSWORD as string);
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Wait until the Cognito session is actually established before proceeding.
  // Navigating immediately races the session and could fire data reads before
  // the JWT exists — the established-session guard makes the test honest.
  await page.waitForFunction(
    () =>
      Object.keys(window.localStorage).some(
        (k) => k.includes('CognitoIdentityServiceProvider') && k.endsWith('.accessToken'),
      ),
    undefined,
    { timeout: 15_000 },
  );
});

Then('the user lands on the counters home', async ({ page }) => {
  await expect(page).toHaveURL(/\/home$/, { timeout: 15_000 });
  await expect(page.getByRole('heading', { name: 'Since' })).toBeVisible();
});
