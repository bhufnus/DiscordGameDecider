const { Client, GatewayIntentBits, Collection, Events } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const Tournament = require("./src/models/Tournament");

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// Create tournament instance
const tournament = new Tournament();

// Load events
const eventsPath = path.join(__dirname, "src", "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => {
      if (event.name === Events.MessageCreate) {
        event.execute(...args, tournament);
      } else {
        event.execute(...args);
      }
    });
  } else {
    client.on(event.name, (...args) => {
      if (event.name === Events.MessageCreate) {
        event.execute(...args, tournament);
      } else {
        event.execute(...args);
      }
    });
  }
}

// Global error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit the process, just log the error
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Log the error but don't exit to keep the bot running
});

// Client error handlers
client.on("error", (error) => {
  console.error("Discord client error:", error);
});

client.on("warn", (info) => {
  console.warn("Discord client warning:", info);
});

// Login to Discord
client.login(config.DISCORD_BOT_TOKEN).catch((error) => {
  console.error("Failed to login to Discord:", error);
  process.exit(1);
});
