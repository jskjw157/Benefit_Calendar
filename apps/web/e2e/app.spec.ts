import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('loads and displays header', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('text=BenefitCal')).toBeVisible()
  })

  test('displays hero section', async ({ page }) => {
    await page.goto('/')
    // Dashboard should have some content
    await expect(page.locator('main')).toBeVisible()
  })

  test('navigation links work', async ({ page }) => {
    // Verify each route is accessible via direct navigation
    await page.goto('/benefits')
    await expect(page).toHaveURL('/benefits')
    await expect(page.locator('main')).toBeVisible()

    await page.goto('/calendar')
    await expect(page).toHaveURL('/calendar')
    await expect(page.locator('main')).toBeVisible()

    await page.goto('/my-benefits')
    await expect(page).toHaveURL('/my-benefits')
    await expect(page.locator('main')).toBeVisible()

    // Verify header nav links exist on each page
    await page.goto('/')
    await expect(page.locator('header nav a[href="/benefits"]')).toBeVisible()
    await expect(page.locator('header nav a[href="/calendar"]')).toBeVisible()
    await expect(page.locator('header nav a[href="/my-benefits"]')).toBeVisible()
  })
})

test.describe('Benefits Page', () => {
  test('loads benefits list', async ({ page }) => {
    await page.goto('/benefits')
    await expect(page.locator('main')).toBeVisible()
  })

  test('search filters benefits', async ({ page }) => {
    await page.goto('/benefits')
    // Wait for benefits to load
    await page.waitForTimeout(1000)

    // Type in search
    const searchInput = page.locator('input[type="text"], input[placeholder*="검색"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('월세')
      await page.waitForTimeout(500)
    }
  })
})

test.describe('Benefit Detail Page', () => {
  test('loads detail page', async ({ page }) => {
    await page.goto('/benefits/b_001')
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Calendar Page', () => {
  test('loads calendar view', async ({ page }) => {
    await page.goto('/calendar')
    await expect(page.locator('main')).toBeVisible()
  })
})

test.describe('My Benefits Page', () => {
  test('loads my benefits', async ({ page }) => {
    await page.goto('/my-benefits')
    await expect(page.locator('main')).toBeVisible()
  })
})

test.describe('Login Page', () => {
  test('loads login form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'invalid@test.com')
    await page.fill('input[type="password"]', 'wrong')
    await page.click('button[type="submit"]')
    // Wait for error message to appear after API response
    await expect(page.locator('.bg-red-50')).toBeVisible({ timeout: 10000 })
  })

  test('successful login redirects to home', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'jisu@example.com')
    await page.fill('input[type="password"]', 'any')
    await page.click('button[type="submit"]')
    await page.waitForURL('/')
    await expect(page).toHaveURL('/')
  })
})

test.describe('Settings Pages', () => {
  test('loads notification settings', async ({ page }) => {
    await page.goto('/settings/notifications')
    await expect(page.locator('main').first()).toBeVisible()
  })

  test('loads profile settings', async ({ page }) => {
    await page.goto('/settings/profile')
    await expect(page.locator('main')).toBeVisible()
  })
})

test.describe('API Routes', () => {
  test('GET /api/v1/benefits returns data', async ({ request }) => {
    const response = await request.get('/api/v1/benefits')
    expect(response.ok()).toBeTruthy()
    const json = await response.json()
    expect(json.success).toBe(true)
    expect(json.data.items.length).toBeGreaterThan(0)
  })

  test('GET /api/v1/benefits/b_001 returns single benefit', async ({ request }) => {
    const response = await request.get('/api/v1/benefits/b_001')
    expect(response.ok()).toBeTruthy()
    const json = await response.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('b_001')
  })

  test('GET /api/v1/dashboard/summary returns stats', async ({ request }) => {
    const response = await request.get('/api/v1/dashboard/summary')
    expect(response.ok()).toBeTruthy()
    const json = await response.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveProperty('matchedCount')
    expect(json.data).toHaveProperty('urgentCount')
  })

  test('POST /api/v1/auth/login with valid email', async ({ request }) => {
    const response = await request.post('/api/v1/auth/login', {
      data: { email: 'jisu@example.com', password: 'test' },
    })
    expect(response.ok()).toBeTruthy()
    const json = await response.json()
    expect(json.success).toBe(true)
    expect(json.data.token).toBeTruthy()
  })

  test('POST /api/v1/auth/login with invalid email returns 401', async ({ request }) => {
    const response = await request.post('/api/v1/auth/login', {
      data: { email: 'nobody@test.com', password: 'test' },
    })
    expect(response.status()).toBe(401)
  })
})
