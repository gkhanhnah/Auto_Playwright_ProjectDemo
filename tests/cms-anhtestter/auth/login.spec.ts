import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/cms-anhtestter/LoginPage.ts';
import user from '../../../test-data/cms-anhtester/user.json';
test.describe('Login', () => {

    test('Login success', async ({ page }) => { 
        const login = new LoginPage(page);
        await login.goto();
        await login.login(user.email, user.password);
        await expect(page).toHaveURL(/admin/);
    });
  
    test('Login with wrong password', async ({ page }) => { 
        const login = new LoginPage(page);
        await login.goto();
        await login.login(user.email, 'wrong');
        await expect(login.errorMessage()).toBeVisible();
    });
  
    test('Empty email', async ({ page }) => { 
        const login = new LoginPage(page);
        await login.goto();
        await login.login('', user.password);
        await expect(login.errorMessage()).toBeVisible();
    });
  
    test('Invalid email format', async ({ page }) => { 
        const login = new LoginPage(page);
        await login.goto();
        await login.login('invalid', user.password);
        await expect(login.errorMessage()).toBeVisible();
    });
  
    test('Access admin without login', async ({ page }) => { 
        const login = new LoginPage(page);
        await login.goto();
        await expect(page).toHaveURL(/login/);
    });
});