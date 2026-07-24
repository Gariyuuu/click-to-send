const SNOWFLAKE_RE = /^\d{15,20}$/;
const MAX_RECIPIENTS = 20;

async function sendDm(authHeader, userId, message) {
  const channelRes = await fetch("https://discord.com/api/v10/users/@me/channels", {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ recipient_id: userId }),
  });
  if (!channelRes.ok) {
    throw new Error(`could not open DM channel (${channelRes.status})`);
  }
  const channel = await channelRes.json();

  const msgRes = await fetch(`https://discord.com/api/v10/channels/${channel.id}/messages`, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  });
  if (!msgRes.ok) {
    throw new Error(`could not send message (${msgRes.status})`);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message, userIds, passcode } = req.body || {};

  const { DISCORD_BOT_TOKEN, SITE_PASSCODE } = process.env;
  if (!DISCORD_BOT_TOKEN || !SITE_PASSCODE) {
    res.status(500).json({ error: "Discord is not configured on the server" });
    return;
  }

  if (!passcode || passcode !== SITE_PASSCODE) {
    res.status(401).json({ error: "Invalid access code" });
    return;
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  if (!Array.isArray(userIds) || userIds.length === 0) {
    res.status(400).json({ error: "At least one Discord user ID is required" });
    return;
  }

  const uniqueIds = [...new Set(userIds.map((id) => String(id).trim()))];

  if (uniqueIds.length > MAX_RECIPIENTS) {
    res.status(400).json({ error: `Too many recipients (max ${MAX_RECIPIENTS})` });
    return;
  }

  if (!uniqueIds.every((id) => SNOWFLAKE_RE.test(id))) {
    res.status(400).json({ error: "One or more Discord user IDs are invalid" });
    return;
  }

  const authHeader = { Authorization: `Bot ${DISCORD_BOT_TOKEN}` };
  const results = [];

  for (const userId of uniqueIds) {
    try {
      await sendDm(authHeader, userId, message);
      results.push({ userId, ok: true });
    } catch (err) {
      results.push({ userId, ok: false, error: err.message });
    }
  }

  res.status(200).json({ results });
}
