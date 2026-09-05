import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PluginCard from '../components/ui/PluginCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import UserAvatar from '../components/common/UserAvatar';

const UserProfilePage = () => {
  const rawUsername = useParams().username;
  const username = decodeURIComponent(rawUsername || '');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        username,
        joinDate: 'January 2024',
        bio: 'Professional plugin developer specializing in high-performance Java and Lua scripts.',
        totalDownloads: 12450,
        avatarUrl: ''
      });
      
      setPlugins(Array.from({ length: 4 }).map((_, i) => ({
        id: `u-p${i}`,
        title: `${username}'s Project ${i + 1}`,
        authorName: username,
        gameName: i % 2 === 0 ? 'Minecraft' : 'Roblox',
        price: '4.99',
        rating: '4.9',
        downloads: Math.floor(Math.random() * 3000),
        imageUrl: ''
      })));
      
      setLoading(false);
    }, 600);
  }, [username]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <div className="text-center py-20 text-xl text-gray-600">User not found</div>;

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="w-24 h-24 bg-[#BBDEFB] text-[#1976D2] rounded-full flex items-center justify-center font-bold text-4xl shadow-sm overflow-hidden flex-shrink-0">
            <UserAvatar user={user} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">{user.username ? user.username.replace(/_/g, ' ') : 'Member'}</h1>
            <p className="text-gray-600 mb-4 max-w-2xl">{user.bio}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500 uppercase tracking-wider text-xs font-semibold">Joined</span>
                <span className="font-medium text-gray-900">{user.joinDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 uppercase tracking-wider text-xs font-semibold">Total Downloads</span>
                <span className="font-medium text-gray-900">{user.totalDownloads.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 uppercase tracking-wider text-xs font-semibold">Plugins Published</span>
                <span className="font-medium text-gray-900">{plugins.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User's Plugins */}
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">Plugins by {user.username}</h2>
          
          {plugins.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {plugins.map(plugin => (
                <PluginCard key={plugin.id} plugin={plugin} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-500">This user hasn't published any plugins yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfilePage;
