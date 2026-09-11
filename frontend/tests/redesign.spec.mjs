import { test, expect } from '@playwright/test';

const products = [
  { id: 1, name: 'Studio headphones', price: 8990, quantity: 12 },
  { id: 2, name: 'Mechanical keyboard', price: 4500, quantity: 5 },
  { id: 3, name: 'Desktop speaker', price: 6900, quantity: 0 },
  { id: 4, name: 'จอภาพสำหรับทำงาน', price: 12500, quantity: 1 },
];

async function mockProducts(page, initial = products) {
  let data = structuredClone(initial);
  const calls = [];
  await page.route('**/products{,/*}', async route => {
    const request = route.request();
    const method = request.method();
    calls.push(method);
    const id = Number(new URL(request.url()).pathname.split('/')[2]);
    if (method === 'POST') { const product = { ...request.postDataJSON(), id: 99 }; data.push(product); return route.fulfill({ status: 201, json: product }); }
    if (method === 'PUT') { data = data.map(p => p.id === id ? { ...p, ...request.postDataJSON() } : p); return route.fulfill({ json: data.find(p => p.id === id) }); }
    if (method === 'DELETE') { data = data.filter(p => p.id !== id); return route.fulfill({ status: 204 }); }
    return route.fulfill({ json: data });
  });
  return calls;
}

test('Home loads API products and stats; carousel arrows, keyboard, drag and CTA', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await mockProducts(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Inventory,');
  await expect(page.locator('.is-active h3')).toHaveText(products[0].name);
  await expect(page.locator('.stat-card strong')).toHaveText(['4','18','2','1']);
  await page.getByRole('button', { name: 'Next product' }).click();
  await expect(page.locator('.is-active h3')).toHaveText(products[1].name);
  await page.locator('.carousel-stage').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.is-active h3')).toHaveText(products[0].name);
  await page.locator('.carousel-stage').scrollIntoViewIfNeeded();
  await page.locator('.is-active').waitFor({ state: 'visible' });
  const card = await page.locator('.is-active').boundingBox();
  await page.mouse.move(card.x + 240, card.y + 180);
  await page.mouse.down();
  await page.mouse.move(card.x + 80, card.y + 180, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator('.is-active h3')).toHaveText(products[1].name);
  await page.getByRole('button', { name: 'Previous product' }).click();
  await page.getByRole('button', { name: 'Previous product' }).click();
  await expect(page.locator('.is-active h3')).toHaveText(products[3].name);
  await page.locator('.closing-cta').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(100);
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  await page.locator('.is-active').getByRole('link', { name: 'View Product' }).click();
  await expect(page).toHaveURL(/manage-products\?product=4/);
  await expect(page.locator('tr.highlighted')).toContainText(products[3].name);
  expect(errors).toEqual([]);
});

test('Manage CRUD, validation, edit cancellation, dialog focus/escape and toast', async ({ page }) => {
  const calls = await mockProducts(page);
  await page.goto('/manage-products');
  await expect(page.getByRole('table')).toBeVisible();
  await page.getByRole('button', { name: 'Add Product', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  expect(calls).not.toContain('POST');
  await page.getByLabel('Product Name', { exact: true }).fill('Test product');
  await page.getByLabel('Price (THB)').fill('123.45');
  await page.getByLabel('Quantity', { exact: true }).fill('1.5');
  await page.getByRole('button', { name: 'Add Product', exact: true }).click();
  expect(calls).not.toContain('POST');
  await page.getByLabel('Quantity', { exact: true }).fill('6');
  await page.getByRole('button', { name: 'Add Product', exact: true }).click();
  await expect(page.getByText('Product created', { exact: true })).toBeVisible();
  const row = page.getByRole('row').filter({ hasText: 'Test product' });
  await expect(row).toContainText('In stock');
  await row.getByRole('button', { name: 'Edit Test product' }).click();
  await expect(page.getByLabel('Product Name', { exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByLabel('Product Name', { exact: true })).toHaveValue('');
  await row.getByRole('button', { name: 'Edit Test product' }).click();
  await page.getByLabel('Quantity', { exact: true }).fill('0');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(row).toContainText('Out of stock');
  await expect(page.getByText('Product updated', { exact: true })).toBeVisible();
  await row.getByRole('button', { name: 'Delete Test product' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Delete', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(row.getByRole('button', { name: 'Delete Test product' })).toBeFocused();
  expect(calls).not.toContain('DELETE');
  await row.getByRole('button', { name: 'Delete Test product' }).click();
  await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(row).toHaveCount(0);
  await expect(page.getByText('Product deleted', { exact: true })).toBeVisible();
  expect(calls).toEqual(expect.arrayContaining(['GET','POST','PUT','DELETE']));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'test-results/manage-desktop.png', fullPage: true });
});

test('loading, empty, error and retry on both routes; single product controls', async ({ page }) => {
  for (const url of ['/', '/manage-products']) {
    await page.route('**/products', async route => { await new Promise(resolve => setTimeout(resolve, 500)); await route.fulfill({ json: [] }); });
    await page.goto(url);
    await expect(page.getByRole('status', { name: 'Loading products' })).toBeVisible();
    await expect(page.getByText('No products yet.')).toBeVisible();
    await page.unroute('**/products');
    await page.route('**/products', route => route.fulfill({ status: 500, json: { message: 'Unavailable' } }));
    await page.reload();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText('No products yet.')).toHaveCount(0);
    await page.unroute('**/products');
    await page.route('**/products', route => route.fulfill({ json: [products[0]] }));
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(page.getByRole('alert')).toHaveCount(0);
    if (url === '/') await expect(page.getByRole('button', { name: 'Next product' })).toBeDisabled();
    else await expect(page.getByRole('table')).toBeVisible();
    await page.unroute('**/products');
  }
});

test('failed create, update, delete preserve data and allow recovery', async ({ page }) => {
  await mockProducts(page);
  await page.goto('/manage-products');
  await page.getByLabel('Product Name', { exact: true }).fill('Unsent product');
  await page.getByLabel('Price (THB)').fill('10');
  await page.getByLabel('Quantity', { exact: true }).fill('1');
  await page.route('**/products', route => route.request().method() === 'POST' ? route.fulfill({ status: 400, json: { message: 'Create failed' } }) : route.fallback());
  await page.getByRole('button', { name: 'Add Product', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Create failed');
  await expect(page.getByLabel('Product Name', { exact: true })).toHaveValue('Unsent product');
  await page.route('**/products/1', route => route.fulfill({ status: 500, json: { message: 'Write failed' } }));
  await page.getByRole('button', { name: 'Edit Studio headphones', exact: true }).click();
  await page.getByLabel('Quantity', { exact: true }).fill('0');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByRole('alert')).toContainText('Write failed');
  await expect(page.getByRole('row').filter({ hasText: 'Studio headphones' })).toContainText('In stock');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('button', { name: 'Delete Studio headphones', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Write failed');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('row').filter({ hasText: 'Studio headphones' })).toBeVisible();
});

test('responsive 320/390/768/1024/1440, mobile navigation/cards/search, reduced motion', async ({ page }) => {
  await mockProducts(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const url of ['/', '/manage-products']) {
      await page.goto(url);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.skeleton-grid')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
      if (url === '/manage-products') {
        await expect(page.locator(width < 768 ? '.mobile-products' : '.table-panel')).toBeVisible();
      } else {
        const fits = await page.locator('.carousel-stage').evaluate(stage => {
          const card = stage.querySelector('.is-active');
          return card.offsetTop + card.offsetHeight <= stage.clientHeight;
        });
        expect(fits).toBeTruthy();
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.marquee-track')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.glass-orb')).toHaveCSS('animation-name', 'none');
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Manage Products' }).click();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search products' }).fill('keyboard');
  await expect(page.locator('.mobile-product')).toHaveCount(1);
  await page.getByRole('searchbox', { name: 'Search products' }).fill('');
  await page.getByLabel('Stock filter').selectOption('warning');
  await expect(page.locator('.mobile-product')).toHaveCount(2);
  await page.getByLabel('Stock filter').selectOption('all');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'test-results/manage-mobile.png', fullPage: true });
});

test('mobile touch swipe advances carousel without blocking vertical scrolling', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await mockProducts(page);
  await page.goto('/');
  await page.locator('.carousel-stage').scrollIntoViewIfNeeded();
  const box = await page.locator('.is-active').boundingBox();
  const session = await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 290, y: box.y + 150 }] });
  for (const x of [250,210,170,130,90]) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: box.y + 150 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('.is-active h3')).toHaveText(products[1].name);
  await expect(page.locator('.carousel-stage')).toHaveCSS('touch-action', 'pan-y');
  await context.close();
});
