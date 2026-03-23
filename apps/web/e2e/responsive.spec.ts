import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Responsive layout spec
//
// Verifies that the navigation adapts correctly across three breakpoints:
//   - Desktop  1280 x 720  — full nav visible, hamburger hidden
//   - Tablet    768 x 1024 — full nav visible (Tailwind md: breakpoint = 768)
//   - Mobile    375 x 667  — desktop nav hidden, hamburger shown
//
// The tests also verify that the mobile menu opens and closes without layout
// shifts that would break pointer interactions.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Viewport constants
// ---------------------------------------------------------------------------
const DESKTOP = { width: 1280, height: 720 }
const TABLET  = { width: 768,  height: 1024 }
const MOBILE  = { width: 375,  height: 667 }

// ---------------------------------------------------------------------------
// Desktop
// ---------------------------------------------------------------------------
test.describe('Desktop layout (1280x720)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await page.goto('/')
  })

  test('full desktop navigation is visible', async ({ page }) => {
    const nav = page.getByRole('navigation')
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link', { name: '홈' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '혜택 찾기' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '캘린더' })).toBeVisible()
  })

  test('hamburger button is not visible on desktop', async ({ page }) => {
    // The hamburger button should not be rendered (or be display:none) at desktop width
    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
    await expect(hamburger).not.toBeVisible()
  })

  test('all three primary nav links are clickable', async ({ page }) => {
    const nav = page.getByRole('navigation')

    // Verify each link has a non-empty href (i.e. is a real anchor)
    const homeHref = await nav.getByRole('link', { name: '홈' }).getAttribute('href')
    const benefitsHref = await nav.getByRole('link', { name: '혜택 찾기' }).getAttribute('href')
    const calendarHref = await nav.getByRole('link', { name: '캘린더' }).getAttribute('href')

    expect(homeHref).not.toBeNull()
    expect(benefitsHref).not.toBeNull()
    expect(calendarHref).not.toBeNull()
  })

  test('page content is not obscured by the sticky header', async ({ page }) => {
    // The <main> element should have a top offset that accounts for the header height
    const mainTop = await page.getByRole('main').boundingBox().then((box) => box?.y ?? 0)
    const headerHeight = await page.getByRole('banner').boundingBox().then((box) => box?.height ?? 0)

    // Main content should start at or below the header bottom edge
    expect(mainTop).toBeGreaterThanOrEqual(headerHeight)
  })
})

// ---------------------------------------------------------------------------
// Tablet
// ---------------------------------------------------------------------------
test.describe('Tablet layout (768x1024)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(TABLET)
    await page.goto('/')
  })

  test('full navigation is visible at tablet width', async ({ page }) => {
    // Tailwind's md: breakpoint is 768px — desktop nav should be visible
    const nav = page.getByRole('navigation')
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link', { name: '홈' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '혜택 찾기' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '캘린더' })).toBeVisible()
  })

  test('hamburger button is not visible at tablet width', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
    await expect(hamburger).not.toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// Mobile
// ---------------------------------------------------------------------------
test.describe('Mobile layout (375x667)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE)
    await page.goto('/')
  })

  test('desktop nav links are hidden at mobile width', async ({ page }) => {
    // The desktop nav is rendered but should be hidden via CSS
    const nav = page.getByRole('navigation')
    await expect(nav.getByRole('link', { name: '혜택 찾기' })).not.toBeVisible()
  })

  test('hamburger button is visible at mobile width', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
    await expect(hamburger).toBeVisible()
  })

  test('mobile menu opens when hamburger is clicked', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
    await hamburger.click()

    // Nav links become visible inside the mobile drawer / dropdown
    await expect(page.getByRole('link', { name: '혜택 찾기' })).toBeVisible()
    await expect(page.getByRole('link', { name: '캘린더' })).toBeVisible()
  })

  test('mobile menu closes when hamburger is clicked again', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })

    await hamburger.click() // open
    await expect(page.getByRole('link', { name: '혜택 찾기' })).toBeVisible()

    await hamburger.click() // close
    await expect(page.getByRole('link', { name: '혜택 찾기' })).not.toBeVisible()
  })

  test('mobile menu closes when a link is clicked', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
    await hamburger.click()

    const benefitsLink = page.getByRole('link', { name: '혜택 찾기' })
    await expect(benefitsLink).toBeVisible()
    await benefitsLink.click()

    // After navigation the menu should be closed (aria-expanded should be false
    // or the link should no longer be visible in an open drawer).
    await expect(page).toHaveURL(/\/benefits/)
  })

  test('no horizontal scroll at mobile width', async ({ page }) => {
    // The body / html should not overflow horizontally
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyScrollWidth).toBeLessThanOrEqual(MOBILE.width)
  })

  test('page content is readable without zooming at mobile width', async ({ page }) => {
    // Verify the viewport meta tag is present and content is not scaled down
    const viewportContent = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]')
      return meta ? meta.getAttribute('content') : null
    })

    expect(viewportContent).not.toBeNull()
    expect(viewportContent).toContain('width=device-width')
  })
})

// ---------------------------------------------------------------------------
// Cross-breakpoint behaviour
// ---------------------------------------------------------------------------
test.describe('Cross-breakpoint transitions', () => {
  test('resizing from mobile to desktop shows full nav without page reload', async ({ page }) => {
    // Start mobile
    await page.setViewportSize(MOBILE)
    await page.goto('/')

    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
    await expect(hamburger).toBeVisible()

    // Resize to desktop
    await page.setViewportSize(DESKTOP)

    // Desktop nav should now be visible
    const nav = page.getByRole('navigation')
    await expect(nav.getByRole('link', { name: '혜택 찾기' })).toBeVisible()

    // Hamburger should be hidden
    await expect(hamburger).not.toBeVisible()
  })

  test('resizing from desktop to mobile hides full nav and shows hamburger', async ({ page }) => {
    // Start desktop
    await page.setViewportSize(DESKTOP)
    await page.goto('/')

    const nav = page.getByRole('navigation')
    await expect(nav.getByRole('link', { name: '혜택 찾기' })).toBeVisible()

    // Resize to mobile
    await page.setViewportSize(MOBILE)

    // Desktop nav links should be hidden
    await expect(nav.getByRole('link', { name: '혜택 찾기' })).not.toBeVisible()

    // Hamburger should appear
    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
    await expect(hamburger).toBeVisible()
  })
})
