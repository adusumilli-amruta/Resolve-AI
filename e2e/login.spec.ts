import { test, expect } from '@playwright/test';

test('has title and redirects to login when not authenticated', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ResolveAI/);

  // Click explicit dashboard link
  await page.goto('/dashboard');
  
  // Since we are unauthenticated, middleware should redirect to /login
  await expect(page).toHaveURL(/.*\/login/);
  
  // Expect login page to have specific text
  await expect(page.locator('h1')).toContainText('Sign in to ResolveAI');
});
