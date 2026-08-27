################################################################################
#                                                                              #
#   ⚡ QUICK SETUP GUIDE:                                                      #
#   1. Copy the "UltimateEconomy" folder into your server's "/plugins" folder  #
#   2. Ensure you have Vault and an economy-compatible plugin installed        #
#   3. Restart your server or run "/eco reload"!                               #
#                                                                              #
################################################################################

================================================================================
          ULTIMATE ECONOMY & MULTI-VAULT PRO v2.4.0 — DOCUMENTATION
================================================================================
Author: MinoForge Studios
Platform: Paper / Purpur / Spigot / Folia (1.18 - 1.21.x)
Vault API: 1.7+ Compatible
PlaceholderAPI: Supported
Website: https://colasmp.net
Support: minoforge.requests@gmail.com
================================================================================

[1] WHAT IT DOES (IN BRIEF)
--------------------------------------------------------------------------------
Ultimate Economy is a multi-currency economic engine and banking system designed 
for high-performance Minecraft networks (EconomySMP, DonutSMP, Survival, Skyblock):
• 100% Vault & PlaceholderAPI integration with zero async tick latency.
• Interactive Chest GUI ATM & Banking System with PIN security.
• Full Auction House & Player Market with tax rates and search filters.
• Automatic hourly/daily bank interest with compound savings.
• Discord Webhook transaction logging for server administrators.
• Database support: SQLite (default, zero setup required), MySQL, PostgreSQL.

[2] HOW IT WORKS
--------------------------------------------------------------------------------
1. PLAYERS:    Earn coins by farming, selling items, or trading on the Auction House.
2. BANKING:    Type "/bank" or right-click an ATM sign to open the banking GUI.
               Deposit coins to earn compound interest every hour.
3. TRANSFERS:  Send money securely with "/pay <player> <amount>" with confirmation.
4. ADMINS:     Full command suite to inspect logs, manage balances, and set custom
               interest rates across all online/offline players.

[3] STEP-BY-STEP INSTALLATION
--------------------------------------------------------------------------------
STEP 1: Requirements
  • Minecraft Server running Paper, Purpur, Spigot, or Folia (1.18.2 - 1.21.x)
  • Vault installed (https://www.spigotmc.org/resources/vault.34315/)
  • (Optional) PlaceholderAPI for scoreboard / tab integration

STEP 2: Installation
  • Place "UltimateEconomy.jar" (or the plugin folder) into your server's:
      /plugins/
  • Restart your Minecraft server.
  • The configuration file will generate automatically at:
      /plugins/UltimateEconomy/config.yml

STEP 3: Configuration & Database
  • Open "config.yml" to customize starting balance, interest rates, and currency symbol.
  • Run "/eco reload" in-game or console to apply changes instantly.

[4] ALL COMMANDS & PERMISSIONS
--------------------------------------------------------------------------------
COMMAND                      PERMISSION            DESCRIPTION
--------------------------------------------------------------------------------
/balance [player]            mino.eco.balance      Check your or another player's balance
/pay <player> <amount>       mino.eco.pay          Send currency to target player
/bank                        mino.bank.gui         Open the interactive ATM / Banking GUI
/ah [search]                 mino.ah.use           Open the global Auction House
/ah sell <price>             mino.ah.sell          List held item on Auction House
/eco give <player> <amount>  mino.eco.admin        Add currency to a player's balance
/eco take <player> <amount>  mino.eco.admin        Remove currency from a player's balance
/eco set <player> <amount>   mino.eco.admin        Set a player's balance to exact amount
/eco reset <player>          mino.eco.admin        Reset balance to default starting amount
/eco reload                  mino.eco.admin        Reload all configs & database pool

[5] PLACEHOLDERAPI (PAPI) HOOKS
--------------------------------------------------------------------------------
%ultimateeconomy_balance%           -> Raw player balance (e.g. 1450000.00)
%ultimateeconomy_balance_formatted% -> Short formatted balance (e.g. $1.45M)
%ultimateeconomy_bank_balance%      -> Bank account savings balance
%ultimateeconomy_interest_rate%     -> Current active interest percentage (e.g. 2.5%)

================================================================================
Official MinoForge Resource • Verified Security • https://colasmp.net
================================================================================
