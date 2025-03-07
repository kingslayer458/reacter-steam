import axios from 'axios';
import { SteamProfile, Game, GameDetails } from './types';

const STEAM_API_KEY = '01FC627C53BA269E7EA062CF2638ACCA';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Cache for game details to prevent redundant API calls
const gameDetailsCache = new Map<number, GameDetails>();

// Popular games list as fallback
const POPULAR_GAMES = [
  { appid: 1091500, name: 'Cyberpunk 2077', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 1174180, name: 'Red Dead Redemption 2', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 1551360, name: 'Forza Horizon 5', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 1245620, name: 'Elden Ring', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  
  { appid: 271590, name: 'Grand Theft Auto V', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 990080, name: 'Hogwarts Legacy', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 1817190, name: "Marvel's Spider-Man: Miles Morales", playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 1593500, name: 'God of War', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 1888930, name: 'The Last of Us Part I', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 2138710, name: "Marvel's Spider-Man 2", playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 1938090, name: 'Call of Duty: Modern Warfare III', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 2050650, name: 'Resident Evil 4', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  
  { appid: 1538590, name: 'Alan Wake 2', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 870780, name: 'Control Ultimate Edition', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 268500, name: 'Quantum Break', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 108710, name: 'Alan Wake', playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },

  
  { appid: 220240, name: "Assassin's Creed IV Black Flag", playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 582160, name: "Assassin's Creed Origins", playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 812140, name: "Assassin's Creed Odyssey", playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 2208920, name: "Assassin's Creed Mirage", playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true },
  { appid: 359550, name: "Tom Clancy's Rainbow Six Siege", playtime_forever: 0, img_icon_url: '', has_community_visible_stats: true }
];

export async function fetchSteamProfile(steamId: string): Promise<SteamProfile> {
  if (!steamId) {
    throw new Error('Please enter a valid Steam ID');
  }

  try {
    const steamApiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamId}`;
    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(steamApiUrl)}`);
    
    if (!response.data?.response?.players?.[0]) {
      throw new Error('Steam profile not found. Please check your Steam ID and try again.');
    }
    
    return response.data.response.players[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('Access to Steam API is currently restricted. Please try again later.');
      }
      if (error.response?.status === 404) {
        throw new Error('Steam profile not found. Please check your Steam ID and try again.');
      }
      throw new Error('Failed to connect to Steam. Please try again later.');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
}

export async function fetchUserGames(steamId: string): Promise<Game[]> {
  if (!steamId) {
    throw new Error('Please enter a valid Steam ID');
  }

  try {
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;
    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(url)}`);

    if (!response.data?.response?.games) {
      throw new Error('No games found or game library is private.');
    }

    return response.data.response.games;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('Failed to fetch games. Make sure your game details are public.');
    }
    throw new Error('An unexpected error occurred while fetching games.');
  }
}

export async function fetchGameDetails(appId: number): Promise<GameDetails> {
  if (!appId) {
    throw new Error('Please provide a valid game ID');
  }

  // Check cache first
  if (gameDetailsCache.has(appId)) {
    return gameDetailsCache.get(appId)!;
  }

  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(url)}`);

    if (!response.data?.[appId]?.success) {
      throw new Error('Game details not found.');
    }

    const gameDetails = response.data[appId].data;
    // Cache the result
    gameDetailsCache.set(appId, gameDetails);

    return gameDetails;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('Failed to fetch game details. Please try again later.');
    }
    throw new Error('An unexpected error occurred while fetching game details.');
  }
}

export async function fetchTrendingGames(): Promise<Game[]> {
  try {
    // Try to fetch most played games from Steam
    const url = 'https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/';
    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(url)}`);
    
    if (response.data?.response?.ranks) {
      const games = await Promise.all(
        response.data.response.ranks.slice(0, 12).map(async (game: any) => {
          try {
            const details = await fetchGameDetails(game.appid);
            return {
              appid: game.appid,
              name: details.name,
              playtime_forever: game.concurrent_in_game || 0,
              img_icon_url: '',
              has_community_visible_stats: true
            };
          } catch (error) {
            return null;
          }
        })
      );
      
      const validGames = games.filter((game): game is Game => game !== null);
      // Combine API results with popular games and remove duplicates
      const combinedGames = [...validGames, ...POPULAR_GAMES];
      const uniqueGames = Array.from(new Map(combinedGames.map(game => [game.appid, game])).values());
      return uniqueGames;
    }
  } catch (error) {
    console.error('Failed to fetch trending games from Steam API:', error);
  }

  // Return fallback popular games list if API fails
  return POPULAR_GAMES;
}