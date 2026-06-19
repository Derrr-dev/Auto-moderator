import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  GuildMember,
} from "discord.js";
import { isProtected, isModerator } from "../../utils/permissions";
import { buildModEmbed } from "../../utils/embed";
import { sendLog } from "../../handlers/logs";

export const data = new SlashCommandBuilder()
  .setName("warn")
  .setDescription("Beri peringatan kepada member")
  .addUserOption((o) =>
    o.setName("target").setDescription("User yang akan diberi peringatan").setRequired(true)
  )
  .addStringOption((o) =>
    o.setName("alasan").setDescription("Alasan peringatan").setRequired(true)
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
    await interaction.reply({ content: "❌ User ini tidak bisa diberi peringatan (owner/admin dilindungi).", ephemeral: true });
    return;
  }

  const alasan = interaction.options.getString("alasan", true);

  try {
    await target.user.send({
      embeds: [
        buildModEmbed({
          action: "⚠️ PERINGATAN",
          target: `${target.user.tag}`,
          moderator: `${moderator.user.tag}`,
          reason: alasan,
          color: "#FFA500",
        }),
      ],
    });
  } catch {
    // DM mungkin dinonaktifkan oleh user
  }

  const embed = buildModEmbed({
    action: "PERINGATAN",
    target: `${target.user.tag} (${target.id})`,
    moderator: `${moderator.user.tag}`,
    reason: alasan,
    color: "#FFA500",
  });

  await sendLog(interaction.guild, embed);
  await interaction.reply({ embeds: [embed] });
}
