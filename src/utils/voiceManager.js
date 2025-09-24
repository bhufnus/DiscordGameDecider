const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  getVoiceConnection
} = require("@discordjs/voice");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../../config");

// Set FFmpeg path for audio processing
const ffmpeg = require("ffmpeg-static");
process.env.FFMPEG_PATH = ffmpeg;

class VoiceManager {
  constructor() {
    this.connections = new Map(); // Store voice connections per guild
    this.players = new Map(); // Store audio players per guild
  }

  async joinVoiceChannel(message) {
    const member = message.member;
    if (!member || !member.voice.channel) {
      const errorEmbed = new EmbedBuilder()
        .setColor(config.ERROR_COLOR)
        .setTitle("❌ Error")
        .setDescription(
          "You need to be in a voice channel to use this command!"
        )
        .setTimestamp();
      return { success: false, embed: errorEmbed };
    }

    const voiceChannel = member.voice.channel;
    const guildId = message.guild.id;

    try {
      // Check if already connected to this voice channel
      const existingConnection = getVoiceConnection(guildId);
      if (
        existingConnection &&
        existingConnection.joinConfig.channelId === voiceChannel.id
      ) {
        // Make sure we have a player for this connection
        if (!this.players.has(guildId)) {
          const player = createAudioPlayer();
          this.players.set(guildId, player);
          existingConnection.subscribe(player);
        }

        const successEmbed = new EmbedBuilder()
          .setColor(config.SUCCESS_COLOR)
          .setTitle("🎵 Already Connected")
          .setDescription(`Already connected to ${voiceChannel.name}`)
          .setTimestamp();
        return { success: true, embed: successEmbed };
      }

      // Create voice connection
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guildId,
        adapterCreator: message.guild.voiceAdapterCreator
      });

      // Create audio player
      const player = createAudioPlayer();
      this.players.set(guildId, player);

      // Handle connection events
      connection.on(VoiceConnectionStatus.Ready, () => {
        console.log(`Connected to voice channel: ${voiceChannel.name}`);
      });

      connection.on(VoiceConnectionStatus.Disconnected, () => {
        console.log(`Disconnected from voice channel: ${voiceChannel.name}`);
        this.connections.delete(guildId);
        this.players.delete(guildId);
      });

      connection.subscribe(player);
      this.connections.set(guildId, connection);

      const successEmbed = new EmbedBuilder()
        .setColor(config.SUCCESS_COLOR)
        .setTitle("🎵 Connected")
        .setDescription(`Joined voice channel: ${voiceChannel.name}`)
        .setTimestamp();

      return { success: true, embed: successEmbed };
    } catch (error) {
      console.error("Error joining voice channel:", error);
      const errorEmbed = new EmbedBuilder()
        .setColor(config.ERROR_COLOR)
        .setTitle("❌ Error")
        .setDescription(
          "Failed to join voice channel. Make sure I have the necessary permissions!"
        )
        .setTimestamp();
      return { success: false, embed: errorEmbed };
    }
  }

  async leaveVoiceChannel(message) {
    const guildId = message.guild.id;
    const connection = getVoiceConnection(guildId);

    if (!connection) {
      const errorEmbed = new EmbedBuilder()
        .setColor(config.ERROR_COLOR)
        .setTitle("❌ Error")
        .setDescription("I'm not connected to any voice channel!")
        .setTimestamp();
      return { success: false, embed: errorEmbed };
    }

    try {
      connection.destroy();
      this.connections.delete(guildId);
      this.players.delete(guildId);

      const successEmbed = new EmbedBuilder()
        .setColor(config.SUCCESS_COLOR)
        .setTitle("🎵 Disconnected")
        .setDescription("Left the voice channel")
        .setTimestamp();

      return { success: true, embed: successEmbed };
    } catch (error) {
      console.error("Error leaving voice channel:", error);
      const errorEmbed = new EmbedBuilder()
        .setColor(config.ERROR_COLOR)
        .setTitle("❌ Error")
        .setDescription("Failed to leave voice channel!")
        .setTimestamp();
      return { success: false, embed: errorEmbed };
    }
  }

  async playSound(message, soundName) {
    const guildId = message.guild.id;
    const connection = getVoiceConnection(guildId);

    if (!connection) {
      const errorEmbed = new EmbedBuilder()
        .setColor(config.ERROR_COLOR)
        .setTitle("❌ Error")
        .setDescription(
          "I'm not connected to a voice channel! Use `!enter` first."
        )
        .setTimestamp();
      return { success: false, embed: errorEmbed };
    }

    const soundsPath = path.join(__dirname, "..", "sounds");

    // Try different audio formats
    const extensions = [".ogg", ".mp3", ".wav", ".webm"];
    let soundFile = null;

    for (const ext of extensions) {
      const testFile = path.join(soundsPath, `${soundName}${ext}`);
      if (fs.existsSync(testFile)) {
        soundFile = testFile;
        break;
      }
    }

    if (!soundFile) {
      const errorEmbed = new EmbedBuilder()
        .setColor(config.ERROR_COLOR)
        .setTitle("❌ Error")
        .setDescription(
          `Sound "${soundName}" not found! Use \`!sounds\` to see available sounds.`
        )
        .setTimestamp();
      return { success: false, embed: errorEmbed };
    }

    try {
      let player = this.players.get(guildId);
      if (!player) {
        // Create a new player if one doesn't exist
        player = createAudioPlayer();
        this.players.set(guildId, player);
        connection.subscribe(player);
      }

      const resource = createAudioResource(soundFile);
      player.play(resource);

      const successEmbed = new EmbedBuilder()
        .setColor(config.SUCCESS_COLOR)
        .setTitle("🎵 Playing")
        .setDescription(`Now playing: **${soundName}**`)
        .setTimestamp();

      return { success: true, embed: successEmbed };
    } catch (error) {
      console.error("Error playing sound:", error);
      const errorEmbed = new EmbedBuilder()
        .setColor(config.ERROR_COLOR)
        .setTitle("❌ Error")
        .setDescription("Failed to play sound!")
        .setTimestamp();
      return { success: false, embed: errorEmbed };
    }
  }

  getAvailableSounds() {
    const soundsPath = path.join(__dirname, "..", "sounds");

    if (!fs.existsSync(soundsPath)) {
      return [];
    }

    const files = fs.readdirSync(soundsPath);
    return files
      .filter(
        (file) =>
          file.endsWith(".ogg") ||
          file.endsWith(".mp3") ||
          file.endsWith(".wav") ||
          file.endsWith(".webm")
      )
      .map((file) => path.parse(file).name);
  }
}

module.exports = VoiceManager;
