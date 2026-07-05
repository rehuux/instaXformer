# Insta Former Username Remover

A Discord-based bot that helps reduce or remove your Instagram Former Usernames count by automatically updating your Instagram profile picture multiple times.

The bot is simple to use, privacy-focused, and includes a built-in Instagram Session ID Extractor, allowing you to obtain your Session ID without using third-party tools.

> **Note:** Most users are able to reduce their Former Usernames count to 0 after running the bot 2–3 times, although results may vary depending on the account.

---

## Features

- 🤖 **Easy-to-use** Discord slash commands.
- 🔄 **Automatically changes** your Instagram profile picture continuously.
- 📉 Helps **reduce or remove** your Instagram Former Usernames count.
- 🔑 **Built-in Instagram Session ID Extractor** — no third-party tools needed.
- 🖼️ **Multiple profile pictures** that rotate automatically.
- ⚡ **Fast and lightweight** — minimal resource usage.
- 🛡️ **No database required** — all processing happens in memory.
- 💻 **Easy to deploy** on Render, Railway, VPS, or your local machine.

---

## 🚀 How It Works

1. Invite or run the Discord bot.
2. Use the built-in Session ID Extractor if you don't already have your Instagram Session ID.
3. Enter your Session ID using the provided slash command.
4. The bot logs into your Instagram session.
5. It continuously changes your Instagram profile picture using the included images.
6. After completing the process (usually 2–3 runs), your Instagram Former Usernames count may be reduced or removed.

The bot performs the entire process automatically, so no manual profile picture changes are required.

---

## 🔑 Session ID Extractor

This project includes a built-in Instagram Session ID Extractor.

You can easily extract your Instagram Session ID and use it directly with the bot without needing external websites or browser extensions.

**How to use:**
```

/get_session username:your_username password:your_password

```

The bot will log in and return your Session ID instantly.

---

## 🎮 Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/get_session` | 🔑 Get Instagram Session ID using username and password | `/get_session username:myuser password:mypass` |
| `/former` | 🔄 Change profile picture continuously using Session ID | `/former session_id:xxxxxx times:50` |
| `/ping` | 🏓 Check bot latency and status | `/ping` |
| `/help` | 📖 Show all commands and developer info | `/help` |

---

## 📁 Project Structure

```

instaXformer/
├── src/
│   ├── commands/
│   │   ├── former.js          # Main profile picture changer
│   │   ├── get_session.js     # Session ID extractor
│   │   ├── ping.js            # Ping command
│   │   └── help.js            # Help command
│   ├── utils/
│   │   └── instagram.js       # Instagram API wrapper
│   └── index.js               # Bot entry point
├── images/                    # Profile pictures
│   ├── img1.jpg
│   ├── img2.jpg
│   ├── img3.jpg
│   ├── img4.jpg
│   ├── img5.jpg
│   └── img6.jpg
├── .gitignore
├── package.json
├── deploy-commands.js
├── render.yaml
├── build.sh
└── README.md

```

---

## 🛠️ Installation

### Prerequisites

- Node.js 22.x or higher
- npm or yarn
- Discord Bot Token (from Discord Developer Portal)

### Local Setup

```bash
# Clone the repository
git clone https://github.com/rehuux/instaXformer.git
cd instaXformer

# Install dependencies
npm install

# Add your images to the images/ folder
# Supported formats: .jpg, .png, .jpeg
# Recommended: 1:1 aspect ratio, < 1MB file size

# Create .env file
echo "DISCORD_TOKEN=your_bot_token_here" >> .env
echo "CLIENT_ID=your_client_id_here" >> .env

# Deploy slash commands
npm run deploy

# Start the bot
npm start
```

---

🚀 Deployment on Render

Step-by-Step

1. Push code to GitHub
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/rehuux/instaXformer.git
   git push -u origin main
   ```
2. Go to render.com and sign up with GitHub
3. Create a new Web Service
   · Connect your GitHub repository
   · Name: insta-former-username-remover
   · Runtime: Node
   · Build Command: npm install
   · Start Command: npm start
   · Instance Type: Free
4. Add Environment Variables
   Key Value
   DISCORD_TOKEN Your Discord bot token
   CLIENT_ID Your Discord application ID
5. Click Create Web Service and wait for deployment
6. Your bot is now live! 🎉

---

🔒 Privacy & Security

Your privacy is important.

Item Status
Instagram Session ID stored? ❌ Never stored
Instagram Username stored? ❌ Never stored
Instagram Password stored? ❌ Never stored
Account data saved in database? ❌ No database used
Session persistence ✅ Optional session.json for reuse (gitignored)

Everything is processed only for the current request, making the tool simple and privacy-friendly.

---

🖼️ Images

The bot comes with 6 default images that rotate automatically during the profile picture change process.

You can replace them with your own images:

· Supported formats: .jpg, .png, .jpeg
· Recommended: Square (1:1 aspect ratio)
· Recommended size: < 1MB per image

---

📊 Stats

Feature Value
Commands 4
Images 6 (customizable)
Max Changes 100 per run
Cooldown None (Instagram rate limits apply)
Deployment Render, Railway, VPS, Local

---

⚠️ Disclaimer

This project is provided for educational and personal-use purposes only.

You are solely responsible for how you use this software. Use it responsibly and always comply with Instagram's Terms of Service.

The developer is not responsible for any account restrictions, temporary blocks, or any other consequences resulting from misuse of this project.

---

❤️ Credits

Role Name
Credit Syed Rehan
Developer @rehuux (GitHub)
Tool Name Insta Former Username Remover

---

⭐ Support

If you found this project useful, consider giving the repository a ⭐ to support future development.

GitHub: https://github.com/rehuux/instaXformer

---

📝 License

MIT License — Free to use, modify, and distribute.

---

🔗 Links

· GitHub Repository
· Discord Developer Portal
· Render

---

Made with ❤️ by Syed Rehan (@rehuux)

```
