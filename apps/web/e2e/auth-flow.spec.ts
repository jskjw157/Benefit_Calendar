import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Auth-flow spec
//
// The app uses localStorage key "bc_token" to represent authentication state.
//
// Intended behaviour:
//   - When bc_token is absent the user is considered a guest.
//   - Guest sees a "로그인" button; authenticated user sees "내 계정".
//   - The nav item "내 혜택" is only shown (or enabled) when authenticated.
//   - Visiting /my-benefits as a guest redirects to /login.
//   - Clearing bc_token (logout) restores the guest state.
//
// These tests encode that contract.  They will pass once the shared nav
// and auth-guard middleware are implemented.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Remove bc_token from localStorage without reloading the page. */
async function clearToken(page: Parameters<Parameters<typeof test>[1]>[0]) {
  await page.evaluate(() => localStorage.removeItem('bc_token'))
}

/** Set bc_token in localStorage without reloading the page. */
async function setToken(
  page: Parameters<Parameters<typeof test>[1]>[0],
  token = 'test-jwt-token'
) {
  await page.evaluate((t) => localStorage.setItem('bc_token', t), token)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Guest (unauthenticated) state', () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh with no token
    await page.goto('/')
    await clearToken(page)
    await page.reload()
  })

  test('shows 로그인 button when no bc_token is present', async ({ page }) => {
    await expect(page.getByRole('link', { name: '로그인' })).toBeVisible()
  })

  test('does not show 내 계정 button when no bc_token is present', async ({ page }) => {
    await expect(page.getByRole('button', { name: '내 계정' })).not.toBeVisible()
  })

  test('does not show 내 혜택 nav item when unauthenticated', async ({ page }) => {
    // 내 혜택 link should be absent or hidden for guests
    const myBenefitsLink = page.getByRole('link', { name: '내 혜택' })
    await expect(myBenefitsLink).not.toBeVisible()
  })

  test('accessing /my-benefits redirects to /login', async ({ page }) => {
    await page.goto('/my-benefits')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Authenticated state', () => {
  test('authenticated user sees 내 혜택 nav item', async ({ page }) => {
    // Navigate first, then set token, then reload so the app reads the token
    await page.goto('/')
    await setToken(page)
    await page.reload()

    await expect(page.getByRole('link', { name: '내 혜택' })).toBeVisible()
  })

  test('authenticated user sees 내 계정 button instead of 로그인', async ({ page }) => {
    await page.goto('/')
    await setToken(page)
    await page.reload()

    await expect(page.getByRole('button', { name: '내 계정' })).toBeVisible()
    await expect(page.getByRole('link', { name: '로그인' })).not.toBeVisible()
  })

  test('authenticated user can access /my-benefits without redirect', async ({ page }) => {
    await page.goto('/')
    await setToken(page)
    // Navigate directly to the protected page after setting the token
    await page.goto('/my-benefits')
    // Should stay on /my-benefits, not be redirected
    await expect(page).toHaveURL(/\/my-benefits/)
  })

  test('token persists across same-origin navigation', async ({ page }) => {
    await page.goto('/')
    await setToken(page)

    // Navigate to another page and verify token is still present
    await page.goto('/benefits')
    const token = await page.evaluate(() => localStorage.getItem('bc_token'))
    expect(token).toBe('test-jwt-token')
  })
})

test.describe('Logout flow', () => {
  test('logout removes bc_token and shows 로그인 button', async ({ page }) => {
    // Start authenticated
    await page.goto('/')
    await setToken(page)
    await page.reload()

    // Verify authenticated state
    await expect(page.getByRole('button', { name: '내 계정' })).toBeVisible()

    // Trigger logout — the implementation is expected to expose a logout
    // button or menu item; here we simulate it by clicking "내 계정" to open
    // the account menu and then clicking "로그아웃".
    await page.getByRole('button', { name: '내 계정' }).click()
    await page.getByRole('button', { name: '로그아웃' }).click()

    // After logout the token should be gone
    const token = await page.evaluate(() => localStorage.getItem('bc_token'))
    expect(token).toBeNull()

    // And the login button should reappear
    await expect(page.getByRole('link', { name: '로그인' })).toBeVisible()
  })

  test('after logout, /my-benefits redirects back to /login', async ({ page }) => {
    // Start authenticated
    await page.goto('/')
    await setToken(page)
    await page.reload()

    // Simulate logout by removing the token and reloading
    await clearToken(page)
    await page.reload()

    // Attempt to visit protected route
    await page.goto('/my-benefits')
    await expect(page).toHaveURL(/\/login/)
  })
})
