// launch.js - Handles login detection and transition to monitoring
const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');
const path = require('path');

chromium.use(stealth);

const COOKIES_FILE = path.join(__dirname, 'cookies.json');
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

(async () => {
    const browser = await chromium.launchPersistentContext(
        path.join(__dirname, 'chrome-user-data-login'),
        {
            headless: false,
            slowMo: Math.floor(Math.random() * (50 - 20 + 1)) + 20,
            viewport: {
                width: 1920 + Math.floor(Math.random() * 100),
                height: 1080 + Math.floor(Math.random() * 50)
            },
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-first-run',
                '--password-store=basic',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                `--window-size=${1920 + Math.floor(Math.random() * 100)},${1080 + Math.floor(Math.random() * 50)}`,
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            ]
        }
    );
    
    const context = browser;
    const page = await context.newPage();
    
    // Load cookies if available and valid
    if (fs.existsSync(COOKIES_FILE) && fs.statSync(COOKIES_FILE).size > 0) {
        try {
            const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE, 'utf8'));
            if (Array.isArray(cookies) && cookies.length > 0) {
                await context.addCookies(cookies);
                console.log("Cookies loaded successfully.");
            } else {
                console.log("Cookies file is empty or malformed. Logging in manually.");
            }
        } catch (error) {
            console.error("Error loading cookies:", error);
        }
    } else {
        console.log("No valid cookies found. Logging in manually.");
    }
    
    console.log("Opening Best Buy...");
    await page.goto('https://www.bestbuy.com', { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(3000); // Give time for the page to load

    // Check login status
    try {
        const accountText = await page.evaluate(() => {
            const accountElement = document.querySelector(".account-button span.line-clamp");
            return accountElement ? accountElement.innerText.trim() : "";
        });
    
        if (accountText === "Account") {
            console.log("Not logged in. Please log in manually.");
            await page.waitForSelector(".account-button", { timeout: 60000 }); // Wait for manual login
            
            console.log("Waiting for login confirmation...");
            while (true) {
                try {
                    const newAccountText = await page.evaluate(() => {
                        const accountElement = document.querySelector(".account-button span.line-clamp");
                        return accountElement ? accountElement.innerText.trim() : "";
                    });
                    if (newAccountText !== "Account" && newAccountText !== "") break;
                } catch (error) {
                    console.warn("Navigation occurred while checking login status. Retrying...");
                }
                await page.waitForTimeout(2000);
            }
            
            console.log("Login detected! Saving session...");
            try {
                fs.writeFileSync(COOKIES_FILE, JSON.stringify(await context.cookies(), null, 2));
                console.log("Cookies saved successfully.");
            } catch (error) {
                console.error("Error saving cookies:", error);
            }
        } else {
            console.log("Already logged in as", accountText);
        }
    } catch (error) {
        console.error("Error checking login status:", error);
    }
    
    console.log("Closing browser and launching monitor...");
    await browser.close();
    
    // Pass product URLs to monitor
    if (fs.existsSync(PRODUCTS_FILE) && fs.statSync(PRODUCTS_FILE).size > 0) {
        try {
            const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
            if (Array.isArray(products) && products.length > 0) {
                console.log("Monitoring products:", products);
                require('./monitor')(products);
            } else {
                console.log("Products file is empty or malformed.");
            }
        } catch (error) {
            console.error("Error reading products file:", error);
        }
    } else {
        console.log("Products file not found or empty. Please create products.json.");
    }
})();
