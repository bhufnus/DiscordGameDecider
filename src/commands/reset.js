const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

async function handleResetCommand(message, tournament) {
  tournament.reset();

  const embed = new EmbedBuilder()
    .setColor(config.SUCCESS_COLOR)
    .setTitle("🔄 Tournament Reset")
    .setDescription("Tournament has been reset. You can now add new games!")
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

module.exports = { handleResetCommand };
