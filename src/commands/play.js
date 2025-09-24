const VoiceManager = require("../utils/voiceManager");

const voiceManager = new VoiceManager();

async function handlePlayCommand(message, args) {
  if (args.length === 0) {
    const { EmbedBuilder } = require("discord.js");
    const config = require("../../config");

    const errorEmbed = new EmbedBuilder()
      .setColor(config.ERROR_COLOR)
      .setTitle("❌ Error")
      .setDescription("Please specify a sound to play! Usage: `!boop <sound>`")
      .setTimestamp();

    await message.reply({ embeds: [errorEmbed] });
    return;
  }

  const soundName = args[0].toLowerCase();
  const result = await voiceManager.playSound(message, soundName);
  await message.reply({ embeds: [result.embed] });
}

module.exports = { handlePlayCommand };
