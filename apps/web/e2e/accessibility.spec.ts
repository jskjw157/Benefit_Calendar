import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Accessibility spec
//
// These tests verify ARIA semantics, keyboard navigation, and focus management
// in the site header and footer.
//
// WCAG references:
//   - 1.3.1 Info and Relationships (ARIA landmark roles)
//   - 2.1.1 Keyboard (all functionality via keyboard)
//   - 2.4.3 Focus Order (logical focus sequence)
//   - 2.4.7 Focus Visible (visible focus indicator)
//   - 4.1.2 Name, Role, Value (ARIA attributes)
// ---------------------------------------------------------------------------

test.describe('ARIA landmark roles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('site header has role="banner"', async ({ page }) => {
    // The outermost site header must use the <header> element at page scope
    // (which maps to role="banner") or carry an explicit role="banner".
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('site footer has role="contentinfo"', async ({ page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })

  test('primary navigation is wrapped in a <nav> element', async ({ page }) => {
    // A <nav> inside the banner provides role="navigation"
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('main content area has role="main"', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible()
  })
})

test.describe('Active route aria-current', () => {
  test('home link has aria-current="page" when on /', async ({ page }) => {
    await page.goto('/')
    const homeLink = page.getByRole('link', { name: '홈' })
    await expect(homeLink).toHaveAttribute('aria-current', 'page')
  })

  test('혜택 찾기 link has aria-current="page" when on /benefits', async ({ page }) => {
    await page.goto('/benefits')
    const benefitsLink = page.getByRole('link', { name: '혜택 찾기' })
    await expect(benefitsLink).toHaveAttribute('aria-current', 'page')
  })

  test('캘린더 link has aria-current="page" when on /calendar', async ({ page }) => {
    await page.goto('/calendar')
    const calendarLink = page.getByRole('link', { name: '캘린더' })
    await expect(calendarLink).toHaveAttribute('aria-current', 'page')
  })

  test('non-active links do not have aria-current="page"', async ({ page }) => {
    await page.goto('/')
    // 혜택 찾기 should not be marked active on the home page
    const benefitsLink = page.getByRole('link', { name: '혜택 찾기' })
    // aria-current should be absent or set to a falsy value
    const ariaCurrent = await benefitsLink.getAttribute('aria-current')
    expect(ariaCurrent === null || ariaCurrent === 'false').toBeTruthy()
  })
})

test.describe('Mobile hamburger ARIA', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
  })

  test('hamburger button has aria-expanded="false" when menu is closed', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
  })

  test('hamburger button has aria-expanded="true" when menu is open', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
    await hamburger.click()
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true')
  })

  test('hamburger button has aria-controls pointing to the mobile menu', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
    // aria-controls should reference the id of the expandable menu panel
    const controls = await hamburger.getAttribute('aria-controls')
    expect(controls).toBeTruthy()
    // The referenced element must exist in the DOM
    const menuPanel = page.locator(`#${controls}`)
    await expect(menuPanel).toBeAttached()
  })

  test('mobile menu has an accessible label', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
    const controls = await hamburger.getAttribute('aria-controls')
    const menuPanel = page.locator(`#${controls}`)

    // The panel should have aria-label or aria-labelledby for screen readers
    const ariaLabel = await menuPanel.getAttribute('aria-label')
    const ariaLabelledby = await menuPanel.getAttribute('aria-labelledby')
    expect(ariaLabel !== null || ariaLabelledby !== null).toBeTruthy()
  })
})

test.describe('Keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')
  })

  test('Tab key moves focus through main nav links in order', async ({ page }) => {
    // Focus the first interactive element in the banner (logo link)
    const logoLink = page.getByRole('link', { name: /BenefitCal|혜택 캘린더/i }).first()
    await logoLink.focus()

    // Tab to 홈 link
    await page.keyboard.press('Tab')
    const homeLink = page.getByRole('link', { name: '홈' })
    await expect(homeLink).toBeFocused()

    // Tab to 혜택 찾기 link
    await page.keyboard.press('Tab')
    const benefitsLink = page.getByRole('link', { name: '혜택 찾기' })
    await expect(benefitsLink).toBeFocused()

    // Tab to 캘린더 link
    await page.keyboard.press('Tab')
    const calendarLink = page.getByRole('link', { name: '캘린더' })
    await expect(calendarLink).toBeFocused()
  })

  test('Enter key on a nav link triggers navigation', async ({ page }) => {
    const benefitsLink = page.getByRole('link', { name: '혜택 찾기' })
    await benefitsLink.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/benefits/)
  })

  test('focused nav links have a visible focus indicator', async ({ page }) => {
    // Check that the focused element has an outline or box-shadow
    // (i.e. outline is not "none" or "0px")
    const benefitsLink = page.getByRole('link', { name: '혜택 찾기' })
    await benefitsLink.focus()

    const outline = await benefitsLink.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return style.outline
    })

    const boxShadow = await benefitsLink.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return style.boxShadow
    })

    // At least one focus indicator must be non-trivial
    const hasOutline = outline !== '' && outline !== 'none' && !outline.startsWith('0px')
    const hasShadow = boxShadow !== '' && boxShadow !== 'none'
    expect(hasOutline || hasShadow).toBeTruthy()
  })

  test('logo link is reachable and activatable by keyboard', async ({ page }) => {
    // Focus the logo link and activate with Enter — should stay on /
    const logoLink = page.getByRole('link', { name: /BenefitCal|혜택 캘린더/i }).first()
    await logoLink.focus()
    await expect(logoLink).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/')
  })
})

test.describe('Screen reader text for icon-only controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
  })

  test('hamburger button has a non-empty accessible name', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /메뉴|menu/i })
    // If the button uses only an icon it must have aria-label or a visually
    // hidden text element — getByRole with a name matcher already enforces this.
    await expect(hamburger).toBeVisible()
    const accessibleName = await hamburger.getAttribute('aria-label')
    const textContent = await hamburger.textContent()
    // Either aria-label or visible text must be non-empty
    expect((accessibleName && accessibleName.trim().length > 0) ||
           (textContent && textContent.trim().length > 0)).toBeTruthy()
  })
})
