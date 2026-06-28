import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import type { Page } from '@playwright/test';

const { Given, When, Then, After } = createBdd();

// Names created during a scenario, deleted in After so reruns against the one
// shared test user stay contention-free (the plan's per-scenario cleanup).
const created = new Set<string>();

/** The (first) card for a counter with the given title. */
const card = (page: Page, title: string) =>
  page.locator(`[data-testid="counter-card"][data-counter-title="${title}"]`).first();

async function createCounter(page: Page, name: string) {
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('New counter')).toBeVisible();
  await page.getByPlaceholder('Haircut').fill(name);
  await page.getByRole('button', { name: 'Start counting' }).click();
  await expect(card(page, name)).toBeVisible({ timeout: 15_000 });
  created.add(name);
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
  'the counter {string} is shown counting up from seconds ago',
  async ({ page }, name: string) => {
    // Assert on the real rendered elapsed figure (not a URL) — the authenticated
    // read. A fresh counter reads its time in seconds.
    await expect(card(page, name).getByText(/second/)).toBeVisible({ timeout: 15_000 });
    await expect(card(page, name).getByText(`since ${name}`)).toBeVisible();
  },
);

When('the test user resets the counter {string}', async ({ page }, name: string) => {
  await card(page, name).getByRole('button', { name: /reset/i }).click();
  // After the reset round-trip the card counts up from now again (seconds).
  await expect(card(page, name).getByText(/second/)).toBeVisible({ timeout: 15_000 });
});

Then('the counter {string} history shows at least one reset', async ({ page }, name: string) => {
  await card(page, name)
    .getByRole('button', { name: `Open ${name} history` })
    .click();
  await expect(page).toHaveURL(/\/counter\//, { timeout: 15_000 });
  // The "Resets" stat cell's value must be non-zero. Scope to the stat cell to
  // avoid colliding with the empty-state copy.
  const resetsCell = page.locator('.stats__cell', { hasText: 'Resets' });
  await expect(resetsCell.locator('.stats__value')).not.toHaveText('0', { timeout: 15_000 });
});

// Per-scenario cleanup: navigate home and delete every counter we created.
After(async ({ page }) => {
  if (created.size === 0) return;
  await page.goto('/home');
  for (const name of created) {
    const del = page
      .locator(`[data-testid="counter-card"][data-counter-title="${name}"]`)
      .first()
      .getByRole('button', { name: `Delete ${name}` });
    while (await del.isVisible().catch(() => false)) {
      await del.click();
      await expect(del)
        .toBeHidden({ timeout: 15_000 })
        .catch(() => {});
    }
  }
  created.clear();
});
