const { handleAddCommand } = require("./add");
const { handleGamesCommand } = require("./games");
const { handleStartCommand } = require("./start");
const { handleStatusCommand } = require("./status");
const { handleResetCommand } = require("./reset");
const { handleHelpCommand } = require("./help");
const { handleDebugCommand } = require("./debug");
const { handleElisCommand } = require("./elis");
const { handleJoinCommand } = require("./join");
const { handleLeaveCommand } = require("./leave");
const { handlePlayCommand } = require("./play");
const { handleSoundsCommand } = require("./sounds");

const commands = {
  add: handleAddCommand,
  games: handleGamesCommand,
  list: handleGamesCommand, // Alias for games
  start: handleStartCommand,
  status: handleStatusCommand,
  reset: handleResetCommand,
  help: handleHelpCommand,
  debug: handleDebugCommand,
  elis: handleElisCommand,
  enter: handleJoinCommand,
  leave: handleLeaveCommand,
  boop: handlePlayCommand,
  sounds: handleSoundsCommand
};

module.exports = { commands };
