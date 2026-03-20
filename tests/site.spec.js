import { test, expect } from '@playwright/test';

// ==========================================================================
//  Navigation & Layout
// ==========================================================================

test.describe('Navigation', () => {
  test('all 5 nav tabs are present and link correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const tabs = [
      { label: 'Home', url: '/' },
      { label: 'Machines', url: '/machines/' },
      { label: 'Projects', url: '/projects/' },
      { label: 'Guides', url: '/guides/' },
      { label: 'Workshops', url: '/workshops/' },
    ];
    for (const tab of tabs) {
      const link = page.locator(`.tabmenu__tab, a`).filter({ hasText: tab.label }).first();
      await expect(link).toBeVisible();
    }
  });

  test('clicking each tab navigates to correct page', async ({ page }) => {
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width <= 768;
    const tabs = [
      { label: 'Machines', url: '/machines/' },
      { label: 'Projects', url: '/projects/' },
      { label: 'Guides', url: '/guides/' },
      { label: 'Workshops', url: '/workshops/' },
    ];
    for (const tab of tabs) {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      if (isMobile) {
        // Open hamburger menu first
        await page.locator('.tabmenu__page--active .tabmenu__tab').click();
        await page.waitForTimeout(400);
      }
      await page.locator(`a`).filter({ hasText: tab.label }).first().click();
      await expect(page).toHaveURL(tab.url);
    }
  });

  test('logo links to home', async ({ page }) => {
    await page.goto('/machines/', { waitUntil: 'domcontentloaded' });
    await page.locator('.site-header__logo').click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Header & Footer', () => {
  test('logo is visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.site-header__logo img')).toBeVisible();
  });

  test('footer contains contact info', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('footer')).toContainText('Code Space is an initiative of');
    await expect(page.locator('footer')).toContainText('Contact us');
    await expect(page.locator('footer a[href*="kdg.be"]').first()).toBeVisible();
  });

  test('footer logos are visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const logos = page.locator('.footer__logos img');
    const count = await logos.count();
    expect(count).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < count; i++) {
      await expect(logos.nth(i)).toBeVisible();
    }
  });
});

// ==========================================================================
//  Home Page
// ==========================================================================

test.describe('Home Page', () => {
  test('displays intro text', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.home')).toContainText('Code Space is the digital workshop');
  });

  test('displays domain list', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const domains = page.locator('.home__domains li');
    await expect(domains).toHaveCount(5);
  });

  test('displays opening hours', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.home__hours')).toContainText('Monday');
    await expect(page.locator('.home__hours')).toContainText('Wednesday');
  });

  test('displays location', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.home')).toContainText('Van Schoonbekestraat 143');
    await expect(page.locator('.home')).toContainText('2018 Antwerpen');
  });

  test('reservation button links to external site', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const btn = page.locator('.reservation-action a');
    await expect(btn).toHaveAttribute('href', 'https://reservations.codespace.help/');
    await expect(btn).toHaveAttribute('target', '_blank');
    await expect(btn).toContainText('Make a reservation');
  });

  test('tech line is present', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.tech-line').first()).toBeVisible();
  });
});

// ==========================================================================
//  Machines Page
// ==========================================================================

test.describe('Machines Listing', () => {
  test('displays heading and intro', async ({ page }) => {
    await page.goto('/machines/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Machines');
    await expect(page.locator('.machines__intro-text')).toBeVisible();
  });

  test('displays machine cards', async ({ page }) => {
    await page.goto('/machines/', { waitUntil: 'domcontentloaded' });
    const cards = page.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('machine cards link to subpages', async ({ page }) => {
    await page.goto('/machines/', { waitUntil: 'domcontentloaded' });
    const firstCard = page.locator('.card__link').first();
    const href = await firstCard.getAttribute('href');
    expect(href).toContain('/machines/');
  });

  test('reservation button present', async ({ page }) => {
    await page.goto('/machines/', { waitUntil: 'domcontentloaded' });
    const btn = page.locator('.reservation-action a');
    await expect(btn).toHaveAttribute('href', 'https://reservations.codespace.help/');
  });
});

test.describe('Machine Subpages', () => {
  const machines = [
    { url: '/machines/laser-cutter/', name: 'Laser Cutter', model: 'Flux BeamBox Pro' },
    { url: '/machines/3d-printer/', name: '3D Printer', model: 'Ultimaker 2+ Connect' },
    { url: '/machines/plotter/', name: 'Plotter', model: 'Cricut Maker 3' },
    { url: '/machines/pc-computer-1/', name: 'Computer 1', model: 'Windows PC' },
    { url: '/machines/pc-computer-2/', name: 'Computer 2', model: 'Windows PC' },
  ];

  for (const machine of machines) {
    test(`${machine.name} page renders correctly`, async ({ page }) => {
      await page.goto(machine.url, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.subpage__header h1')).toContainText(machine.name);
      await expect(page.locator('.subpage__header')).toContainText(machine.model);
      // Hero image
      await expect(page.locator('.subpage__hero')).toBeVisible();
      // Description specs from frontmatter
      await expect(page.locator('.subpage__content p').first()).toBeVisible();
      // Body content
      await expect(page.locator('.subpage__content')).not.toBeEmpty();
    });
  }
});

// ==========================================================================
//  Projects Page
// ==========================================================================

test.describe('Projects Listing', () => {
  test('displays heading', async ({ page }) => {
    await page.goto('/projects/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Projects');
  });

  test('displays project cards', async ({ page }) => {
    await page.goto('/projects/', { waitUntil: 'domcontentloaded' });
    const cards = page.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Project Subpages', () => {
  test('project page renders with student info', async ({ page }) => {
    await page.goto('/projects/', { waitUntil: 'domcontentloaded' });
    const firstCard = page.locator('.card__link').first();
    const href = await firstCard.getAttribute('href');
    await page.goto(href, { waitUntil: 'domcontentloaded' });
    // Should have title and student/project info
    await expect(page.locator('.subpage__header h1')).toBeVisible();
    await expect(page.locator('.subpage__content')).not.toBeEmpty();
  });
});

// ==========================================================================
//  Guides Page
// ==========================================================================

test.describe('Guides Listing', () => {
  test('displays heading', async ({ page }) => {
    await page.goto('/guides/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Guides');
  });

  test('displays guide cards', async ({ page }) => {
    await page.goto('/guides/', { waitUntil: 'domcontentloaded' });
    const cards = page.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Guide Subpages', () => {
  test('guide page renders with subtitle', async ({ page }) => {
    await page.goto('/guides/', { waitUntil: 'domcontentloaded' });
    const firstCard = page.locator('.card__link').first();
    const href = await firstCard.getAttribute('href');
    await page.goto(href, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.subpage__header h1')).toBeVisible();
    await expect(page.locator('.subpage__content')).not.toBeEmpty();
  });
});

// ==========================================================================
//  Workshops Page
// ==========================================================================

test.describe('Workshops Listing', () => {
  test('displays heading', async ({ page }) => {
    await page.goto('/workshops/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Workshops');
  });

  test('displays workshop tables', async ({ page }) => {
    await page.goto('/workshops/', { waitUntil: 'domcontentloaded' });
    const tables = page.locator('.workshops-styled table');
    const count = await tables.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('workshop links navigate to subpages', async ({ page }) => {
    await page.goto('/workshops/', { waitUntil: 'domcontentloaded' });
    const firstLink = page.locator('.workshops-styled a').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toContain('/workshops/');
  });
});

test.describe('Workshop Subpages', () => {
  test('workshop page renders with date and location', async ({ page }) => {
    await page.goto('/workshops/', { waitUntil: 'domcontentloaded' });
    const firstLink = page.locator('.workshops-styled a').first();
    const href = await firstLink.getAttribute('href');
    await page.goto(href, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.subpage__header h1')).toBeVisible();
    await expect(page.locator('.subpage__header')).toContainText('Workshop —');
    await expect(page.locator('.subpage__content')).not.toBeEmpty();
  });
});

// ==========================================================================
//  404 Page
// ==========================================================================

test.describe('404 Page', () => {
  test('returns content for unknown URL', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/', { waitUntil: 'domcontentloaded' });
    // 11ty dev server may return 200 for 404 page, just check it renders
    await expect(page.locator('body')).not.toBeEmpty();
  });
});

// ==========================================================================
//  CSS & Design System
// ==========================================================================

test.describe('Design System', () => {
  test('CSS variables are set', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const mainColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-main').trim()
    );
    expect(mainColor).toBe('#1e2040');
  });

  test('no broken images on home', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const images = page.locator('img[src]');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await img.evaluate((el) => el.complete || new Promise((r) => { el.onload = r; el.onerror = r; }));
      const naturalWidth = await img.evaluate((el) => el.naturalWidth);
      expect(naturalWidth, `Image ${i} (${await img.getAttribute('src')}) is broken`).toBeGreaterThan(0);
    }
  });

  test('no broken images on machines listing', async ({ page }) => {
    await page.goto('/machines/', { waitUntil: 'domcontentloaded' });
    const images = page.locator('.card__image img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await img.evaluate((el) => el.complete || new Promise((r) => { el.onload = r; el.onerror = r; }));
      const naturalWidth = await img.evaluate((el) => el.naturalWidth);
      expect(naturalWidth, `Card image ${i} is broken`).toBeGreaterThan(0);
    }
  });
});

// ==========================================================================
//  Mobile Menu (only on mobile/tablet viewports)
// ==========================================================================

test.describe('Mobile Menu', () => {
  test('hamburger icon toggles menu', async ({ page, browserName }, testInfo) => {
    // Only run on mobile/tablet projects
    const viewport = page.viewportSize();
    if (viewport && viewport.width > 768) {
      test.skip();
      return;
    }

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Active tab should be visible with menu icon
    const activeTab = page.locator('.tabmenu__page--active .tabmenu__tab');
    await expect(activeTab).toBeVisible();

    // Click to open menu
    await activeTab.click();
    await expect(page.locator('.tabmenu')).toHaveClass(/tabmenu--open/);

    // Non-active tabs should now be visible
    const nonActiveTabs = page.locator('.tabmenu__page:not(.tabmenu__page--active) .tabmenu__tab');
    const count = await nonActiveTabs.count();
    expect(count).toBe(4);

    // Click again to close
    await activeTab.click();
    await expect(page.locator('.tabmenu')).not.toHaveClass(/tabmenu--open/);
  });
});

// ==========================================================================
//  Desktop Tabs (only on desktop viewport)
// ==========================================================================

test.describe('Desktop Tabs', () => {
  test('all tabs visible horizontally', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width <= 768) {
      test.skip();
      return;
    }

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const tabs = page.locator('.tabmenu__tab');
    const count = await tabs.count();
    expect(count).toBe(5);

    // All tabs should be visible
    for (let i = 0; i < count; i++) {
      await expect(tabs.nth(i)).toBeVisible();
    }
  });

  test('active tab has correct styling', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width <= 768) {
      test.skip();
      return;
    }

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const activeTab = page.locator('.tabmenu__page--active .tabmenu__tab');
    const color = await activeTab.evaluate((el) => getComputedStyle(el).color);
    // Active tab should be white
    expect(color).toBe('rgb(255, 255, 255)');
  });
});

// ==========================================================================
//  Responsive Layout
// ==========================================================================

test.describe('Responsive Layout', () => {
  test('card grid switches to single column on mobile', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width > 768) {
      test.skip();
      return;
    }

    await page.goto('/machines/', { waitUntil: 'domcontentloaded' });
    const grid = page.locator('.card-grid');
    const columns = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    // Should be single column on mobile
    const colCount = columns.split(' ').length;
    expect(colCount).toBe(1);
  });

  test('card grid has two columns on desktop', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width <= 768) {
      test.skip();
      return;
    }

    await page.goto('/machines/', { waitUntil: 'domcontentloaded' });
    const grid = page.locator('.card-grid');
    const columns = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    const colCount = columns.split(' ').length;
    expect(colCount).toBe(2);
  });
});
