import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TowerControl, Clock, Info, X, Image as ImageIcon } from 'lucide-react';
import { Game, GameDetails } from '../types';
import { fetchGameDetails } from '../api';

interface GameGridProps {
  games: Game[];
  isLoading: boolean;
  theme: 'dark' | 'light';
}

export function GameGrid({ games, isLoading, theme }: GameGridProps) {
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const handleGameClick = async (appId: number) => {
    try {
      setIsLoadingDetails(true);
      const details = await fetchGameDetails(appId);
      setSelectedGame(details);
    } catch (error) {
      console.error('Failed to fetch game details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400">
        <TowerControl size={48} className="mb-4" />
        <p>No games found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {selectedScreenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedScreenshot(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setSelectedScreenshot(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedScreenshot}
              alt="Screenshot"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </motion.div>
        )}

        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto"
          >
            <div className="min-h-screen px-4 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`relative w-full max-w-4xl rounded-xl overflow-hidden shadow-xl ${
                  theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
                }`}
              >
                <button
                  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  onClick={() => setSelectedGame(null)}
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="relative h-80">
                  <img
                    src={selectedGame.header_image}
                    alt={selectedGame.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl font-bold text-white">{selectedGame.name}</h2>
                    {selectedGame.metacritic && (
                      <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-300">
                        Metacritic: {selectedGame.metacritic.score}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {selectedGame.short_description}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Developers</h3>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {selectedGame.developers.join(', ')}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Publishers</h3>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {selectedGame.publishers.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGame.genres.map(genre => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 text-sm"
                        >
                          {genre.description}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedGame.screenshots && selectedGame.screenshots.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-4">Screenshots</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedGame.screenshots.map((screenshot) => (
                          <motion.div
                            key={screenshot.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative group cursor-pointer overflow-hidden rounded-lg"
                            onClick={() => setSelectedScreenshot(screenshot.path_full)}
                          >
                            <img
                              src={screenshot.path_thumbnail}
                              alt={`${selectedGame.name} screenshot`}
                              className="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-white" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
        selectedGame ? 'opacity-20 pointer-events-none' : ''
      }`}>
        {games.map((game, index) => (
          <motion.div
            key={game.appid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${
              theme === 'dark' 
                ? 'bg-white/5 backdrop-blur-sm' 
                : 'bg-white shadow-md'
            } rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300`}
            onClick={() => handleGameClick(game.appid)}
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                alt={game.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">{game.name}</h3>
              <div className={`flex items-center gap-4 mt-2 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{Math.round(game.playtime_forever / 60)} hrs</span>
                </div>
                {game.playtime_2weeks && (
                  <div className="flex items-center gap-1">
                    <Info size={14} />
                    <span>
                      {Math.round(game.playtime_2weeks / 60)} hrs (2 weeks)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}