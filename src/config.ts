import dotenv from "dotenv";
dotenv.config();

export const config = {
  token: process.env.DISCORD_BOT_TOKEN || "",
  clientId: process.env.DISCORD_CLIENT_ID || "",
  ownerId: process.env.OWNER_ID || "",
  logChannelName: process.env.LOG_CHANNEL_NAME || "mod-logs",
  modsRoleName: process.env.MODS_ROLE_NAME || "Moderator",
  maxWarnings: parseInt(process.env.MAX_WARNINGS || "3"),
  spamThreshold: parseInt(process.env.SPAM_THRESHOLD || "5"),
  spamInterval: parseInt(process.env.SPAM_INTERVAL || "5000"),
};

if (!config.token) {
  console.error("❌ DISCORD_BOT_TOKEN tidak ditemukan di environment variables!");
  process.exit(1);
}
