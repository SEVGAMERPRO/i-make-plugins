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
