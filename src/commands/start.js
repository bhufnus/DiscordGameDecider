const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const { startNextRound } = require("../utils/tournamentManager");

async function handleStartCommand(message, tournament) {
  const result = tournament.startTournament();

  if (!result.success) {
    const errorEmbed = new EmbedBuilder()
      .setColor(config.ERROR_COLOR)
      .setTitle("❌ Cannot Start Tournament")
      .setDescription(result.message)
      .setTimestamp();

    await message.reply({ embeds: [errorEmbed] });
    return;
  }

  // Create tournament status embed
  const statusEmbed = new EmbedBuilder()
    .setColor(config.SUCCESS_COLOR)
    .setTitle("🎮 Tournament Started!")
    .setDescription(tournament.getTournamentStatus())
    .setTimestamp();

  const reply = await message.reply({ embeds: [statusEmbed] });

  // Start the first round of polls
  await startNextRound(message.channel, tournament);
}

module.exports = { handleStartCommand };
