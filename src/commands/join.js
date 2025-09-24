const VoiceManager = require("../utils/voiceManager");

const voiceManager = new VoiceManager();

async function handleJoinCommand(message) {
  const result = await voiceManager.joinVoiceChannel(message);
  await message.reply({ embeds: [result.embed] });
}

module.exports = { handleJoinCommand };
