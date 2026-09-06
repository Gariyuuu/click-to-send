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

// Lucide geometry, matching the two button icons. Kept as path data rather than
// markup strings so the status line builds its <svg> the same way every time.
const STATUS_ICON = {
  error: '<path d="M12 9v4"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/>',
  success: '<path d="M20 6 9 17l-5-5"/>',
  pending: '<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',
};

function statusIcon(kind) {
  return (
    '<svg class="icon" viewBox="0 0 24 24" width="15" height="15" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true">' + STATUS_ICON[kind] + "</svg>"
  );
}

/**
 * `state` is "idle" | "pending" | "success" | "error". Previously every outcome
 * was the same grey sentence, so a failure and a success were told apart only by
 * reading the words. The state now also drives colour and a leading icon.
 * The message text itself is inserted as textContent, never as markup — it can
 * contain a server error string.
 */
function setStatus(text, { success = false, state } = {}) {
  const kind = state || (success ? "success" : "idle");
  statusEl.classList.remove("fx-stamp");
  statusEl.textContent = "";
  if (kind !== "idle") {
    statusEl.insertAdjacentHTML("afterbegin", statusIcon(kind));
  }
  statusEl.appendChild(document.createTextNode(text));
  statusEl.dataset.state = kind;
  if (kind === "success") {
    // Force a reflow so the animation restarts on consecutive successful sends.
    void statusEl.offsetWidth;
    statusEl.classList.add("fx-stamp");
  }
}

/** Swaps a button's icon for a spinner in place — no layout shift, no text change. */
function setBusy(btn, busy) {
  btn.disabled = busy;
  if (busy) {
    btn.dataset.loading = "true";
  } else {
    delete btn.dataset.loading;
  }
}

emailBtn.addEventListener("click", async () => {
  const message = messageEl.value.trim();
  const to = recipientEl.value.trim();
  const passcode = passcodeEl.value;

  if (!message) return setStatus("Type a message first.", { state: "error" });
  if (!to) return setStatus("Enter a recipient email first.", { state: "error" });
  if (!passcode) return setStatus("Enter the access code first.", { state: "error" });

  setBusy(emailBtn, true);
  setStatus("Sending email\u2026", { state: "pending" });
  try {
    await post("/api/send-email", { message, to, passcode });
    setStatus("Email sent.", { success: true });
  } catch (err) {
    setStatus(`Failed to send email: ${err.message}`, { state: "error" });
  } finally {
    setBusy(emailBtn, false);
  }
});

discordBtn.addEventListener("click", async () => {
  const message = messageEl.value.trim();
  const userIds = discordIdsEl.value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const passcode = passcodeEl.value;

  if (!message) return setStatus("Type a message first.", { state: "error" });
  if (userIds.length === 0)
    return setStatus("Enter at least one Discord user ID first.", { state: "error" });
  if (!passcode) return setStatus("Enter the access code first.", { state: "error" });

  setBusy(discordBtn, true);
  setStatus("Sending Discord DM(s)\u2026", { state: "pending" });
  try {
    const data = await post("/api/send-discord", { message, userIds, passcode });
    const failed = data.results.filter((r) => !r.ok);
    if (failed.length === 0) {
      setStatus(`Sent to ${data.results.length} recipient(s).`, { success: true });
    } else {
      setStatus(
        `Sent to ${data.results.length - failed.length}/${data.results.length}. Failed: ${failed
          .map((f) => f.userId)
          .join(", ")}`,
        { state: "error" }
      );
    }
  } catch (err) {
    setStatus(`Failed to send Discord DM: ${err.message}`, { state: "error" });
  } finally {
    setBusy(discordBtn, false);
  }
});
