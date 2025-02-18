const axios = require('axios');
const cache = require('./cache');

const NBA_API_BASE_URL = 'https://stats.nba.com/stats';

// Common headers required for NBA API
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Origin': 'https://www.nba.com',
  'Referer': 'https://www.nba.com/'
};

const nbaApi = {
  async getPlayerStats(playerId) {
    const cacheKey = `player_stats_${playerId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) return cachedData;

    try {
      const response = await axios.get(`${NBA_API_BASE_URL}/playerprofilev2`, {
        headers,
        params: {
          PlayerID: playerId,
          PerMode: 'PerGame'
        }
      });

      cache.set(cacheKey, response.data, 3600); // Cache for 1 hour
      return response.data;
    } catch (error) {
      console.error('Error fetching player stats:', error);
      throw error;
    }
  },

  async searchPlayers(query) {
    const cacheKey = `player_search_${query}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) return cachedData;

    try {
      const response = await axios.get(`${NBA_API_BASE_URL}/playerindex`, {
        headers,
        params: {
          Season: '2023-24'
        }
      });

      const players = response.data.resultSets[0].rowSet
        .filter(player => 
          player[1].toLowerCase().includes(query.toLowerCase()) ||
          player[2].toLowerCase().includes(query.toLowerCase())
        );

      cache.set(cacheKey, players, 3600); // Cache for 1 hour
      return players;
    } catch (error) {
      console.error('Error searching players:', error);
      throw error;
    }
  },

  // Add more NBA API methods as needed
};

module.exports = nbaApi;