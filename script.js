const recipientEl = document.getElementById("recipient");
const discordIdsEl = document.getElementById("discord-ids");
const messageEl = document.getElementById("message");
const passcodeEl = document.getElementById("passcode");
const statusEl = document.getElementById("status");
const emailBtn = document.getElementById("send-email");
const discordBtn = document.getElementById("send-discord");

async function post(endpoint, body) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function setStatus(text, { success = false } = {}) {
  statusEl.classList.remove("fx-stamp");
  statusEl.textContent = text;
  if (success) {
    // Force a reflow so the animation restarts on consecutive successful sends.
    void statusEl.offsetWidth;
    statusEl.classList.add("fx-stamp");
  }
}

emailBtn.addEventListener("click", async () => {
  const message = messageEl.value.trim();
  const to = recipientEl.value.trim();
  const passcode = passcodeEl.value;

  if (!message) return setStatus("Type a message first.");
  if (!to) return setStatus("Enter a recipient email first.");
  if (!passcode) return setStatus("Enter the access code first.");

  emailBtn.disabled = true;
  setStatus("Sending email...");
  try {
    await post("/api/send-email", { message, to, passcode });
    setStatus("Email sent.", { success: true });
  } catch (err) {
    setStatus(`Failed to send email: ${err.message}`);
  } finally {
    emailBtn.disabled = false;
  }
});

discordBtn.addEventListener("click", async () => {
  const message = messageEl.value.trim();
  const userIds = discordIdsEl.value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const passcode = passcodeEl.value;

  if (!message) return setStatus("Type a message first.");
  if (userIds.length === 0)
    return setStatus("Enter at least one Discord user ID first.");
  if (!passcode) return setStatus("Enter the access code first.");

  discordBtn.disabled = true;
  setStatus("Sending Discord DM(s)...");
  try {
    const data = await post("/api/send-discord", { message, userIds, passcode });
    const failed = data.results.filter((r) => !r.ok);
    if (failed.length === 0) {
      setStatus(`Sent to ${data.results.length} recipient(s).`, { success: true });
    } else {
      setStatus(
        `Sent to ${data.results.length - failed.length}/${data.results.length}. Failed: ${failed
          .map((f) => f.userId)
          .join(", ")}`
      );
    }
  } catch (err) {
    setStatus(`Failed to send Discord DM: ${err.message}`);
  } finally {
    discordBtn.disabled = false;
  }
});
