const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

async function handleGamesCommand(message, tournament) {
  const gamesList = tournament.getGamesList();

  const embed = new EmbedBuilder()
    .setColor(config.EMBED_COLOR)
    .setTitle("🎮 Tournament Games")
    .setDescription(gamesList)
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

module.exports = { handleGamesCommand };
