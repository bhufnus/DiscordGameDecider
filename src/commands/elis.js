const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

async function handleElisCommand(message) {
  const elisEmbed = new EmbedBuilder()
    .setColor(config.SUCCESS_COLOR)
    .setTitle("🐷 Elis")
    .setDescription("Elis is the plumpest pig at the farm")
    .setTimestamp();

  await message.reply({ embeds: [elisEmbed] });
}

module.exports = { handleElisCommand };
