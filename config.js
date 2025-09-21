require("dotenv").config();

module.exports = {
  // Discord Bot Configuration
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,

  // Tournament Configuration
  MAX_GAMES: 32, // Maximum number of games that can be entered
  MIN_GAMES: 2, // Minimum number of games needed to start tournament
  POLL_DURATION: 29, // Duration for each poll in seconds (in milliseconds)
  POLL_DURATION_MS: 29000,

  // Bot Configuration
  PREFIX: "!", // Command prefix
  EMBED_COLOR: 0x00ff00, // Green color for embeds
  ERROR_COLOR: 0xff0000, // Red color for error embeds
  SUCCESS_COLOR: 0x00ff00 // Green color for success embeds
};

