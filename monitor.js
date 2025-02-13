// monitor.js - Monitors product pages and adds to cart when available
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const COOKIES_FILE = path.join(__dirname, 'cookies.json');

async function monitor(products) {
    console.log('🚀 Starting product monitoring...');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        ]
    });
    
    const context = await browser.newContext({
        viewport: {
            width: 1920 + Math.floor(Math.random() * 100),
            height: 1080 + Math.floor(Math.random() * 50)
        }
    });

    // Inject human-like behaviors
    await context.addInitScript(() => {
        window.navigator.webdriver = false;
        delete window.navigator.__proto__.webdriver;
        
        // Add random mouse movements
        const moveMouseRandomly = () => {
            const x = Math.floor(Math.random() * window.innerWidth);
            const y = Math.floor(Math.random() * window.innerHeight);
            const event = new MouseEvent('mousemove', {
                clientX: x,
                clientY: y,
                bubbles: true
            });
            document.dispatchEvent(event);
        };
        
        setInterval(moveMouseRandomly, Math.random() * 3000 + 1000);
    });
    
    // Load saved cookies
    if (fs.existsSync(COOKIES_FILE)) {
        const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE, 'utf8'));
        await context.addCookies(cookies);
        console.log('🍪 Cookies loaded successfully');
    }
    
    for (const productUrl of products) {
        (async () => {
            const page = await context.newPage();
            
            await page.setDefaultTimeout(30000);
            await page.setDefaultNavigationTimeout(30000);
            
            console.log(`🔍 Monitoring: ${productUrl}`);
            await page.goto(productUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 60000
            });
            
            // Add a small wait after page load
            await page.waitForTimeout(Math.random() * 1000 + 500);
            
            while (true) {
                try {
                    // Random scroll before checking button
                    await page.evaluate(() => {
                        window.scrollTo({
                            top: Math.random() * 500,
                            behavior: 'smooth'
                        });
                    });

                    await page.waitForSelector('button.add-to-cart-button', { 
                        timeout: Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000 
                    });
                    
                    const button = await page.$('button.add-to-cart-button');
                    const isDisabled = await button.getAttribute('disabled');
                    const buttonState = await button.getAttribute('data-button-state');
                    
                    if (!isDisabled && buttonState !== 'SOLD_OUT' && buttonState !== 'COMING_SOON') {
                        console.log(`✨ PRODUCT IN STOCK: ${productUrl}`);
                        console.log('🛒 Attempting to add to cart...');
                        
                        // Simulate human-like click with random offset
                        const box = await button.boundingBox();
                        await page.mouse.move(
                            box.x + box.width/2 + (Math.random() * 10 - 5),
                            box.y + box.height/2 + (Math.random() * 10 - 5)
                        );
                        await page.waitForTimeout(Math.random() * 200 + 100);
                        await button.click();
                        
                        console.log('✅ Successfully added to cart!');
                        console.log('👉 Please complete checkout manually to avoid queue-it wait rooms');
                        
                        // Play notification sound (optional)
                        console.log('\u0007'); // System beep
                        break;
                    } else {
                        const status = buttonState === 'SOLD_OUT' ? '❌ SOLD OUT' : 
                                      buttonState === 'COMING_SOON' ? '⏳ COMING SOON' : 
                                      '❌ NOT AVAILABLE';
                        console.log(`${status}: ${productUrl}`);
                        console.log(`⏳ Refreshing in a few seconds...`);
                    }
                } catch (e) {
                    console.log(`❌ Error checking stock: ${productUrl}`);
                    console.log(`⏳ Refreshing in a few seconds...`);
                }
                
                // More natural random refresh timing
                const delay = Math.floor(Math.random() * (8000 - 5000 + 1)) + 5000;
                await page.waitForTimeout(delay);
                await page.reload({ waitUntil: 'domcontentloaded' });
            }
        })();
    }
}

module.exports = monitor;
