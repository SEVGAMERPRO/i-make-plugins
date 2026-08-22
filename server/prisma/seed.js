const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MinoForge database...');

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@colasmp.net' },
    update: {},
    create: {
      username: 'MinoForge',
      email: 'admin@colasmp.net',
      passwordHash: adminPassword,
      role: 'ADMIN',
      bio: 'Founder of MinoForge — custom game plugins.',
      avatarUrl: 'https://placehold.co/150x150/2196F3/FFFFFF?text=MF'
    }
  });

  console.log('Admin user seeded:', admin.username);

  // Create Games
  const gamesData = [
    { name: 'Minecraft', slug: 'minecraft', description: 'The world\'s best-selling sandbox game. Build, explore, and survive in infinite worlds.', imageUrl: 'https://placehold.co/400x300/4CAF50/FFFFFF?text=Minecraft', bannerUrl: 'https://placehold.co/1200x400/388E3C/FFFFFF?text=Minecraft+Plugins', displayOrder: 1 },
    { name: 'Roblox', slug: 'roblox', description: 'Platform powering imagination. Create and play millions of user-generated experiences.', imageUrl: 'https://placehold.co/400x300/F44336/FFFFFF?text=Roblox', bannerUrl: 'https://placehold.co/1200x400/D32F2F/FFFFFF?text=Roblox+Plugins', displayOrder: 2 },
    { name: 'FiveM', slug: 'fivem', description: 'Multiplayer modification framework for GTA V. Build custom roleplay and game servers.', imageUrl: 'https://placehold.co/400x300/FF9800/FFFFFF?text=FiveM', bannerUrl: 'https://placehold.co/1200x400/F57C00/FFFFFF?text=FiveM+Scripts', displayOrder: 3 },
    { name: 'The Isle: Evrima', slug: 'the-isle-evrima', description: 'Immersive dinosaur survival game. Play as prehistoric creatures in a harsh environment.', imageUrl: 'https://placehold.co/400x300/2E7D32/FFFFFF?text=The+Isle', bannerUrl: 'https://placehold.co/1200x400/1B5E20/FFFFFF?text=The+Isle+Evrima+Mods', displayOrder: 4 },
    { name: 'Garry\'s Mod', slug: 'gmod', description: 'Physics sandbox game. Create contraptions, roleplay servers, and custom game modes.', imageUrl: 'https://placehold.co/400x300/1565C0/FFFFFF?text=Garrys+Mod', bannerUrl: 'https://placehold.co/1200x400/0D47A1/FFFFFF?text=GMod+Addons', displayOrder: 5 },
    { name: 'Rust', slug: 'rust', description: 'Brutal multiplayer survival. Gather, craft, and fight to stay alive.', imageUrl: 'https://placehold.co/400x300/795548/FFFFFF?text=Rust', bannerUrl: 'https://placehold.co/1200x400/4E342E/FFFFFF?text=Rust+Plugins', displayOrder: 6 },
    { name: 'ARK: Survival Evolved', slug: 'ark', description: 'Tame dinosaurs, build bases, and survive in a massive open world.', imageUrl: 'https://placehold.co/400x300/33691E/FFFFFF?text=ARK', bannerUrl: 'https://placehold.co/1200x400/1B5E20/FFFFFF?text=ARK+Mods', displayOrder: 7 },
    { name: 'Discord', slug: 'discord', description: 'Build powerful bots and integrations for Discord communities.', imageUrl: 'https://placehold.co/400x300/7C4DFF/FFFFFF?text=Discord', bannerUrl: 'https://placehold.co/1200x400/651FFF/FFFFFF?text=Discord+Bots', displayOrder: 8 }
  ];

  for (const gameData of gamesData) {
    await prisma.game.upsert({
      where: { slug: gameData.slug },
      update: {},
      create: gameData
    });
  }

  console.log('Games seeded.');

  const minecraft = await prisma.game.findUnique({ where: { slug: 'minecraft' } });
  const roblox = await prisma.game.findUnique({ where: { slug: 'roblox' } });
  const fivem = await prisma.game.findUnique({ where: { slug: 'fivem' } });
  const theisle = await prisma.game.findUnique({ where: { slug: 'the-isle-evrima' } });

  // Seed sample plugins
  const pluginsData = [
    {
      title: 'Advanced Economy',
      summary: 'A complete economy system with banks, shops, and trading.',
      description: '## Advanced Economy\n\nA full-featured economy plugin for Minecraft servers.\n\n### Features\n- Physical currency items\n- Player-to-player trading\n- Admin-configurable shops\n- Bank system with interest\n- Vault integration\n- PlaceholderAPI support\n\n### Commands\n- `/balance` - Check your balance\n- `/pay <player> <amount>` - Send money\n- `/shop` - Open the shop GUI\n\nHighly configurable with YAML configuration files.',
      version: '1.2.0',
      tags: ['economy', 'shops', 'trading', 'vault', 'minecraft'],
      coverImageUrl: 'https://placehold.co/600x300/4CAF50/FFFFFF?text=Advanced+Economy',
      price: 9.99,
      status: 'APPROVED',
      authorId: admin.id,
      gameId: minecraft.id,
      rating: 4.8,
      ratingCount: 24,
      downloads: 830
    },
    {
      title: 'DuelSystem Pro',
      summary: 'Competitive 1v1 dueling plugin with arenas, kits, and ELO ranking.',
      description: '## DuelSystem Pro\n\nThe ultimate competitive dueling plugin for Minecraft.\n\n### Features\n- Multiple arena support\n- Custom kit system\n- ELO-based ranking\n- Spectator mode\n- Duel requests and queue system\n- Post-match statistics\n- Leaderboard with GUI\n\nPerfect for PvP servers and competitive communities.',
      version: '3.0.1',
      tags: ['pvp', 'duels', 'competitive', 'arenas', 'minecraft'],
      coverImageUrl: 'https://placehold.co/600x300/F44336/FFFFFF?text=DuelSystem+Pro',
      price: 14.99,
      status: 'APPROVED',
      authorId: admin.id,
      gameId: minecraft.id,
      rating: 4.6,
      ratingCount: 15,
      downloads: 520
    },
    {
      title: 'Police RP Pack',
      summary: 'Essential tools for police roleplay servers with MDT, vehicles, and more.',
      description: '## Police RP Pack\n\nEverything you need for a professional police roleplay server.\n\n### Includes\n- Custom police vehicles\n- Mobile Data Terminal (MDT)\n- Speed radar system\n- Handcuff and arrest system\n- Evidence collection\n- Dispatch system\n- Court system integration\n\nFully configurable and optimized for FiveM.',
      version: '2.1.4',
      tags: ['police', 'roleplay', 'vehicles', 'fivem'],
      coverImageUrl: 'https://placehold.co/600x300/FF9800/FFFFFF?text=Police+RP+Pack',
      price: 24.99,
      status: 'APPROVED',
      authorId: admin.id,
      gameId: fivem.id,
      rating: 4.5,
      ratingCount: 18,
      downloads: 310
    },
    {
      title: 'Admin Toolkit',
      summary: 'Comprehensive admin tools for Roblox experiences.',
      description: '## Admin Toolkit\n\nPowerful administration tools for your Roblox game.\n\n### Features\n- Command system with permissions\n- Player management (kick, ban, mute)\n- Anti-cheat detection\n- Server analytics dashboard\n- Moderation logs\n- Custom command creation\n- Role-based permissions\n\nEasy to integrate and customize.',
      version: '1.5.0',
      tags: ['admin', 'moderation', 'tools', 'roblox'],
      coverImageUrl: 'https://placehold.co/600x300/F44336/FFFFFF?text=Admin+Toolkit',
      price: 0,
      status: 'APPROVED',
      authorId: admin.id,
      gameId: roblox.id,
      rating: 4.9,
      ratingCount: 42,
      downloads: 1250
    },
    {
      title: 'Dino Tracker',
      summary: 'Track and manage dinosaur spawns, nests, and migrations.',
      description: '## Dino Tracker\n\nA mod for The Isle: Evrima servers to manage dinosaur populations.\n\n### Features\n- Real-time dinosaur tracking map\n- Nest location monitoring\n- Population statistics\n- Migration pattern analysis\n- Admin spawn controls\n- Growth stage tracking\n\nDesigned for server admins who want detailed control over their ecosystem.',
      version: '1.0.0',
      tags: ['dinosaurs', 'tracking', 'admin', 'the-isle'],
      coverImageUrl: 'https://placehold.co/600x300/2E7D32/FFFFFF?text=Dino+Tracker',
      price: 7.99,
      status: 'APPROVED',
      authorId: admin.id,
      gameId: theisle.id,
      rating: 4.3,
      ratingCount: 6,
      downloads: 85
    },
    {
      title: 'SMP Essentials',
      summary: 'All-in-one essentials plugin for survival multiplayer servers.',
      description: '## SMP Essentials\n\nThe only essentials plugin you need for your SMP server.\n\n### Features\n- Home and warp system\n- TPA (teleport requests)\n- Chat formatting and channels\n- Custom join/leave messages\n- AFK detection\n- Spawn management\n- Kit system\n- Economy basics\n\nLightweight and performance-optimized.',
      version: '4.2.0',
      tags: ['essentials', 'smp', 'teleport', 'chat', 'minecraft'],
      coverImageUrl: 'https://placehold.co/600x300/2196F3/FFFFFF?text=SMP+Essentials',
      price: 0,
      status: 'APPROVED',
      authorId: admin.id,
      gameId: minecraft.id,
      rating: 4.7,
      ratingCount: 56,
      downloads: 2100
    }
  ];

  for (const pluginData of pluginsData) {
    await prisma.plugin.create({
      data: pluginData
    });
  }
  
  // Seed subscription tiers
  const subscriptionsData = [
    {
      name: 'Starter',
      price: 4.99,
      features: ['Upload up to 3 plugins', 'Basic analytics', 'Standard support', 'Community chat access'],
      maxRequests: 1
    },
    {
      name: 'Creator',
      price: 9.99,
      features: ['Upload up to 10 plugins', 'Advanced analytics', 'Priority support', 'Custom plugin requests (2/month)', 'Sale events', 'Coupon codes'],
      maxRequests: 2
    },
    {
      name: 'Professional',
      price: 19.99,
      features: ['Unlimited plugin uploads', 'Full analytics suite', 'Premium support', 'Custom plugin requests (5/month)', 'Featured listings', 'Advertising tools', 'Referral program', 'Custom storefront'],
      maxRequests: 5
    },
    {
      name: 'Enterprise',
      price: 49.99,
      features: ['Everything in Professional', 'Unlimited custom requests', 'Dedicated account manager', 'API access', 'White-label options', 'Priority review queue', 'Bulk licensing'],
      maxRequests: 999
    }
  ];

  for (const subData of subscriptionsData) {
    await prisma.subscription.create({
      data: subData
    });
  }

  console.log('Subscriptions seeded.');
  console.log('Sample plugins seeded.');
  console.log('MinoForge database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
