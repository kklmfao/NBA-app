const express = require('express');
const router = express.Router();
const nbaApi = require('../../../utils/nba-api');
const { authMiddleware } = require('../../../utils/middleware');

// Search players
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const players = await nbaApi.searchPlayers(query);
    res.json(players);
  } catch (error) {
    console.error('Error in player search:', error);
    res.status(500).json({ error: 'Failed to search players' });
  }
});

// Get player details
router.get('/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const playerStats = await nbaApi.getPlayerStats(playerId);
    res.json(playerStats);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
});

module.exports = router;