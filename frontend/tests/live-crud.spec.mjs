import { test, expect } from '@playwright/test';

for (const mobile of [false, true]) test(`real Express/PostgreSQL CRUD through the ${mobile ? 'mobile' : 'desktop'} browser with cleanup`, async ({ page, request }) => {
  test.skip(!process.env.LIVE_API_URL, 'Set LIVE_API_URL to run against the real backend.');
  if (mobile) await page.setViewportSize({ width: 390, height: 844 });
  const api = `${process.env.LIVE_API_URL}/products`;
  const name = `Redesign E2E ${Date.now()}`;
  let id;
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  try {
    await page.goto('/manage-products');
    await expect(page.locator('.skeleton-grid')).toHaveCount(0);
    await page.getByLabel('Product Name', { exact: true }).fill(name);
    await page.getByLabel('Price (THB)').fill('123.45');
    await page.getByLabel('Quantity', { exact: true }).fill('6');
    const createdResponse = page.waitForResponse(response => response.url() === api && response.request().method() === 'POST');
    await page.getByRole('button', { name: 'Add Product', exact: true }).click();
    const response = await createdResponse;
    expect(response.status()).toBe(201);
    id = (await response.json()).id;
    const row = page.locator(mobile ? '.mobile-product' : 'tbody tr').filter({ hasText: name });
    await expect(row).toContainText('In stock');
    await row.getByRole('button', { name: `Edit ${name}` }).click();
    await page.getByLabel('Quantity', { exact: true }).fill('0');
    await page.getByLabel('Price (THB)').fill('456.78');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(row).toContainText('Out of stock');
    await page.reload();
    await expect(row).toContainText('456.78');
    const saved = await (await request.get(`${api}/${id}`)).json();
    expect(saved).toMatchObject({ name, price: 456.78, quantity: 0 });
    if (mobile) await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Home', exact: true }).click();
    const all = await (await request.get(api)).json();
    await expect(page.locator('.stat-card strong').first()).toHaveText(all.length.toLocaleString());
    await page.goto('/manage-products');
    await row.getByRole('button', { name: `Delete ${name}` }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(row).toHaveCount(0);
    expect((await request.get(`${api}/${id}`)).status()).toBe(404);
    expect(errors).toEqual([]);
  } finally {
    if (id) await request.delete(`${api}/${id}`);
    else {
      const response = await request.get(api);
      if (response.ok()) for (const product of await response.json()) if (product.name === name) await request.delete(`${api}/${product.id}`);
    }
  }
});
