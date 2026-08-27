################################################################################
#                                                                              #
#   ⚡ QUICK FIVE-M SETUP:                                                     #
#   1. Copy "advanced_fuel" into your "resources/[standalone]/" directory     #
#   2. Add "ensure advanced_fuel" to your "server.cfg"                         #
#   3. Restart your server or type "refresh" & "ensure advanced_fuel"!         #
#                                                                              #
################################################################################

================================================================================
         FIVEM ADVANCED FUEL & CHARGING SYSTEM v1.1.2 — DOCUMENTATION
================================================================================
Author: FiveMDev_99 & MinoForge Studios
Frameworks: QBCore / ESX Legacy / Standalone / QBox
Target System: ox_target / qb-target
Optimization: 0.00ms idle resmon
Website: https://colasmp.net
Support: minoforge.requests@gmail.com
================================================================================

[1] WHAT IT DOES (IN BRIEF)
--------------------------------------------------------------------------------
A next-generation, high-performance vehicle refueling and electric vehicle charging 
system built specifically for modern FiveM roleplay servers:
• Animated nozzle grab physics and hose sync between players.
• Dynamic fuel consumption calculated based on engine RPM, gear, and vehicle class.
• Electric Vehicle (EV) charging stations with custom UI sound effects.
• Jerry Can roadside refueling with fuel level synchronization.
• 60 FPS modern NUI glassmorphism interface.

[2] HOW IT WORKS
--------------------------------------------------------------------------------
1. DRIVE UP:    Pull up to any of the 45+ configured gas stations across San Andreas.
2. REFUELED:    Step out, target the gas pump with ox_target / qb-target, and hold [E].
3. PAY & GO:    Fuel level syncs immediately across all server clients and databases.
4. JERRY CANS:  Buy a Jerry Can from any 24/7 store to rescue stranded vehicles roadside.

[3] STEP-BY-STEP INSTALLATION
--------------------------------------------------------------------------------
STEP 1: Prerequisites
  • Ensure ox_lib (https://github.com/overextended/ox_lib) is installed.
  • (Optional) ox_target or qb-target for interaction.

STEP 2: Resource Setup
  • Extract this "advanced_fuel" folder into:
      resources/[standalone]/advanced_fuel/
  • Open your "server.cfg" and add:
      ensure ox_lib
      ensure advanced_fuel

STEP 3: Configuration
  • Open "config.lua" to configure framework ('qb', 'esx', 'standalone'),
    fuel price per liter ($1.75), electric car model whitelist, and Jerry can size.

[4] ALL COMMANDS & EXPORTS
--------------------------------------------------------------------------------
COMMAND / EXPORT                      PERMISSION      DESCRIPTION
--------------------------------------------------------------------------------
/setfuel [0-100]                      Admin Only      Set current vehicle fuel percentage
/givejerrycan [playerId]              Admin Only      Spawn a fuel jerry can for player
exports['advanced_fuel']:GetFuel(veh) All Scripts     Get vehicle fuel (0.0 to 100.0)
exports['advanced_fuel']:SetFuel(veh) All Scripts     Set vehicle fuel programmatically

[5] CLIENT & SERVER INTEGRATION EXAMPLE (Lua)
--------------------------------------------------------------------------------
-- Client-side read:
local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
local currentFuel = exports['advanced_fuel']:GetFuel(vehicle)
print("Vehicle Fuel Level: " .. currentFuel .. "%")

================================================================================
Official MinoForge Resource • Verified Security • https://colasmp.net
================================================================================
