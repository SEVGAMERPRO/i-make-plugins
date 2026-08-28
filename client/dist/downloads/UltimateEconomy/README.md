> # ⚡ **QUICK SETUP GUIDE:**
> ### **1. Copy the `UltimateEconomy` folder into your server's `/plugins` directory.**
> ### **2. Ensure `Vault` is installed on your server, then restart or run `/eco reload`!**

---

# 💰 Ultimate Economy & Multi-Vault Pro v2.4.0
*Official verified resource from [MinoForge](https://colasmp.net)*

---

## 📌 [1] What It Does (In Brief)
Ultimate Economy is an enterprise-grade Minecraft economy and banking plugin:
* **Vault & PlaceholderAPI Compatible**: Seamless sync across shop plugins, tab lists, and scoreboards.
* **Interactive ATM & Banking GUI**: Deposit coins, earn interest, and set PIN protection.
* **Auction House System**: Fully customizable GUI for buying and selling items with tax rates.
* **Folia Multi-threading**: Optimized for high-concurrency servers with 0.00ms tick delay.

---

## 📋 [2] All Commands & Permissions

| Command | Permission | Description |
| :--- | :--- | :--- |
| `/balance [player]` | `mino.eco.balance` | Check your or another player's balance |
| `/pay <player> <amount>` | `mino.eco.pay` | Send currency to target player |
| `/bank` | `mino.bank.gui` | Open the interactive ATM / Banking GUI |
| `/ah [search]` | `mino.ah.use` | Open the global Auction House |
| `/ah sell <price>` | `mino.ah.sell` | List held item on Auction House |
| `/eco give <player> <amount>` | `mino.eco.admin` | Add currency to a player's balance |
| `/eco take <player> <amount>` | `mino.eco.admin` | Remove currency from a player's balance |
| `/eco set <player> <amount>` | `mino.eco.admin` | Set a player's balance to exact amount |
| `/eco reload` | `mino.eco.admin` | Reload all configs & database pool |

---

## ⚙️ [3] Configuration Sample (`config.yml`)

```yaml
database:
  type: "SQLITE" # Options: SQLITE, MYSQL, POSTGRESQL
  host: "localhost"
  port: 3306
  database: "minecraft_eco"
  username: "root"
  password: "password123"

currency:
  name-singular: "Coin"
  name-plural: "Coins"
  symbol: "$"
  starting-balance: 250.00
  allow-negative-balance: false

banking:
  enabled: true
  max-accounts-per-player: 3
  daily-interest-rate: 0.015 # 1.5% daily interest
```

---
*Official MinoForge Resource • Verified Security • [colasmp.net](https://colasmp.net)*
