import { Client, Events, ActivityType } from "discord.js";
import { ensureLogChannel } from "../handlers/logs";

export function registerReadyEvent(client: Client): void {
  client.once(Events.ClientReady, async (readyClient) => {
    console.log(`✅ Bot online sebagai ${readyClient.user.tag}`);

    readyClient.user.setPresence({
      activities: [
        {
          name: "🛡️ Menjaga Community",
          type: ActivityType.Watching,
        },
      ],
      status: "online",
    });

    for (const guild of readyClient.guilds.cache.values()) {
      await ensureLogChannel(guild);
      console.log(`🏠 Terhubung ke server: ${guild.name}`);
    }
  });
}
