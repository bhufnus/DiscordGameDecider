const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(
      `🎮 Game Decider Bot is ready! Logged in as ${client.user.tag}`
    );
  }
};
