> # ⚡ **QUICK FIVEM SETUP:**
> ### **1. Copy `advanced_fuel` into your `resources/[standalone]/` directory.**
> ### **2. Add `ensure advanced_fuel` to your `server.cfg` and restart!**

---

# ⛽ FiveM Advanced Fuel & Electric Charging System v1.1.2
*Official verified resource from [MinoForge](https://colasmp.net)*

---

## 📌 [1] What It Does (In Brief)
* **0.00ms Idle Resmon**: Hyper-optimized Lua 5.4 backend.
* **QBCore, ESX & QBox Support**: Auto-detects active framework.
* **Electric Vehicle Charging**: Whitelist EV cars (Raiden, Neon, Cyclone) with custom charging sounds.
* **Animated Hose & Nozzle**: Synced physics across all players.

---

## 📋 [2] All Commands & Exports

| Command / Export | Permission | Description |
| :--- | :--- | :--- |
| `/setfuel [0-100]` | `Admin Only` | Set vehicle fuel percentage |
| `/givejerrycan [player]` | `Admin Only` | Give Jerry Can to player |
| `exports['advanced_fuel']:GetFuel(veh)` | `Public API` | Returns float (0.0 to 100.0) |
| `exports['advanced_fuel']:SetFuel(veh, amount)` | `Public API` | Sets vehicle fuel level |

---

## ⚙️ [3] Configuration Sample (`config.lua`)

```lua
Config = {}
Config.Framework = 'qb' -- 'qb', 'esx', or 'standalone'
Config.Target = 'ox_target' -- 'ox_target' or 'qb-target'
Config.FuelPrice = 1.75 -- Price per Liter
Config.JerryCanCapacity = 25.0
Config.RefuelSpeed = 1.5

Config.ElectricVehicles = {
    'raiden',
    'neon',
    'cyclone',
    'iwagen',
    'tezeract'
}
```

---
*Official MinoForge Resource • Verified Security • [colasmp.net](https://colasmp.net)*
