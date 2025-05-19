import { test, expect } from '@playwright/test';
import { Advocate } from "@/types/advocates";

test.describe('Advocates API', () => {
  const baseUrl = '/api/advocates';

  test('should return all advocates with default pagination', async ({ request }) => {
    const response = await request.get(baseUrl);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('pageSize', 10);
    expect(data).toHaveProperty('currentPage', 1);
    expect(data).toHaveProperty('totalPages');
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('should handle custom pagination', async ({ request }) => {
    const response = await request.get(`${baseUrl}?page=2&pageSize=5`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.pageSize).toBe(5);
    expect(data.currentPage).toBe(2);
    expect(data.data.length).toBeLessThanOrEqual(5);
  });

  test('should search by name', async ({ request }) => {
    const response = await request.get(`${baseUrl}?q=John`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data[0]).toHaveProperty('firstName');
    expect(data.data[0]).toHaveProperty('lastName');
  });

  test('should search by phone number', async ({ request }) => {
    const response = await request.get(`${baseUrl}?q=5559876543`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data[0]).toHaveProperty('phoneNumber');
  });

  test('should search by city', async ({ request }) => {
    const response = await request.get(`${baseUrl}?q=New York`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data[0]).toHaveProperty('city');
  });

  test('should search by specialty', async ({ request }) => {
    const response = await request.get(`${baseUrl}?q=Hyperactivity`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data[0]).toHaveProperty('specialties');
  });

  test('should handle empty search results', async ({ request }) => {
    const response = await request.get(`${baseUrl}?q=NonExistentName123`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.data.length).toBe(0);
    expect(data.total).toBe(0);
  });

  test('should handle invalid page number', async ({ request }) => {
    const response = await request.get(`${baseUrl}?page=0`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.currentPage).toBe(1); // Should default to page 1
  });

  test('should handle invalid page size', async ({ request }) => {
    const response = await request.get(`${baseUrl}?pageSize=0`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.pageSize).toBe(10); // Should default to 10
  });

  test('should maintain search results across pagination', async ({ request }) => {
    // First page of search results
    const firstPage = await request.get(`${baseUrl}?q=John&page=1&pageSize=5`);
    const firstPageData = await firstPage.json();

    // Second page of same search
    const secondPage = await request.get(`${baseUrl}?q=John&page=2&pageSize=5`);
    const secondPageData = await secondPage.json();

    expect(firstPageData.data).not.toEqual(secondPageData.data);
    expect(firstPageData.total).toBe(secondPageData.total);
  });

  test('should handle special characters in search', async ({ request }) => {
    const response = await request.get(`${baseUrl}?q='Smith&`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
  });

  test('should filter by years of experience (gte)', async ({ request }) => {
    const filters = JSON.stringify([{
      field: 'yearsOfExperience',
      operator: 'gte',
      value: 3
    }]);
    const response = await request.get(`${baseUrl}?filters=${encodeURIComponent(filters)}`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data.every((advocate: Advocate) => advocate.yearsOfExperience >= 3)).toBeTruthy();
  });

  test('should filter by city (eq)', async ({ request }) => {
    const filters = JSON.stringify([{
      field: 'city',
      operator: 'eq',
      value: 'New York'
    }]);
    const response = await request.get(`${baseUrl}?filters=${encodeURIComponent(filters)}`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data.every((advocate: Advocate) => advocate.city === 'New York')).toBeTruthy();
  });

  test('should filter by degree (eq)', async ({ request }) => {
    const filters = JSON.stringify([{
      field: 'degree',
      operator: 'eq',
      value: 'MD'
    }]);
    const response = await request.get(`${baseUrl}?filters=${encodeURIComponent(filters)}`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data.every((advocate: Advocate) => advocate.degree === 'MD')).toBeTruthy();
  });

  test('should handle multiple filters', async ({ request }) => {
    const filters = JSON.stringify([
      {
        field: 'yearsOfExperience',
        operator: 'gte',
        value: 2
      },
      {
        field: 'city',
        operator: 'eq',
        value: 'New York'
      }
    ]);
    const response = await request.get(`${baseUrl}?filters=${encodeURIComponent(filters)}`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data.every((advocate: Advocate) => 
      advocate.yearsOfExperience >= 2 && advocate.city === 'New York'
    )).toBeTruthy();
  });

  test('should handle invalid filter format', async ({ request }) => {
    const response = await request.get(`${baseUrl}?filters=invalid-json`);
    const data = await response.json();

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
    expect(data).toHaveProperty('error', 'Invalid filters format');
  });

  test('should combine filters with search query', async ({ request }) => {
    const filters = JSON.stringify([{
      field: 'yearsOfExperience',
      operator: 'gte',
      value: 3
    }]);
    const response = await request.get(`${baseUrl}?q=John&filters=${encodeURIComponent(filters)}`);
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data.every((advocate: Advocate) => 
      advocate.yearsOfExperience >= 3 && 
      (advocate.firstName.includes('John') || advocate.lastName.includes('John'))
    )).toBeTruthy();
  });
}); 