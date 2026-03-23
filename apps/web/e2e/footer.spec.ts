import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Footer spec
//
// The app does not yet have a footer component.  These tests encode the
// intended contract for the shared site footer described in the project spec:
//
//   - Brand text "BenefitCal" visible
//   - Navigation links: 혜택 찾기, 캘린더, 내 혜택, 피드백
//   - Copyright notice containing the current year
//   - Links navigate to the correct routes
//
// All tests will fail until the footer component is added to the root layout.
// ---------------------------------------------------------------------------

test.describe('Site footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('footer is visible at the bottom of the page', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    await expect(footer).toBeVisible()
  })

  test('footer contains brand text "BenefitCal"', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    await expect(footer.getByText('BenefitCal')).toBeVisible()
  })

  test('footer contains 혜택 찾기 link', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    const link = footer.getByRole('link', { name: '혜택 찾기' })
    await expect(link).toBeVisible()
  })

  test('footer contains 캘린더 link', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    const link = footer.getByRole('link', { name: '캘린더' })
    await expect(link).toBeVisible()
  })

  test('footer contains 내 혜택 link', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    const link = footer.getByRole('link', { name: '내 혜택' })
    await expect(link).toBeVisible()
  })

  test('footer contains 피드백 link', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    const link = footer.getByRole('link', { name: '피드백' })
    await expect(link).toBeVisible()
  })

  test('copyright notice contains the current year', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    const currentYear = new Date().getFullYear().toString()
    await expect(footer.getByText(currentYear)).toBeVisible()
  })

  test('footer 혜택 찾기 link navigates to /benefits', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    await footer.getByRole('link', { name: '혜택 찾기' }).click()
    await expect(page).toHaveURL(/\/benefits/)
  })

  test('footer 캘린더 link navigates to /calendar', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    await footer.getByRole('link', { name: '캘린더' }).click()
    await expect(page).toHaveURL(/\/calendar/)
  })

  test('footer 내 혜택 link navigates to /my-benefits or /login', async ({ page }) => {
    // Without auth the user lands on /login; with auth on /my-benefits.
    // Either destination is acceptable — we assert the URL changed away from "/".
    const footer = page.getByRole('contentinfo')
    await footer.getByRole('link', { name: '내 혜택' }).click()
    await expect(page).toHaveURL(/\/(my-benefits|login)/)
  })

  test('footer is present on the /benefits page as well', async ({ page }) => {
    await page.goto('/benefits')
    const footer = page.getByRole('contentinfo')
    await expect(footer).toBeVisible()
    await expect(footer.getByText('BenefitCal')).toBeVisible()
  })

  test('footer is present on the /calendar page as well', async ({ page }) => {
    await page.goto('/calendar')
    const footer = page.getByRole('contentinfo')
    await expect(footer).toBeVisible()
    await expect(footer.getByText('BenefitCal')).toBeVisible()
  })
})
