import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Clock } from 'lucide-react';
import { SteamProfile } from '../types';

interface ProfileCardProps {
  profile: SteamProfile;
  theme: 'dark' | 'light';
}

const getPersonaState = (state: number): string => {
  const states: Record<number, string> = {
    0: 'Offline',
    1: 'Online',
    2: 'Busy',
    3: 'Away',
    4: 'Snooze',
    5: 'Looking to Trade',
    6: 'Looking to Play',
  };
  return states[state] || 'Unknown';
};

export function ProfileCard({ profile, theme }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 rounded-xl overflow-hidden ${
        theme === 'dark'
          ? 'bg-white/5 backdrop-blur-sm'
          : 'bg-white shadow-lg'
      }`}
    >
      <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="absolute -bottom-12 left-8">
          <img
            src={profile.avatarfull}
            alt={profile.personaname}
            className="w-24 h-24 rounded-xl ring-4 ring-gray-900"
          />
        </div>
      </div>
      
      <div className="pt-16 pb-8 px-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{profile.personaname}</h2>
            {profile.realname && (
              <p className={`flex items-center gap-2 mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <User size={16} />
                {profile.realname}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-sm ${
              profile.personastate === 1 
                ? 'bg-green-500/20 text-green-500' 
                : theme === 'dark'
                  ? 'bg-gray-500/20 text-gray-300'
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {getPersonaState(profile.personastate)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {(profile.loccountrycode || profile.locstatecode) && (
            <div className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <MapPin size={16} />
              <span>
                {[profile.locstatecode, profile.loccountrycode].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
          {profile.timecreated && (
            <div className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Clock size={16} />
              <span>
                Member since {new Date(profile.timecreated * 1000).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {profile.gameextrainfo && (
          <div className={`mt-6 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
          }`}>
            <p className={theme === 'dark' ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>
              Currently playing
            </p>
            <p className="text-lg font-semibold">{profile.gameextrainfo}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}