const express = require('express');
const router = express.Router();

// Domain-Specific Smart Rule Engine for Authentic Fallback Configurations
function generateIntelligentConfig(prompt, game = 'Minecraft', format = 'yaml') {
  const p = prompt.toLowerCase();
  const dateStr = new Date().toLocaleString();

  // ==========================================
  // MINECRAFT CATEGORIES
  // ==========================================
  if (game.toLowerCase().includes('mine')) {
    
    // 1. Zombie Apocalypse / Infection / Survival
    if (p.includes('zombie') || p.includes('apocalypse') || p.includes('infect') || p.includes('blood moon') || p.includes('cure') || p.includes('hazmat')) {
      return `# ==============================================================================
#                  MINOFORGE ZOMBIE APOCALYPSE & INFECTION ENGINE
# ==============================================================================
# Target Platform : Minecraft (Paper / Purpur / Folia 1.20 - 1.21)
# Prompt Request  : "${prompt}"
# Generated Date  : ${dateStr}
# ==============================================================================

settings:
  enabled: true
  debug: false
  locale: "en_US"
  prefix: "&8[&4&lAPOCALYPSE&8] &r"

infection_mechanics:
  bite_infection_chance_percent: 25.0 # Chance on hit by zombie
  infection_incubation_minutes: 10
  fatal_transformation: true # Player turns into aggressive zombie NPC on death
  
  stages:
    stage_1:
      trigger_minutes_after_infection: 0
      effects:
        - "SLOWNESS:1"
        - "WEAKNESS:1"
      screen_tint_color: "#701a1a"
      chat_warning: "&cYou feel a burning sensation coursing through your veins..."
    stage_2:
      trigger_minutes_after_infection: 5
      effects:
        - "CONFUSION:2"
        - "HUNGER:3"
        - "POISON:1"
      chat_warning: "&4&lYour vision begins to darken! You crave human flesh."
    stage_3:
      trigger_minutes_after_infection: 9
      effects:
        - "BLINDNESS:1"
        - "WITHER:1"
      chat_warning: "&4&lTRANSFORMATION IMMINENT! Find an antidote immediately!"

cure_and_antidotes:
  enable_vaccine_crafting: true
  antidote_syringe:
    material: "POTION"
    custom_model_data: 10042
    display_name: "&a&lBio-Shield Antidote Syringe"
    cure_chance_percent: 100.0
    crafting_recipe:
      shape:
        - " G "
        - " GPG"
        - " B "
      ingredients:
        G: "GLOWSTONE_DUST"
        P: "GLASS_BOTTLE"
        B: "BLAZE_POWDER"
  
hazmat_protection:
  require_full_suit_for_immunity: true
  durability_decay_rate_per_contact: 2
  armor_pieces:
    helmet: "YELLOW_STAINED_GLASS"
    chestplate: "GOLDEN_CHESTPLATE"
    leggings: "GOLDEN_LEGGINGS"
    boots: "GOLDEN_BOOTS"

blood_moon_event:
  enabled: true
  frequency_in_game_days: 7
  duration_minutes: 20
  sky_color: "#ff0000"
  horde_mob_multipliers:
    spawn_rate_multiplier: 3.5
    speed_boost_multiplier: 1.4
    damage_boost_multiplier: 2.0
    can_break_wooden_doors: true
    can_build_ladders: false

safe_zones:
  enable_radiation_shields: true
  particle_border_type: "END_ROD"
  regeneration_speed_ticks: 40
  prevent_zombie_entry: true
  locations:
    outpost_alpha:
      world: "world"
      center_x: 0
      center_z: 0
      radius_blocks: 150

messages:
  infected: "&cYou have been bitten! Infection will take full effect in 10 minutes."
  cured: "&aThe antidote cleared the viral pathogen from your bloodstream."
  blood_moon_start: "&4&l[!] THE BLOOD MOON HAS RISEN. THE HORDE HUNTS YOU."
  blood_moon_end: "&6&l[!] The sun rises. The blood moon subsides."
`;
    }

    // 2. Custom Enchantments & Lifesteal
    if (p.includes('enchant') || p.includes('lifesteal') || p.includes('telepathy') || p.includes('spell') || p.includes('curse')) {
      return `# ==============================================================================
#                  MINOFORGE CUSTOM ENCHANTMENTS & LIFESTEAL ENGINE
# ==============================================================================
# Target Platform : Minecraft (Paper / Purpur 1.20 - 1.21)
# Prompt Request  : "${prompt}"
# Generated Date  : ${dateStr}
# ==============================================================================

settings:
  enabled: true
  max_enchantment_slots_per_item: 5
  dust_success_rate_system: true
  black_scroll_destroy_chance: 15.0

tiers:
  simple:
    color: "&f"
    display: "&fSimple"
    exp_cost: 20
  unique:
    color: "&a"
    display: "&aUnique"
    exp_cost: 40
  elite:
    color: "&b"
    display: "&bElite"
    exp_cost: 60
  ultimate:
    color: "&e"
    display: "&eUltimate"
    exp_cost: 80
  legendary:
    color: "&6&l"
    display: "&6&lLegendary"
    exp_cost: 100

enchantments:
  lifesteal:
    tier: "legendary"
    max_level: 3
    targets: ["SWORDS", "AXES"]
    description: "Converts %chance%% of inflicted damage into player health hearts."
    level_1:
      proc_chance_percent: 10.0
      heal_amount_hearts: 0.5
      particles: "HEART"
      sound: "ENTITY_PLAYER_LEVELUP"
    level_2:
      proc_chance_percent: 18.0
      heal_amount_hearts: 1.0
      particles: "HEART"
      sound: "ENTITY_PLAYER_LEVELUP"
    level_3:
      proc_chance_percent: 25.0
      heal_amount_hearts: 1.5
      particles: "VILLAGER_HAPPY"
      sound: "ENTITY_EXPERIENCE_ORB_PICKUP"

  telepathy:
    tier: "elite"
    max_level: 1
    targets: ["PICKAXES", "SHOVELS", "AXES"]
    description: "Mined blocks and mob drops go directly into your inventory."
    auto_pickup: true
    inventory_full_action: "DROP_AT_FEET"
    sound: "ITEM_ARMOR_EQUIP_GENERIC"

  auto_smelt:
    tier: "unique"
    max_level: 3
    targets: ["PICKAXES"]
    description: "Automatically smelts raw ores into refined ingots with bonus fortune."
    level_1:
      fortune_multiplier: 1.0
    level_2:
      fortune_multiplier: 1.5
    level_3:
      fortune_multiplier: 2.0

  lightning_strike:
    tier: "ultimate"
    max_level: 2
    targets: ["BOWS", "CROSSBOWS", "TRIDENTS"]
    description: "Summons thunderous lightning strikes upon projectile impact."
    level_1:
      strike_chance_percent: 30.0
      damage: 6.0
    level_2:
      strike_chance_percent: 60.0
      damage: 12.0
`;
    }

    // 3. Custom Boss Fights & Mythic Mobs
    if (p.includes('boss') || p.includes('mythic') || p.includes('dungeon') || p.includes('raid') || p.includes('rage')) {
      return `# ==============================================================================
#                  MINOFORGE MYTHIC BOSS & DUNGEON RAID ENGINE
# ==============================================================================
# Target Platform : Minecraft (Paper / Purpur 1.20 - 1.21)
# Prompt Request  : "${prompt}"
# Generated Date  : ${dateStr}
# ==============================================================================

boss_settings:
  despawn_on_peaceful: false
  show_dynamic_boss_bar: true
  boss_bar_color: "RED" # PINK, BLUE, RED, GREEN, YELLOW, PURPLE, WHITE
  broadcast_spawn_to_server: true
  prevent_environmental_suffocation: true

bosses:
  infernal_dragon_overlord:
    type: "ENDER_DRAGON"
    display_name: "&4&l[BOSS] &c&lInfernal Dragon Overlord"
    base_health: 5000.0
    damage_reduction_percent: 40.0
    attack_damage: 35.0
    movement_speed_multiplier: 1.3
    
    phases:
      phase_1:
        health_threshold_percent: 100.0
        abilities:
          - name: "Meteor Rain"
            cooldown_seconds: 12
            particle: "FLAME"
            radius_blocks: 25
            damage: 20.0
          - name: "Summon Wither Minions"
            cooldown_seconds: 30
            mob_type: "WITHER_SKELETON"
            count: 6

      phase_2_rage_mode:
        health_threshold_percent: 40.0
        boss_bar_color: "PURPLE"
        sound: "ENTITY_WITHER_SPAWN"
        message: "&4&lOVERLORD ENTERED RAGE PHASE! Attack speed doubled!"
        abilities:
          - name: "Supernova Explosion"
            cooldown_seconds: 8
            damage: 45.0
            knockback_strength: 3.5
          - name: "Black Hole Pull"
            cooldown_seconds: 20
            pull_radius_blocks: 30

    drop_table:
      guaranteed_rewards:
        - "NETHER_STAR:1"
        - "DIAMOND_BLOCK:5"
      chance_rewards:
        - item: "DRAGON_EGG"
          chance_percent: 15.0
          display_name: "&d&lAwakened Dragon Egg"
        - command: "eco give %top_damager% 100000"
          chance_percent: 100.0
          display_name: "&6$100,000 Bounty for Top Damager"
`;
    }

    // 4. RPG Skills, Stats & Mana
    if (p.includes('rpg') || p.includes('skill') || p.includes('stat') || p.includes('mana') || p.includes('level') || p.includes('ability')) {
      return `# ==============================================================================
#                  MINOFORGE RPG STATS, SKILLS & MANA CONFIG
# ==============================================================================
# Target Platform : Minecraft (Paper / Purpur 1.20 - 1.21)
# Prompt Request  : "${prompt}"
# Generated Date  : ${dateStr}
# ==============================================================================

rpg_system:
  max_player_level: 100
  base_exp_requirement: 500
  exp_scaling_multiplier_per_level: 1.15
  loss_of_exp_on_death_percent: 5.0

mana_attributes:
  base_mana: 100
  mana_regen_interval_ticks: 20 # 1 second
  base_mana_regen_per_second: 5
  mana_bar_action_bar: true

attributes:
  strength:
    display_name: "&cStrength"
    icon: "IRON_SWORD"
    description: "Increases physical melee damage by +1.5% per point."
    max_points: 100
    damage_multiplier_per_point: 0.015
  
  defense:
    display_name: "&9Defense"
    icon: "SHIELD"
    description: "Reduces incoming enemy damage by +0.8% per point."
    max_points: 100
    damage_reduction_per_point: 0.008

  agility:
    display_name: "&aAgility"
    icon: "FEATHER"
    description: "Increases movement speed and dodge chance."
    max_points: 100
    speed_boost_per_point: 0.002
    dodge_chance_max_percent: 25.0

  intelligence:
    display_name: "&bIntelligence"
    icon: "ENCHANTED_BOOK"
    description: "Increases max mana capacity and spell cast potency."
    max_points: 100
    max_mana_bonus_per_point: 10
    spell_damage_bonus_per_point: 0.02

skill_trees:
  berserker:
    display_name: "&4&lBerserker Tree"
    ability_1:
      name: "Blood Rage"
      mana_cost: 35
      cooldown_seconds: 30
      duration_seconds: 8
      effect: "Increases attack damage by 50% when below half health."
  
  paladin:
    display_name: "&e&lPaladin Tree"
    ability_1:
      name: "Holy Radiance"
      mana_cost: 50
      cooldown_seconds: 45
      radius_blocks: 8
      effect: "Heals nearby allies for 6 hearts and blinds undead mobs."
`;
    }

    // 5. Battle Pass & Season Progression
    if (p.includes('battlepass') || p.includes('season') || p.includes('tier') || p.includes('quest') || p.includes('challenge')) {
      return `# ==============================================================================
#                  MINOFORGE BATTLE PASS & SEASON SYSTEM
# ==============================================================================
# Target Platform : Minecraft (Paper / Purpur 1.20 - 1.21)
# Prompt Request  : "${prompt}"
# Generated Date  : ${dateStr}
# ==============================================================================

season:
  id: "season_1_valkyrie"
  name: "&6&lSeason 1: Age of Valkyries"
  duration_days: 60
  total_tiers: 50
  xp_required_per_tier: 1000

tracks:
  free_track:
    display_name: "&fFree Pass"
    auto_unlocked: true
  
  premium_track:
    display_name: "&6&lPremium Pass"
    store_url: "https://colasmp.net"
    price_usd: 9.99
    xp_boost_multiplier: 1.5

tiers:
  1:
    free_reward:
      type: "ITEM"
      item: "IRON_INGOT"
      amount: 16
    premium_reward:
      type: "COMMAND"
      command: "eco give %player% 5000"
      display: "&6$5,000 Coins"
  
  10:
    free_reward:
      type: "ITEM"
      item: "DIAMOND"
      amount: 5
    premium_reward:
      type: "ITEM"
      item: "NETHERITE_SWORD"
      amount: 1
      display: "&4&lValkyrie Blade"

  50:
    free_reward:
      type: "COMMAND"
      command: "lp user %player% parent addtemp vip 30d"
      display: "&a30-Day VIP Pass"
    premium_reward:
      type: "COMMAND"
      command: "lp user %player% parent set mvp"
      display: "&6&lPERMANENT MYTHIC RANK & TITLE"

daily_quests:
  quest_1:
    name: "Monster Slayer"
    description: "Slay 50 hostile mobs in the wilderness."
    reward_xp: 250
  quest_2:
    name: "Resource Gatherer"
    description: "Mine 128 Coal, Iron, or Diamond ores."
    reward_xp: 300
`;
    }
  }

  // ==========================================
  // FIVEM CATEGORIES (Lua)
  // ==========================================
  if (game.toLowerCase().includes('fivem')) {
    if (p.includes('drug') || p.includes('weed') || p.includes('coke') || p.includes('gang') || p.includes('territory')) {
      return `-- ==============================================================================
--                  MINOFORGE DRUG LABS & GANG WAR CONFIG
-- ==============================================================================
-- Target Platform : FiveM (QBCore / ESX Legacy / ox_lib / ox_target)
-- Prompt Request  : "${prompt}"
-- Generated Date  : ${dateStr}
-- ==============================================================================

Config = {}
Config.Framework = 'qb' -- 'qb' or 'esx'
Config.Target = 'ox_target'
Config.Inventory = 'ox_inventory'

-- Police Alert Configuration
Config.Police = {
    requiredCopsOnline = 2,
    callPoliceChanceOnSale = 30, -- 30% chance NPC calls 911
    dispatchSystem = 'ps-dispatch' -- 'ps-dispatch', 'cd_dispatch', 'core-dispatch'
}

-- Drug Laboratories & Processing
Config.Laboratories = {
    coke_lab = {
        label = "Underground Cocaine Refining Lab",
        coords = vector3(1090.41, -3194.88, -38.99),
        requiredItem = 'coke_leaf',
        outputItem = 'coke_brick',
        processTimeSeconds = 15,
        requiredItemCount = 5,
        outputItemCount = 1,
        animation = {
            dict = "anim@amb@business@coc@coc_unpack_cut_left@",
            anim = "coke_cut_v1_coccutter"
        }
    },
    meth_lab = {
        label = "Desert Trailer Meth Kitchen",
        coords = vector3(1443.18, 6333.22, 23.98),
        requiredItem = 'chemical_compound',
        outputItem = 'meth_baggie',
        processTimeSeconds = 20,
        requiredItemCount = 2,
        outputItemCount = 3
    }
}

-- Gang Turf & Territory Captures
Config.Territories = {
    ballas = {
        name = "Grove Street Cul-de-Sac",
        zoneRadius = 150.0,
        coords = vector3(105.81, -1939.99, 20.80),
        taxBonusPercent = 15,
        sellingSpeedMultiplier = 1.5
    },
    vagos = {
        name = "Rancho Projects",
        zoneRadius = 180.0,
        coords = vector3(330.12, -2012.44, 22.39),
        taxBonusPercent = 15,
        sellingSpeedMultiplier = 1.5
    }
}
`;
    }
  }

  // ==========================================
  // DISCORD CATEGORIES (JSON)
  // ==========================================
  if (game.toLowerCase().includes('discord')) {
    if (p.includes('level') || p.includes('xp') || p.includes('rank') || p.includes('voice')) {
      return `// ==============================================================================
//                  MINOFORGE DISCORD LEVELING & REWARDS BOT
// ==============================================================================
// Target Platform : Discord.js v14
// Prompt Request  : "${prompt}"
// Generated Date  : ${dateStr}
// ==============================================================================

{
  "bot": {
    "token": "ENTER_BOT_TOKEN_HERE",
    "prefix": "!",
    "statusText": "Tracking server leveling..."
  },
  "leveling": {
    "enabled": true,
    "xpPerMessageMin": 15,
    "xpPerMessageMax": 25,
    "messageCooldownSeconds": 60,
    "voiceXpPerMinute": 10,
    "voiceDeafMuteGivesXp": false,
    "levelFormula": "100 * (level ** 1.5)"
  },
  "levelRoles": [
    { "level": 5, "roleId": "123456789012345678", "roleName": "Active Member" },
    { "level": 10, "roleId": "234567890123456789", "roleName": "Server Veteran" },
    { "level": 25, "roleId": "345678901234567890", "roleName": "VIP Chatter" },
    { "level": 50, "roleId": "456789012345678901", "roleName": "Mythic Legend" }
  ],
  "rankCard": {
    "backgroundColor": "#0b0f19",
    "progressBarColor": "#00f2fe",
    "textColor": "#ffffff",
    "showLeaderboardRank": true
  }
}
`;
    }
  }

  // Generic Fallback tailored to the user's exact words
  return `# ==============================================================================
#                  MINOFORGE TAILORED CONFIGURATION ENGINE
# ==============================================================================
# Target Platform : ${game}
# Prompt Request  : "${prompt}"
# Generated Date  : ${dateStr}
# ==============================================================================

settings:
  enabled: true
  debug_mode: false
  locale: "en_US"
  prefix: "&8[&bMinoForge&8] &r"

features:
  user_requirement:
    prompt: "${prompt}"
    enabled: true
    cooldown_seconds: 10
    broadcast_notifications: true

messages:
  success: "&aAction executed successfully!"
  error: "&cAn error occurred. Check server logs."
  no_permission: "&cYou lack permission to use this command."
`;
}

// @route   POST /api/ai/generate-config
// @desc    Generate a custom, dynamic, context-aware config based on prompt
router.post('/generate-config', async (req, res) => {
  try {
    const { prompt, game = 'Minecraft', format = 'yaml', complexity = '500+', apiKey } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'A prompt description is required.' });
    }

    const cleanPrompt = prompt.trim();
    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

    // If Gemini API Key exists, call Google Gemini AI Models
    if (effectiveApiKey && effectiveApiKey.trim()) {
      try {
        const candidateModels = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-flash-latest', 'gemini-pro-latest'];
        
        for (const model of candidateModels) {
          try {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveApiKey.trim()}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{
                    parts: [{
                      text: `You are an expert game server developer and plugin configuration architect.
Generate a complete, production-ready, highly detailed configuration file for ${game} (format: ${format}) based on this exact user request:

"${cleanPrompt}"

Rules:
1. Return ONLY the clean raw configuration code (e.g. YAML, Lua, JSON, or TOML) with helpful developer comments.
2. Do NOT enclose in markdown code block backticks (\`\`\`yaml or \`\`\`).
3. Make it 100% customized to every specific detail mentioned in the prompt.
4. Include realistic item IDs, permission nodes, sound effects, localized messages, and cooldowns.`
                    }]
                  }]
                })
              }
            );

            if (geminiRes.ok) {
              const data = await geminiRes.json();
              let aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (aiText) {
                aiText = aiText.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '').trim();
                return res.json({
                  success: true,
                  source: `Google Gemini AI (${model})`,
                  config: aiText
                });
              }
            }
          } catch (mErr) {
            console.warn(`Model ${model} failed, trying next:`, mErr.message);
          }
        }
      } catch (geminiErr) {
        console.warn('Backend Gemini API call failed, using intelligent rule generator:', geminiErr.message);
      }
    }

    // Intelligent context-aware domain engine
    const generated = generateIntelligentConfig(cleanPrompt, game, format);
    return res.json({
      success: true,
      source: 'MinoForge Context Engine',
      config: generated
    });

  } catch (error) {
    console.error('[AI Config Error]:', error);
    res.status(500).json({ success: false, message: 'Server error generating configuration.' });
  }
});

module.exports = router;
