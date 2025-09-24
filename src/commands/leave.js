const VoiceManager = require("../utils/voiceManager");

const voiceManager = new VoiceManager();

async function handleLeaveCommand(message) {
  const result = await voiceManager.leaveVoiceChannel(message);
  await message.reply({ embeds: [result.embed] });
}

module.exports = { handleLeaveCommand };
