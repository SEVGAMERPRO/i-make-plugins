/**
 * Name Formatter Utility
 * Generates clean, human-readable display names and usernames WITHOUT automatic underscores.
 */

function formatCleanName(rawName, rawEmail) {
  const cleanEmail = (rawEmail || '').trim().toLowerCase();

  // Special reserved handle for creator / owner
  if (cleanEmail === 'severinkaptein8@gmail.com' || cleanEmail.startsWith('severinkaptein')) {
    return 'SevGamerPro';
  }

  let candidate = (rawName || '').trim();

  // If no name provided, derive cleanly from email prefix
  if (!candidate && cleanEmail) {
    candidate = cleanEmail.split('@')[0];
  }

  if (!candidate) {
    return 'Player' + Math.floor(1000 + Math.random() * 9000);
  }

  // Replace underscores, dots, hyphens, pluses with clean spaces
  const words = candidate
    .replace(/[._\-+]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length > 0) {
    // Capitalize each word properly: e.g. "john doe" -> "John Doe"
    candidate = words
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  // Remove any remaining unwanted characters, leaving letters, numbers, and clean single spaces
  candidate = candidate.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

  if (candidate.length < 2) {
    return 'Player' + Math.floor(1000 + Math.random() * 9000);
  }

  return candidate.slice(0, 24);
}

/**
 * Ensures unique name without adding ugly underscores like _1 or _2.
 * Uses clean numbers instead: "John Doe 2", "John Doe 3"
 */
async function generateUniqueUsername(baseName, existsFn) {
  let finalName = baseName;
  let counter = 2;
  while (await existsFn(finalName)) {
    finalName = `${baseName.slice(0, 20)} ${counter++}`;
  }
  return finalName;
}

module.exports = {
  formatCleanName,
  generateUniqueUsername
};
