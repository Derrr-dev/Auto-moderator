import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  GuildMember,
} from "discord.js";
import { isProtected, isModerator } from "../../utils/permissions";
import { buildModEmbed } from "../../utils/embed";
import { sendLog } from "../../handlers/logs";

const DURATIONS: Record<string, number> = {
  "60s": 60 * 1000,
  "5m": 5 * 60 * 1000,
  "10m": 10 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "1w": 7 * 24 * 60 * 60 * 1000,
};

export const data = new SlashCommandBuilder()
  .setName("timeout")
  .setDescription("Beri timeout (mute sementara) kepada member")
  .addUserOption((o) =>
    o.setName("target").setDescription("User yang akan di-timeout").setRequired(true)
  )
  .addStringOption((o) =>
    o
      .setName("durasi")
      .setDescription("Durasi timeout")
      .setRequired(true)
      .addChoices(
        { name: "60 Detik", value: "60s" },
        { name: "5 Menit", value: "5m" },
        { name: "10 Menit", value: "10m" },
        { name: "30 Menit", value: "30m" },
        { name: "1 Jam", value: "1h" },
        { name: "6 Jam", value: "6h" },
        { name: "12 Jam", value: "12h" },
        { name: "1 Hari", value: "1d" },
        { name: "1 Minggu", value: "1w" }
      )
  )
  .addStringOption((o) =>
    o.setName("alasan").setDescription("Alasan timeout").setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  if (!interaction.guild || !interaction.member) {
    await interaction.reply({ content: "Perintah ini hanya bisa digunakan di server.", ephemeral: true });
    return;
  }

  const moderator = interaction.member as GuildMember;
  if (!isModerator(moderator)) {
    await interaction.reply({ content: "❌ Kamu tidak punya izin untuk melakukan ini.", ephemeral: true });
    return;
  }

  const target = interaction.options.getMember("target") as GuildMember | null;
  if (!target) {
    await interaction.reply({ content: "❌ User tidak ditemukan di server.", ephemeral: true });
    return;
  }

  if (isProtected(target)) {
    await interaction.reply({ content: "❌ User ini tidak bisa di-timeout (owner/admin dilindungi).", ephemeral: true });
    return;
  }

  if (!target.moderatable) {
    await interaction.reply({ content: "❌ Bot tidak punya izin untuk timeout user ini.", ephemeral: true });
    return;
  }

  if (moderator.roles.highest.position <= target.roles.highest.position) {
    await interaction.reply({ content: "❌ Kamu tidak bisa timeout user dengan role lebih tinggi atau setara.", ephemeral: true });
    return;
  }

  const durasiKey = interaction.options.getString("durasi", true);
  const durasiMs = DURATIONS[durasiKey];
  const alasan = interaction.options.getString("alasan") ?? "Tidak ada alasan diberikan";

  await target.timeout(durasiMs, `${moderator.user.tag}: ${alasan}`);

  const embed = buildModEmbed({
    action: "TIMEOUT",
    target: `${target.user.tag} (${target.id})`,
    moderator: `${moderator.user.tag}`,
    reason: alasan,
    duration: durasiKey,
    color: "#FF6600",
  });

  await sendLog(interaction.guild, embed);
  await interaction.reply({ embeds: [embed] });
}
