import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (steamId: string) => void;
  theme: 'dark' | 'light';
}

export function SearchBar({ onSearch, theme }: SearchBarProps) {
  const [steamId, setSteamId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (steamId.trim()) {
      onSearch(steamId.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={steamId}
          onChange={(e) => setSteamId(e.target.value)}
          placeholder="Enter Steam ID or Profile Number"
          className={`w-full px-6 pl-12 py-4 text-lg rounded-xl border shadow-lg
            transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-[#202020] text-white placeholder-gray-400 border-gray-800 focus:ring-2 focus:ring-blue-500'
                : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:ring-2 focus:ring-blue-400'
            } focus:outline-none`}
        />
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`} size={20} />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 transition-colors duration-300
                   focus:ring-2 focus:ring-blue-300 focus:outline-none"
        >
          Search
        </button>
      </div>
    </form>
  );
}