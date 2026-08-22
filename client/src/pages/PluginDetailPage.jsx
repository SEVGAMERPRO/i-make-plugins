import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Download, Clock, Tag, ShieldCheck, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const PluginDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [plugin, setPlugin] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPlugin({
        id,
        title: 'EssentialsX Pro Suite',
        authorName: 'DevTeam',
        gameName: 'Minecraft',
        price: '14.99',
        rating: '4.9',
        reviewsCount: 128,
        downloads: 5430,
        version: '2.4.1',
        lastUpdated: '2 days ago',
        category: 'Administration',
        imageUrl: '',
        description: `
          <h2>The Ultimate Administration Plugin</h2>
          <p>EssentialsX Pro brings your server administration to the next level with over 100+ commands, advanced configuration, and premium support.</p>
          <br/>
          <h3>Features</h3>
          <ul>
            <li>Advanced permission management</li>
            <li>Customizable economy system</li>
            <li>Cross-server teleportation</li>
            <li>In-game configuration GUI</li>
            <li>Anti-spam and moderation tools</li>
          </ul>
          <br/>
          <h3>Installation</h3>
          <p>Simply drag and drop the .jar file into your plugins folder and restart your server. The default configuration will be generated automatically.</p>
        `
      });
      setLoading(false);
    }, 600);
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!plugin) return <div className="text-center py-20 text-xl text-gray-600">Plugin not found</div>;

  const isFree = plugin.price === '0.00' || plugin.price === 0;

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#2196F3]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/plugins" className="hover:text-[#2196F3]">Plugins</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">{plugin.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="aspect-[21/9] w-full bg-gradient-to-r from-blue-100 to-indigo-100 relative">
                {plugin.imageUrl ? (
                  <img src={plugin.imageUrl} alt={plugin.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium text-xl">
                    Plugin Banner
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg font-bold text-[#1A1A2E] shadow-sm">
                  {plugin.gameName}
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">{plugin.title}</h1>
                    <p className="text-gray-600 text-lg">
                      By <Link to={`/users/${plugin.authorName}`} className="font-semibold text-[#2196F3] hover:underline">{plugin.authorName}</Link>
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <span className="text-3xl font-extrabold text-[#FF9800]">
                      {isFree ? 'Free' : `$${plugin.price}`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 border-t border-gray-100 pt-6 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-[#FF9800] text-[#FF9800]" />
                    <span className="font-bold text-[#1A1A2E]">{plugin.rating}</span>
                    <span>({plugin.reviewsCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Download className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold text-[#1A1A2E]">{plugin.downloads.toLocaleString()}</span> downloads
                  </div>
                  <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-medium">Verified Safe</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-6">Overview</h2>
              <div 
                className="prose max-w-none prose-blue"
                dangerouslySetInnerHTML={{ __html: plugin.description }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            {/* Action Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 sticky top-24">
              <button className="w-full flex items-center justify-center gap-2 bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold py-4 px-6 rounded-lg shadow-sm transition-colors mb-4 text-lg">
                <Download className="w-5 h-5" />
                {isFree ? 'Download Now' : 'Purchase Plugin'}
              </button>
              
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Last Updated</span>
                  <span className="font-medium text-gray-900">{plugin.lastUpdated}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Tag className="w-4 h-4" /> Version</span>
                  <span className="font-medium text-gray-900">{plugin.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <Link to={`/plugins?category=${plugin.category}`} className="font-medium text-[#2196F3] hover:underline">{plugin.category}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PluginDetailPage;
