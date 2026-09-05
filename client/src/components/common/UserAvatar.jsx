import React, { useState } from 'react';

/**
 * Robust UserAvatar component that reliably displays Google avatars,
 * Discord avatars, uploaded avatars, or generates a clean fallback.
 * Uses `referrerPolicy="no-referrer"` to prevent Google 403 Forbidden errors.
 */
export default function UserAvatar({ user, className = 'w-full h-full object-cover', fallbackClassName = '' }) {
  const [loadFailed, setLoadFailed] = useState(false);

  const username = user?.username || 'User';
  const cleanName = username.replace(/_/g, ' ').trim();
  const initial = cleanName.charAt(0).toUpperCase() || 'U';

  const rawAvatarUrl = user?.avatarUrl;

  if (rawAvatarUrl && !loadFailed) {
    return (
      <img
        src={rawAvatarUrl}
        alt={cleanName}
        className={className}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setLoadFailed(true)}
      />
    );
  }

  // Robust offline & styled fallback without third-party network dependency
  return (
    <div className={`w-full h-full flex items-center justify-center font-bold text-white bg-gradient-to-tr from-blue-600 to-cyan-500 select-none ${fallbackClassName}`}>
      <span>{initial}</span>
    </div>
  );
}
