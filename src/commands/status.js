const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

async function handleStatusCommand(message, tournament) {
  const status = tournament.getTournamentStatus();

  const embed = new EmbedBuilder()
    .setColor(config.EMBED_COLOR)
    .setTitle("🎮 Tournament Status")
    .setDescription(status)
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

module.exports = { handleStatusCommand };
