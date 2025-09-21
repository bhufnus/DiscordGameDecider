const { Events, EmbedBuilder } = require("discord.js");
const config = require("../../config");
const { commands } = require("../commands");

module.exports = {
  name: Events.MessageCreate,
  async execute(message, tournament) {
    // Ignore bot messages
    if (message.author.bot) return;

    // Check if message starts with prefix
    if (!message.content.startsWith(config.PREFIX)) return;

    const args = message.content.slice(config.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
      switch (command) {
        case "add":
          await commands.add(message, args, tournament);
          break;
        case "games":
        case "list":
          await commands.games(message, tournament);
          break;
        case "start":
          await commands.start(message, tournament);
          break;
        case "status":
          await commands.status(message, tournament);
          break;
        case "reset":
          await commands.reset(message, tournament);
          break;
        case "help":
          await commands.help(message);
          break;
        case "debug":
          await commands.debug(message, tournament);
          break;
        default:
          // Ignore unknown commands
          break;
      }
    } catch (error) {
      console.error("Error handling command:", error);
      const errorEmbed = new EmbedBuilder()
        .setColor(config.ERROR_COLOR)
        .setTitle("❌ Error")
        .setDescription("An error occurred while processing your command.")
        .setTimestamp();

      await message.reply({ embeds: [errorEmbed] });
    }
  }
};
