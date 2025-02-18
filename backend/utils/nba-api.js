const axios = require('axios');
const cache = require('./cache');

// Mock data for testing
const mockPlayers = [
  {
    id: 1,
    name: "Stephen Curry",
    position: "G",
    team: {
      id: 1,
      name: "Golden State Warriors",
      abbreviation: "GSW"
    }
  },
  {
    id: 2,
    name: "Seth Curry",
    position: "G",
    team: {
      id: 2,
      name: "Brooklyn Nets",
      abbreviation: "BKN"
    }
  }
];

const nbaApi = {
  async getPlayerStats(playerId) {
    const cacheKey = `player_stats_${playerId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) return cachedData;

    // Mock stats for testing
    const mockStats = {
      player_id: playerId,
      season: 2023,
      games_played: 82,
      points_per_game: 29.4,
      assists_per_game: 6.3,
      rebounds_per_game: 5.2
    };

    cache.set(cacheKey, mockStats, 3600);
    return mockStats;
  },

  async searchPlayers(query) {
    const cacheKey = `player_search_${query}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) return cachedData;

    // Filter mock data based on search query
    const players = mockPlayers.filter(player =>
      player.name.toLowerCase().includes(query.toLowerCase())
    );

    cache.set(cacheKey, players, 3600);
    return players;
  }
};

module.exports = nbaApi;