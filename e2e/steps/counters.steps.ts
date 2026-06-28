import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

/** The card for a counter with the given title (set via data-counter-title). */
const card = (page: import('@playwright/test').Page, title: string) =>
  page.locator(`[data-testid="counter-card"][data-counter-title="${title}"]`);

async function createCounter(page: import('@playwright/test').Page, name: string) {
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('New counter')).toBeVisible();
  await page.getByPlaceholder('Haircut').fill(name);
  await page.getByRole('button', { name: 'Start counting' }).click();
  // Wait out the create round-trip: the card appears once the list refetches.
  await expect(card(page, name)).toBeVisible({ timeout: 15_000 });
}

When('the test user creates a counter named {string}', async ({ page }, name: string) => {
  await createCounter(page, name);
});

Given('the test user has a counter named {string}', async ({ page }, name: string) => {
  if (
    !(await card(page, name)
      .isVisible()
      .catch(() => false))
  ) {
    await createCounter(page, name);
  }
});

Then(
  'the counter {string} is shown reading {string}',
  async ({ page }, name: string, reading: string) => {
    await expect(card(page, name).getByText(reading, { exact: false })).toBeVisible();
  },
);

When('the test user resets the counter {string}', async ({ page }, name: string) => {
  await card(page, name).getByRole('button').click();
  // The card returns to ~now after the reset round-trip.
  await expect(card(page, name).getByText('just now')).toBeVisible({ timeout: 15_000 });
});

Then('the counter {string} history shows at least one reset', async ({ page }, name: string) => {
  await card(page, name).click();
  await expect(page).toHaveURL(/\/counter\//, { timeout: 15_000 });
  // The Resets stat cell reflects the count; at least one reset happened.
  await expect(page.getByText('Resets')).toBeVisible();
  const resetsCount = page.locator('.stats__cell', { hasText: 'Resets' }).locator('.stats__value');
  await expect(resetsCount).not.toHaveText('0', { timeout: 15_000 });
});
