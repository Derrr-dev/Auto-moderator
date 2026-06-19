import { EmbedBuilder, ColorResolvable } from "discord.js";

export function buildEmbed(
  title: string,
  description: string,
  color: ColorResolvable = "#FF0000"
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();
}

export function buildModEmbed(options: {
  action: string;
  target: string;
  moderator: string;
  reason: string;
  duration?: string;
  color?: ColorResolvable;
}): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(`🔨 ${options.action}`)
    .setColor(options.color ?? "#FF4444")
    .setTimestamp()
    .addFields(
      { name: "👤 Target", value: options.target, inline: true },
      { name: "🛡️ Moderator", value: options.moderator, inline: true },
      { name: "📋 Alasan", value: options.reason }
    );

  if (options.duration) {
    embed.addFields({ name: "⏱️ Durasi", value: options.duration, inline: true });
  }

  return embed;
}

export function buildAutomodEmbed(options: {
  action: string;
  target: string;
  reason: string;
  details?: string;
  color?: ColorResolvable;
}): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(`🤖 AutoMod — ${options.action}`)
    .setColor(options.color ?? "#FF6600")
    .setTimestamp()
    .addFields(
      { name: "👤 User", value: options.target, inline: true },
      { name: "📋 Alasan", value: options.reason }
    );

  if (options.details) {
    embed.addFields({ name: "📝 Detail", value: options.details });
  }

  return embed;
}
