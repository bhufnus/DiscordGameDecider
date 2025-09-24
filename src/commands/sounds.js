const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const VoiceManager = require("../utils/voiceManager");

const voiceManager = new VoiceManager();

async function handleSoundsCommand(message) {
  const availableSounds = voiceManager.getAvailableSounds();

  if (availableSounds.length === 0) {
    const errorEmbed = new EmbedBuilder()
      .setColor(config.ERROR_COLOR)
      .setTitle("❌ No Sounds Found")
      .setDescription("No sound files found in the sounds directory!")
      .setTimestamp();

    await message.reply({ embeds: [errorEmbed] });
    return;
  }

  const soundsList = availableSounds
    .map((sound) => `• **${sound}**`)
    .join("\n");

  const soundsEmbed = new EmbedBuilder()
    .setColor(config.EMBED_COLOR)
    .setTitle("🎵 Available Sounds")
    .setDescription(soundsList)
    .addFields({
      name: "How to use:",
      value:
        "`!boop <sound name>` - Play a sound\n`!enter` - Join your voice channel\n`!leave` - Leave voice channel"
    })
    .setTimestamp();

  await message.reply({ embeds: [soundsEmbed] });
}

module.exports = { handleSoundsCommand };
