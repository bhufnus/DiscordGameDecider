const { handleAddCommand } = require("./add");
const { handleGamesCommand } = require("./games");
const { handleStartCommand } = require("./start");
const { handleStatusCommand } = require("./status");
const { handleResetCommand } = require("./reset");
const { handleHelpCommand } = require("./help");
const { handleDebugCommand } = require("./debug");

const commands = {
  add: handleAddCommand,
  games: handleGamesCommand,
  list: handleGamesCommand, // Alias for games
  start: handleStartCommand,
  status: handleStatusCommand,
  reset: handleResetCommand,
  help: handleHelpCommand,
  debug: handleDebugCommand
};

module.exports = { commands };
