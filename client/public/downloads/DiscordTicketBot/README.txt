################################################################################
#                                                                              #
#   ⚡ QUICK 1-CLICK SETUP:                                                    #
#   Or run the install.bat file to download everything, then just configure   #
#   your bot in config.example.json (or config.json)!                          #
#                                                                              #
################################################################################

================================================================================
           DISCORD TICKET & TRANSCRIPTS BOT — OFFICIAL DOCUMENTATION
================================================================================
Version: v1.0.0
Author: BotCrafter (MinoForge Verified Studio)
Platform: Node.js 18+ / Discord.js v14
Website: https://colasmp.net
Support: minoforge.requests@gmail.com
================================================================================

[1] WHAT IT DOES (IN BRIEF)
--------------------------------------------------------------------------------
This bot provides a fast, automated support ticket system for Discord servers:
• Replaces messy DMs with clean, private 1-on-1 support channels.
• Users open tickets with 1-click interactive buttons and popup modal forms.
• Automatically archives full chat history into standalone HTML transcripts
  viewable in any web browser.
• Manages staff permissions so only authorized moderators can view tickets.

[2] HOW IT WORKS
--------------------------------------------------------------------------------
1. PANEL:      The bot posts a permanent "Open Ticket" panel in your #support channel.
2. CREATION:   When clicked, a popup asks for their issue reason, then creates a 
               private ticket channel (e.g. #ticket-username).
3. SUPPORT:    The user and assigned Support Staff chat privately to resolve the issue.
4. RESOLUTION: Clicking "Close & Save Transcript" generates an HTML file with all
               messages, attachments, and timestamps, sends it to your #ticket-logs 
               channel, and cleanly deletes the ticket channel.

[3] STEP-BY-STEP SETUP INSTRUCTIONS
--------------------------------------------------------------------------------
⚡ FASTEST WAY (WINDOWS):
  • Just double click "install.bat" to download all dependencies automatically!
  • Then configure "config.json" (or "config.example.json").

MANUAL WAY:
STEP 1: Prerequisites
  • Install Node.js (v18.0.0 or newer) from https://nodejs.org
  • Create an application at https://discord.com/developers/applications

STEP 2: Enable Bot Gateway Intents
  • Go to your Discord Developer Portal -> Your App -> "Bot" tab.
  • Enable:
    - [x] Presence Intent
    - [x] Server Members Intent
    - [x] Message Content Intent
  • Copy your Bot Token.

STEP 3: Install Dependencies
  • Open your terminal / command prompt in this folder and run:
      npm install

STEP 4: Configure the Bot
  • Rename "config.example.json" to "config.json" (or create "config.json").
  • Fill in your IDs:
    {
      "botToken": "YOUR_BOT_TOKEN_HERE",
      "clientId": "YOUR_APPLICATION_CLIENT_ID",
      "guildId": "YOUR_DISCORD_SERVER_ID",
      "ticketCategoryChannelId": "CATEGORY_ID_WHERE_TICKETS_ARE_CREATED",
      "transcriptLogsChannelId": "CHANNEL_ID_FOR_HTML_TRANSCRIPTS",
      "supportStaffRoleId": "ROLE_ID_OF_YOUR_SUPPORT_STAFF",
      "maxOpenTicketsPerUser": 2
    }

STEP 5: Launch the Bot
  • Start directly:
      node index.js
    OR use PM2 for 24/7 background hosting:
      npm install -g pm2
      pm2 start index.js --name "ticket-bot"

STEP 6: Deploy Ticket Panel
  • In your Discord server #support channel, run:
      /ticket setup
    The interactive ticket button panel will appear instantly!

[4] ALL COMMANDS & USAGE
--------------------------------------------------------------------------------
COMMAND                      PERMISSION        DESCRIPTION
--------------------------------------------------------------------------------
/ticket setup                Administrator     Deploys the interactive button panel
/ticket close [reason]       Staff & Creator   Closes ticket & exports HTML transcript
/ticket add @user            Staff Only        Adds another user to the active ticket
/ticket remove @user         Staff Only        Removes a user from the active ticket
/ticket rename [name]        Staff Only        Renames the active ticket channel
/ticket transcript           Staff Only        Exports HTML transcript without closing
/ticket stats                Staff Only        Shows ticket response time and totals

[5] FILE STRUCTURE
--------------------------------------------------------------------------------
├── install.bat          -> 1-Click automated installer for Windows
├── index.js             -> Main Discord.js bot source code
├── package.json         -> Node.js dependencies (discord.js, etc.)
├── config.example.json  -> Template configuration file
├── config.json          -> Your live secret bot token & server IDs
├── README.txt           -> This quick instruction and command guide
├── README.md            -> Markdown documentation guide
└── transcripts/         -> Local directory storing archived HTML transcripts

[6] TROUBLESHOOTING & FAQ
--------------------------------------------------------------------------------
Q: The bot doesn't respond to buttons?
A: Ensure "Message Content Intent" and "Server Members Intent" are ON in the
   Discord Developer Portal under Bot settings.

Q: The bot cannot create ticket channels?
A: Give the bot's role the "Manage Channels" and "Manage Roles" permissions
   and place its role above the Support Staff role in Server Settings -> Roles.

================================================================================
Official MinoForge Resource • Verified Security • https://colasmp.net
================================================================================
