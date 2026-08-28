const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const FALLBACK_GAMES = [
  { id: 'g-1', name: 'Minecraft', slug: 'minecraft', description: 'Plugins, Spigot/Paper addons, and server tools', imageUrl: '/images/categories/minecraft.png', displayOrder: 1, _count: { plugins: 12 } },
  { id: 'g-2', name: 'FiveM', slug: 'fivem', description: 'QBCore & ESX scripts, MLOs, vehicles, and UI', imageUrl: '/images/categories/fivem.png', displayOrder: 2, _count: { plugins: 8 } },
  { id: 'g-3', name: 'Roblox', slug: 'roblox', description: 'Luau scripts, UI packs, and game frameworks', imageUrl: '/images/categories/roblox.png', displayOrder: 3, _count: { plugins: 5 } },
  { id: 'g-4', name: 'Discord', slug: 'discord', description: 'Custom bot templates, verification bots, and utilities', imageUrl: '/images/categories/discord.png', displayOrder: 4, _count: { plugins: 6 } },
  { id: 'g-5', name: 'Rust', slug: 'rust', description: 'uMod & Oxide plugins, kits, and anti-cheat', imageUrl: '/images/categories/rust.png', displayOrder: 5, _count: { plugins: 4 } },
  { id: 'g-6', name: "Garry's Mod", slug: 'garrys-mod', description: 'DarkRP addons, SWEPs, entities, and HUDs', imageUrl: '/images/categories/garrys_mod.png', displayOrder: 6, _count: { plugins: 3 } },
  { id: 'g-7', name: 'Hytale', slug: 'hytale', description: 'Early access mods, prefabs, and server systems', imageUrl: '/images/categories/hytale.png', displayOrder: 7, _count: { plugins: 2 } },
  { id: 'g-8', name: 'Websites', slug: 'websites', description: 'Server store themes, voting portals, and dashboards', imageUrl: '/images/categories/websites.png', displayOrder: 8, _count: { plugins: 7 } },
];

// @route   GET /api/games
// @desc    List all games ordered by displayOrder
router.get('/', async (req, res, next) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: {
        displayOrder: 'asc'
      },
      include: {
        _count: {
          select: { plugins: { where: { status: 'APPROVED' } } }
        }
      }
    });

    res.json(games.length > 0 ? games : FALLBACK_GAMES);
  } catch (error) {
    console.warn('[Games API] Database unreachable, serving fallback game categories.');
    res.json(FALLBACK_GAMES);
  }
});

// @route   GET /api/games/:slug
// @desc    Get game by slug with plugin count
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    const game = await prisma.game.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { plugins: { where: { status: 'APPROVED' } } }
        }
      }
    });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    const fallback = FALLBACK_GAMES.find(g => g.slug === req.params.slug) || {
      id: 'g-custom',
      name: req.params.slug.charAt(0).toUpperCase() + req.params.slug.slice(1),
      slug: req.params.slug,
      description: 'Explore verified community plugins and server scripts',
      imageUrl: '/images/categories/minecraft.png',
      _count: { plugins: 0 }
    };
    res.json(fallback);
  }
});

// @route   GET /api/games/:slug/plugins
// @desc    Get approved plugins for a game with pagination, search, sort
router.get('/:slug/plugins', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 10, search, sort } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // First find the game to make sure it exists and get its ID
    const game = await prisma.game.findUnique({
      where: { slug }
    });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Build the query where clause
    const where = {
      gameId: game.id,
      status: 'APPROVED',
      ...(search && {
        OR: [
          { title: { contains: String(search), mode: 'insensitive' } },
          { summary: { contains: String(search), mode: 'insensitive' } },
        ]
      })
    };

    // Build the order by clause
    let orderBy = { createdAt: 'desc' }; // default: newest
    if (sort === 'popular') {
      orderBy = { downloads: 'desc' };
    } else if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'rating') {
      orderBy = { rating: 'desc' };
    }

    const [plugins, total] = await Promise.all([
      prisma.plugin.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          }
        }
      }),
      prisma.plugin.count({ where })
    ]);

    res.json({
      data: plugins,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.json({
      data: [],
      meta: {
        total: 0,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 10),
        totalPages: 0
      }
    });
  }
});

module.exports = router;
