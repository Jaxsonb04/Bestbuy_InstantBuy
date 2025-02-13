# Best Buy GPU Bot 🤖

An automated bot for monitoring and purchasing products from Best Buy. Built with Playwright and designed to be both fast and undetectable.

## Features ✨

- 🔍 **Real-time product monitoring**
- 🛡️ **Advanced anti-bot detection measures**
- 🚀 **Fast add-to-cart functionality**
- 🍪 **Cookie-based session management**
- 👤 **Automatic login handling**
- 📱 **Multi-product monitoring**
- 🎯 **Queue-it wait room avoidance**
- 🎨 **Colorful console logging for easy debugging**

## Prerequisites 📋

Before running the bot, ensure you have:

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (Node Package Manager)
- A Best Buy account
- Chrome browser installed

## Installation 🔧

### 1. Clone the repository:

```bash
git clone https://github.com/yourusername/bestbuy-gpu-bot.git
cd bestbuy-gpu-bot
```

### 2. Install dependencies:

```bash
npm install
```

### Dependencies 📦

This bot relies on the following npm packages:

- [dotenv](https://www.npmjs.com/package/dotenv)
- [playwright](https://www.npmjs.com/package/playwright)
- [playwright-extra](https://www.npmjs.com/package/playwright-extra)
- [puppeteer-extra-plugin-stealth](https://www.npmjs.com/package/puppeteer-extra-plugin-stealth)

#### 3. Create a `products.json` file with your target URLs:

```json
[
  "https://www.bestbuy.com/site/your-product-url-1",
  "https://www.bestbuy.com/site/your-product-url-2"
]
```

## Usage 🚀

### 1. Start the launcher to handle login:

```bash
node launcher.js
```

### 2. Log in to your Best Buy account when prompted.

### 3. The bot will automatically start monitoring your specified products.

### 4. When a product becomes available, it will be added to the cart.

### 5. **Complete checkout manually** to avoid Queue-it wait rooms.

## Configuration ⚙️

### Cookie Management
- Cookies are automatically saved after login.
- Stored in `cookies.json`.
- Used for maintaining session across runs.

### Product URLs
- Edit `products.json` to add/remove products to monitor.
- Supports multiple products simultaneously.
- Format: Array of Best Buy product URLs.

## How It Works ⚙️

### **launcher.js** - Handles login detection and transition to monitoring
- Loads existing cookies for session persistence.
- Opens Best Buy login page if not already logged in.
- Saves cookies upon successful login.
- Passes product URLs to `monitor.js`.

### **monitor.js** - Monitors product pages and adds to cart
- Loads cookies to maintain session.
- Randomly scrolls and mimics human-like behavior.
- Detects product availability and attempts to add to cart.
- Plays a notification sound when an item is successfully added.

## Anti-Detection Features 🛡️

- Random viewport sizes
- Human-like mouse movements
- Variable timing between actions
- Stealth plugin integration
- Modern user agent strings
- Disabled automation flags

## Console Output 📊

The bot uses emojis for easy status tracking:

- 🚀 **Starting up**
- 🍪 **Cookie operations**
- 🔍 **Monitoring status**
- ✨ **Product found**
- 🛒 **Cart operations**
- ✅ **Success messages**
- ❌ **Error/unavailable notices**
- ⏳ **Waiting/refresh status**

## Important Notes ⚠️

- This bot is for **educational purposes only**.
- Be aware of [Best Buy's terms of service](https://www.bestbuy.com/site/help-topics/terms-conditions/pcmcat204400050018.c?id=pcmcat204400050018).
- **Manual checkout is recommended** for high-demand items.
- Performance may vary based on network conditions.
- Not guaranteed to bypass all anti-bot measures.



## Contributing 🤝

Contributions are welcome! Please feel free to submit a [Pull Request](https://github.com/yourusername/bestbuy-gpu-bot/pulls).

## License 📄

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## Disclaimer ⚖️

This bot is for **educational purposes only**. Use at your own risk. The authors are not responsible for any misuse or any consequences thereof.
