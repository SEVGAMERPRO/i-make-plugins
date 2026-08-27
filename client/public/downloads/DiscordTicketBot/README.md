> # ⚡ **QUICK 1-CLICK SETUP:**
> ### **Or run the `install.bat` file to download everything, then just configure your bot in `config.example.json`!**

---

# 🎫 Discord Ticket & Transcripts Bot v1.0.0
*Official verified resource from [MinoForge](https://colasmp.net)*

---

## 📌 [1] What It Does (In Brief)
This bot provides a fast, automated support ticket system for Discord servers:
* **Replaces messy DMs** with clean, private 1-on-1 support channels.
* **1-Click Button & Modal creation** for instant ticket opening.
* **Automatic HTML Transcripts** archived to a staff log channel on closure.
* **Role-based permissions** ensuring complete privacy.

---

## 🚀 [2] Step-by-Step Setup

### Option A: 1-Click Installer (Windows)
1. Double click **`install.bat`** in the folder.
2. It automatically installs all dependencies and creates your `config.json`.
3. Open `config.json` (or `config.example.json`) and paste your Bot Token and Server IDs.
4. Run `node index.js`!

### Option B: Manual Setup
1. **Install Node.js 18+** from [nodejs.org](https://nodejs.org).
2. **Discord Developer Portal**: Enable *Server Members Intent* and *Message Content Intent* under your Bot settings at [discord.com/developers](https://discord.com/developers/applications).
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Configuration**:
   Copy `config.example.json` to `config.json` and fill in your Bot Token and Channel IDs.
5. **Start Bot**:
   ```bash
   node index.js
   ```
   *(Or with PM2: `pm2 start index.js --name "ticket-bot"`)*
6. **Deploy Panel**:
   In your `#support` channel, type `/ticket setup`!

---

## 📋 [3] All Commands & Usage

| Command | Permission | Description |
| :--- | :--- | :--- |
| `/ticket setup` | `Administrator` | Deploys the interactive button panel |
| `/ticket close [reason]` | `Staff & Creator` | Closes ticket & exports HTML transcript |
| `/ticket add @user` | `Staff Only` | Adds another user to the active ticket |
| `/ticket remove @user` | `Staff Only` | Removes a user from the active ticket |
| `/ticket rename [name]` | `Staff Only` | Renames the active ticket channel |
| `/ticket transcript` | `Staff Only` | Exports HTML transcript without closing |

---

## ⚙️ [4] Configuration Sample (`config.json`)

```json
{
  "botToken": "YOUR_DISCORD_BOT_TOKEN_HERE",
  "clientId": "YOUR_DISCORD_APPLICATION_CLIENT_ID",
  "guildId": "YOUR_DISCORD_SERVER_ID",
  "ticketCategoryChannelId": "CATEGORY_CHANNEL_ID_FOR_TICKETS",
  "transcriptLogsChannelId": "TEXT_CHANNEL_ID_FOR_HTML_TRANSCRIPTS",
  "supportStaffRoleId": "ROLE_ID_OF_YOUR_SUPPORT_STAFF",
  "maxOpenTicketsPerUser": 2,
  "askFeedbackOnClose": true
}
```

---
*Official MinoForge Resource • Verified Security • [colasmp.net](https://colasmp.net)*
