import React from 'react';
import { motion } from 'framer-motion';
import { Screenshot } from '../types';
import { ImageOff, Eye, Heart, GamepadIcon } from 'lucide-react';

interface ScreenshotGridProps {
  screenshots: Screenshot[];
  isLoading: boolean;
}

export function ScreenshotGrid({ screenshots, isLoading }: ScreenshotGridProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (screenshots.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400">
        <ImageOff size={48} className="mb-4" />
        <p>No screenshots found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {screenshots.map((screenshot, index) => (
        <motion.div
          key={screenshot.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group overflow-hidden rounded-xl shadow-lg bg-white/5 backdrop-blur-sm"
        >
          <a 
            href={screenshot.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block aspect-video w-full overflow-hidden"
          >
            <img
              src={screenshot.previewUrl}
              alt={screenshot.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-sm font-semibold truncate">{screenshot.title}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-300">
              <GamepadIcon size={14} />
              <span className="truncate">{screenshot.gameName}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{screenshot.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{screenshot.favorited.toLocaleString()}</span>
              </div>
              <span>{new Date(screenshot.created).toLocaleDateString()}</span>
            </div>
            {screenshot.description && (
              <p className="mt-2 text-xs text-gray-300 line-clamp-2">{screenshot.description}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}