import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TowerControl, Users, GamepadIcon, Search, Sun, Moon } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { GameGrid } from './components/GameGrid';
import { ProfileCard } from './components/ProfileCard';
import { fetchSteamProfile, fetchUserGames, fetchTrendingGames } from './api';
import { SteamProfile, Game } from './types';

type Mode = 'profile' | 'gallery';

function App() {
  const [mode, setMode] = useState<Mode>('profile');
  const [games, setGames] = useState<Game[]>([]);
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);
  const [profile, setProfile] = useState<SteamProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [platform, setPlatform] = useState('all');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (mode === 'gallery') {
      const loadTrendingGames = async () => {
        setIsLoading(true);
        try {
          const games = await fetchTrendingGames();
          const shuffledGames = [...games].sort(() => Math.random() - 0.5);
          setTrendingGames(shuffledGames);
        } catch (err) {
          console.error('Failed to load trending games:', err);
        } finally {
          setIsLoading(false);
        }
      };
      loadTrendingGames();
    }
  }, [mode]);

  const handleSearch = async (steamId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setProfile(null);
      setGames([]);
      
      const profileData = await fetchSteamProfile(steamId);
      setProfile(profileData);
      
      const gamesData = await fetchUserGames(steamId);
      setGames(gamesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const filteredGames = mode === 'gallery' ? trendingGames.filter(game => {
    const matchesSearch = searchQuery.trim() === '' || 
      game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platform === 'all' || true;
    return matchesSearch && matchesPlatform;
  }) : games;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#151515] text-white' : 'bg-gray-100 text-gray-900'}`}>
      <nav className={`${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-200'} border-b`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <TowerControl size={32} className="text-blue-500" />
              <h1 className="text-xl font-bold">Steam Explorer</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => {
                  setMode('profile');
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  mode === 'profile' 
                    ? 'bg-blue-500 text-white' 
                    : theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Users size={20} />
                <span className="hidden sm:inline">Profile Search</span>
              </button>
              <button
                onClick={() => {
                  setMode('gallery');
                  setSearchQuery('');
                  setProfile(null);
                  setGames([]);
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  mode === 'gallery' 
                    ? 'bg-blue-500 text-white' 
                    : theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <GamepadIcon size={20} />
                <span className="hidden sm:inline">Game Gallery</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {mode === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Steam Profile Explorer</h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
                  Enter a Steam ID to view profile details and game library
                </p>
                <SearchBar onSearch={handleSearch} theme={theme} />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-2xl mx-auto mt-4 p-4 bg-red-500/20 text-red-200 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              {profile && <ProfileCard profile={profile} theme={theme} />}
              {games.length > 0 && <GameGrid games={games} isLoading={isLoading} theme={theme} />}
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <h2 className="text-4xl font-bold">New and trending</h2>
                <div className="flex items-center gap-4">
                  <form onSubmit={handleGameSearch} className="relative flex-1 md:flex-none md:min-w-[300px]">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search games..."
                      className={`w-full pl-10 pr-24 py-2 rounded-lg border transition-colors
                        ${theme === 'dark' 
                          ? 'bg-[#202020] border-gray-700 focus:border-blue-500' 
                          : 'bg-white border-gray-300 focus:border-blue-400'} 
                        focus:outline-none`}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-blue-500 text-white rounded-md
                               hover:bg-blue-600 transition-colors duration-300
                               focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    >
                      Search
                    </button>
                  </form>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className={`px-4 py-2 rounded-lg border transition-colors
                      ${theme === 'dark' 
                        ? 'bg-[#202020] border-gray-700 focus:border-blue-500' 
                        : 'bg-white border-gray-300 focus:border-blue-400'}
                      focus:outline-none`}
                  >
                    <option value="all">All Platforms</option>
                    <option value="pc">PC</option>
                    <option value="playstation">PlayStation</option>
                    <option value="xbox">Xbox</option>
                  </select>
                </div>
              </div>

              <GameGrid 
                games={filteredGames} 
                isLoading={isLoading}
                theme={theme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;