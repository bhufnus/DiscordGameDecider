const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

async function handleAddCommand(message, args, tournament) {
  if (args.length === 0) {
    const errorEmbed = new EmbedBuilder()
      .setColor(config.ERROR_COLOR)
      .setTitle("❌ Invalid Usage")
      .setDescription("Please specify a game name!\nUsage: `!add <game name>`")
      .setTimestamp();

    await message.reply({ embeds: [errorEmbed] });
    return;
  }

  const gameName = args.join(" ");
  const result = tournament.addGame(gameName);

  const embed = new EmbedBuilder()
    .setColor(result.success ? config.SUCCESS_COLOR : config.ERROR_COLOR)
    .setTitle(result.success ? "✅ Game Added" : "❌ Error")
    .setDescription(result.message)
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

module.exports = { handleAddCommand };
