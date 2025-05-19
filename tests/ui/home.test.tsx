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
    
    // Check for filters section
    await expect(page.getByText('Filters')).toBeVisible();
    
    // Check for results table
    await expect(page.getByRole('table')).toBeVisible();
    
    // Check for pagination
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should perform search and display results', async ({ page }) => {
    // Type in search input
    await page.getByPlaceholder('Search specialist by name, city, specialty or phone number').fill('John');
    
    // Click search button
    await page.getByTestId('search-button').click();
    
    // Wait for results
    await page.waitForResponse(response => response.url().includes('/api/advocates'));
    
    // Check if results are displayed
    await expect(page.getByRole('table')).toBeVisible();
    const rowCount = await page.getByTestId('advocate-row').count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should handle empty search results', async ({ page }) => {
    // Search for non-existent name
    await page.getByPlaceholder('Search specialist by name, city, specialty or phone number').fill('NonExistentName123');
    await page.getByTestId('search-button').click();
    
    // Wait for response
    await page.waitForResponse(response => response.url().includes('/api/advocates'));
    
    // Check if table is empty
    await expect(page.getByText('No results found')).toBeVisible();
  });

  test('should maintain search when changing pages', async ({ page }) => {
    // Perform search
    await page.getByPlaceholder('Search specialist by name, city, specialty or phone number').fill('testing');
    await page.getByTestId('search-button').click();
    
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

  test('should apply filters correctly', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: /filters/i }).click();
    
    // Select minimum years of experience
    await page.getByTestId('select-yearsOfExperience').click();
    await page.getByText('3 years').click();
    
    // Select city
    await page.getByTestId('select-city').click();
    await page.getByText('New York').click();
    
    // Wait for filtered results
    await page.waitForResponse(response => response.url().includes('/api/advocates'));
    
    // Verify results match filters
    const rows = await page.getByTestId('advocate-row').all();
    for (const row of rows) {
      const yearsOfExperience = await row.getByTestId('years-of-experience').textContent();
      const city = await row.getByTestId('city').textContent();
      expect(Number(yearsOfExperience)).toBeGreaterThanOrEqual(3);
      expect(city).toBe('New York');
    }
  });

  test('should clear filters', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: /filters/i }).click();
    
    // Apply some filters
    await page.getByTestId('select-yearsOfExperience').click();
    await page.getByText('3 years').click();
    
    // Wait for filtered results
    await page.waitForResponse(response => response.url().includes('/api/advocates'));
    
    // Clear filters
    await page.getByTestId('clear-filters').click();

    // Wait for unfiltered results
    await page.waitForResponse(response => response.url().includes('/api/advocates'));
    
    // Verify all results are shown
    const rowCount = await page.getByTestId('advocate-row').count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should handle responsive layout', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.getByTestId('advocate-table')).toBeVisible();
    await expect(page.getByTestId('advocate-mobile-table')).toBeHidden();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByTestId('advocate-mobile-table')).toBeVisible();
    await expect(page.getByTestId('advocate-table')).toBeHidden();
  });
}); 