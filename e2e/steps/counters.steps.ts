import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import type { Page } from '@playwright/test';

const { Given, When, Then, After } = createBdd();

// Names created during a scenario, deleted in After so reruns against the one
// shared test user stay contention-free (the plan's per-scenario cleanup).
const created = new Set<string>();

// A run-unique prefix so a counter created this run never collides with a
// leftover card of the same Gherkin name from an earlier run (which would have
// a different — and stale, time-volatile — elapsed value). Worker pid + a
// timestamp keeps it unique across parallel workers and reruns.
const RUN_TAG = `QA-${process.pid}-${Date.now().toString(36)}`;
const resolve = (name: string) => `${RUN_TAG} ${name}`;

/** The (first) card for a counter with the given (resolved) title. */
const card = (page: Page, title: string) =>
  page.locator(`[data-testid="counter-card"][data-counter-title="${resolve(title)}"]`).first();

async function createCounter(page: Page, name: string) {
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('New counter')).toBeVisible();
  await page.getByPlaceholder('Haircut').fill(resolve(name));
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
    // Assert on real rendered data (not a URL) — the authenticated read. The
    // "since <name>" line is the stable signal that the seeded counter rendered
    // (the elapsed figure itself is time-volatile, so we don't pin its unit).
    await expect(card(page, name).getByText(`since ${resolve(name)}`)).toBeVisible({
      timeout: 15_000,
    });
  },
);

When('the test user resets the counter {string}', async ({ page }, name: string) => {
  await card(page, name).getByRole('button', { name: /reset/i }).click();
  // Give the reset round-trip a beat to persist; the history step verifies the
  // logged interval (the durable, non-volatile proof that the reset happened).
  await page.waitForTimeout(1500);
});

Then('the counter {string} history shows at least one reset', async ({ page }, name: string) => {
  await card(page, name)
    .getByRole('button', { name: `Open ${resolve(name)} history` })
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
  // Wait for the authenticated grid to finish its react-query fetch before
  // deleting — otherwise isVisible() races an empty grid and skips cleanup.
  await page
    .getByRole('button', { name: 'Add' })
    .waitFor({ timeout: 15_000 })
    .catch(() => {});
  for (const name of created) {
    const del = page
      .locator(`[data-testid="counter-card"][data-counter-title="${resolve(name)}"]`)
      .first()
      .getByRole('button', { name: `Delete ${resolve(name)}` });
    // Wait for at least the first matching card to appear, then delete all.
    await del.waitFor({ timeout: 15_000 }).catch(() => {});
    while (await del.isVisible().catch(() => false)) {
      await del.click();
      await expect(del)
        .toBeHidden({ timeout: 15_000 })
        .catch(() => {});
    }
  }
  created.clear();
});
