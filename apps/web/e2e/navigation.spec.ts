import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Navigation spec
//
// These tests cover the sticky site header and navigation behaviour.
//
// Current app state (as of authoring):
//   - The homepage renders an inline <header> containing "BenefitCal MVP"
//     and an inline <nav> with text spans for 홈, 혜택 탐색, 캘린더, 내 혜택, 설정.
//   - There are no real <a> links yet — items are <span> elements.
//   - A shared navigation component with proper links, role="banner",
//     hamburger toggle, and scroll-aware class changes is the intended target.
//
// The tests encode the *intended contract* so they will fail against the
// current codebase and pass once the shared nav component is implemented.
// ---------------------------------------------------------------------------

test.describe('Navigation header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page loads with navigation header visible', async ({ page }) => {
    // The site header wraps the nav; it should be immediately visible
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('logo links to home page', async ({ page }) => {
    // The logo / brand link should navigate to "/"
    const logoLink = page.getByRole('link', { name: /BenefitCal|혜택 캘린더/i }).first()
    await expect(logoLink).toBeVisible()
    await expect(logoLink).toHaveAttribute('href', '/')
  })

  test('desktop nav shows 홈, 혜택 찾기, 캘린더 links', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })

    const nav = page.getByRole('navigation')
    await expect(nav).toBeVisible()

    await expect(nav.getByRole('link', { name: '홈' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '혜택 찾기' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '캘린더' })).toBeVisible()
  })

  test('active nav item is highlighted', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })

    // The link matching the current route should carry an active indicator.
    // Implementations may use aria-current="page", an "active" class, or
    // a data attribute — we check aria-current as the most semantic approach.
    const homeLink = page.getByRole('link', { name: '홈' })
    await expect(homeLink).toHaveAttribute('aria-current', 'page')
  })

  test('clicking 혜택 찾기 navigates to /benefits', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })

    await page.getByRole('link', { name: '혜택 찾기' }).click()
    await expect(page).toHaveURL(/\/benefits/)
  })

  test('clicking 캘린더 navigates to /calendar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })

    await page.getByRole('link', { name: '캘린더' }).click()
    await expect(page).toHaveURL(/\/calendar/)
  })

  test.describe('Mobile navigation (375x667)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
    })

    test('hamburger button is visible on mobile', async ({ page }) => {
      // The hamburger trigger must be accessible via its label or role
      const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
      await expect(hamburger).toBeVisible()
    })

    test('mobile menu is hidden before hamburger is pressed', async ({ page }) => {
      // Desktop nav links should not be visible at mobile width before menu opens
      const nav = page.getByRole('navigation')
      await expect(nav.getByRole('link', { name: '혜택 찾기' })).not.toBeVisible()
    })

    test('hamburger button opens the mobile menu', async ({ page }) => {
      const hamburger = page.getByRole('button', { name: /메뉴|menu/i })

      // Menu is closed — button should signal collapsed state
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false')

      await hamburger.click()

      // After click the menu is open
      await expect(hamburger).toHaveAttribute('aria-expanded', 'true')
      await expect(page.getByRole('link', { name: '혜택 찾기' })).toBeVisible()
    })

    test('hamburger button closes the mobile menu on second press', async ({ page }) => {
      const hamburger = page.getByRole('button', { name: /메뉴|menu/i })

      // Open
      await hamburger.click()
      await expect(page.getByRole('link', { name: '혜택 찾기' })).toBeVisible()

      // Close
      await hamburger.click()
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      await expect(page.getByRole('link', { name: '혜택 찾기' })).not.toBeVisible()
    })
  })

  test('nav background changes class after scrolling 100px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })

    // Capture the header element
    const header = page.getByRole('banner')

    // Scroll down 100px to trigger the scroll-aware style change
    await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'instant' }))

    // The implementation is expected to add a class such as "scrolled",
    // "shadow", or a backdrop — we verify a data attribute or class is added.
    // Using a broad check: the header should have a class different from its
    // initial state. Adjust the expected class name to match the implementation.
    await expect(header).toHaveClass(/scrolled|shadow|backdrop/)
  })
})
