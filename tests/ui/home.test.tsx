import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all main components', async ({ page }) => {
    // Check for header
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Check for search input
    await expect(page.getByPlaceholder('Search specialist by name, city, specialty or phone number')).toBeVisible();
    
    // Check for results table
    await expect(page.getByRole('table')).toBeVisible();
    
    // Check for pagination
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should perform search and display results', async ({ page }) => {
    // Type in search input
    await page.getByPlaceholder('Search specialist by name, city, specialty or phone number').fill('John');
    
    // Click search button
    await page.getByRole('button').click();
    
    // Wait for results
    await page.waitForResponse(response => response.url().includes('/api/advocates'));
    
    // Check if results are displayed
    await expect(page.getByRole('table')).toBeVisible();
    const rowCount = await page.getByRole('row').count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should handle empty search results', async ({ page }) => {
    // Search for non-existent name
    await page.getByPlaceholder('Search specialist by name, city, specialty or phone number').fill('NonExistentName123');
    await page.getByRole('button').click();
    
    // Wait for response
    await page.waitForResponse(response => response.url().includes('/api/advocates'));
    
    // Check if table is empty
    await expect(page.getByText('No results found')).toBeVisible();
    await expect(page.locator('div > p:has-text("No results found")')).toBeVisible();
  });

  test('should maintain search when changing pages', async ({ page }) => {
    // Perform search
    await page.getByPlaceholder('Search specialist by name, city, specialty or phone number').fill('testing');
    await page.getByRole('button').click();
    
    // Wait for initial results
    await page.waitForResponse(response => response.url().includes('/api/advocates'));
    
    // Get initial results
    const initialResults = await page.getByTestId('advocate-row').allTextContents();
    
    // Click next page
    await page.getByTestId('next-page').click();
    
    // Wait for new results
    await page.waitForResponse(response => response.url().includes('/api/advocates'));
    
    // Get new results
    const newResults = await page.getByTestId('advocate-row').allTextContents();

    
    // Results should be different but still contain search term
    expect(initialResults).not.toEqual(newResults);
    expect(newResults.some(text => text.includes('testing'))).toBeTruthy();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus search input
    await page.getByPlaceholder('Search specialist by name, city, specialty or phone number').focus();
    
    // Type search term and press Enter
    await page.keyboard.type('John');
    await page.keyboard.press('Enter');
    
    // Wait for results
    await page.waitForResponse(response => response.url().includes('/api/advocates'));
    
    // Check if results are displayed
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should display loading state during search', async ({ page }) => {
    // Start search
    await page.getByPlaceholder('Search specialist by name, city, specialty or phone number').fill('John');
    
    // Click search and check for loading state
    const searchPromise = page.waitForResponse(response => response.url().includes('/api/advocates'));
    await page.getByRole('button').click();
    
    // Check if loading state is visible
    await expect(page.getByRole('button').locator('svg')).toHaveClass(/animate-spin/);
    
    // Wait for search to complete
    await searchPromise;
    
    // Check if loading state is removed
    await expect(page.getByRole('button').locator('svg')).not.toHaveClass(/animate-spin/);
  });
}); 