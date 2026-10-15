module.exports = async (req, res) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MailDesk</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#f3f6fb;color:#172033;font-family:Arial,sans-serif;padding:32px 16px}
main{max-width:720px;margin:35px auto;background:white;padding:30px;border-radius:18px;box-shadow:0 12px 40px #182d4910}
h1{margin:0 0 8px;font-size:27px}
p{color:#64748b;line-height:1.5}
label{display:block;font-size:13px;font-weight:700;margin:18px 0 7px}
input,textarea{width:100%;padding:12px;border:1px solid #d8e0eb;border-radius:9px;font:inherit;outline:none}
input:focus,textarea:focus{border-color:#2174b0}
textarea{min-height:180px;resize:vertical}
button{margin-top:20px;width:100%;padding:14px;background:#2174b0;color:white;border:0;border-radius:9px;font-weight:bold;cursor:pointer}
button:disabled{opacity:.6;cursor:wait}
#status{white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px}
.note{font-size:12px;color:#64748b}
</style>
</head>
<body>
<main>
<h1>MailDesk</h1>
<p>Send email from your verified Resend domains.</p>
<form id="emailForm">
<label>Resend API Key</label>
<input id="apiKey" type="password" placeholder="re_xxxxxxxxxxxxxxxxxxxx" required autocomplete="off">
<label>From</label>
<input id="from" placeholder="contact@yourdomain.com or Your Name &lt;contact@yourdomain.com&gt;" required>
<label>To</label>
<input id="to" placeholder="recipient@example.com" required>
<label>CC (optional)</label>
<input id="cc" placeholder="colleague@example.com">
<label>BCC (optional)</label>
<input id="bcc" placeholder="archive@example.com">
<label>Subject</label>
<input id="subject" required>
<label>Message</label>
<textarea id="text" required></textarea>
<button id="sendButton" type="submit">Send Email</button>
</form>
<p class="note">Use only sender addresses authorized by your Resend account.</p>
<p id="status" role="status"></p>
</main>
<script>
const form = document.getElementById("emailForm");
const button = document.getElementById("sendButton");
const status = document.getElementById("status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  button.disabled = true;
  button.textContent = "Sending...";
  status.textContent = "";

  const payload = {
    apiKey: document.getElementById("apiKey").value.trim(),
    from: document.getElementById("from").value.trim(),
    to: document.getElementById("to").value.trim(),
    cc: document.getElementById("cc").value.trim(),
    bcc: document.getElementById("bcc").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    text: document.getElementById("text").value
  };

  try {
    const response = await fetch("/api", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Email could not be sent.");
    }

    status.textContent = "Email accepted by Resend. ID: " + result.id;
  } catch (error) {
    status.textContent = "Error: " + error.message;
  } finally {
    button.disabled = false;
    button.textContent = "Send Email";
  }
});
</script>
</body>
</html>`;

    if (req.method === "GET") {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        return res.status(200).send(html);
    }

    if (req.method !== "POST") {
        res.setHeader("Allow", "GET, POST");
        return res.status(405).json({ error: "Method not allowed." });
    }

    const {
        apiKey, from, to, cc, bcc, subject, text
    } = req.body || {};

    if (typeof apiKey !== "string" || !apiKey.trim()) {
        return res.status(400).json({ error: "Resend API key is required." });
    }

    const isEmail = (value) =>
        typeof value === "string" &&
        /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);

    const parseAddresses = (value) =>
        typeof value === "string"
            ? value.split(",").map((item) => item.trim()).filter(Boolean)
            : [];

    const normalizeFrom = (value) => {
        if (typeof value !== "string") return null;
        const trimmed = value.trim();
        if (!trimmed || trimmed.length > 200) return null;

        const match = trimmed.match(/^([^<>]+)<([^<>]+)>$/);
        if (match) {
            const email = match[2].trim();
            return isEmail(email) ? `${match[1].trim()} <${email}>` : null;
        }

        if (isEmail(trimmed)) return trimmed;

        return null;
    };

    const recipients = parseAddresses(to);
    const ccRecipients = parseAddresses(cc);
    const bccRecipients = parseAddresses(bcc);
    const normalizedFrom = normalizeFrom(from);

    if (
        !normalizedFrom ||
        recipients.length === 0 ||
        recipients.length > 50 ||
        !recipients.every(isEmail) ||
        ccRecipients.length > 50 ||
        !ccRecipients.every(isEmail) ||
        bccRecipients.length > 50 ||
        !bccRecipients.every(isEmail) ||
        typeof subject !== "string" ||
        !subject.trim() ||
        subject.length > 200 ||
        /[\r\n]/.test(subject) ||
        typeof text !== "string" ||
        !text.trim() ||
        text.length > 100000
    ) {
        return res.status(400).json({
            error: "Check sender format, email addresses, subject and message."
        });
    }

    const email = {
        from: normalizedFrom,
        to: recipients,
        subject: subject.trim(),
        text
    };

    if (ccRecipients.length) email.cc = ccRecipients;
    if (bccRecipients.length) email.bcc = bccRecipients;

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey.trim()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(email)
        });

        const result = await response.json();

        if (!response.ok) {
            return res.status(502).json({
                error: result.message || result.name || "Resend rejected the email."
            });
        }

        return res.status(200).json({ id: result.id });
    } catch {
        return res.status(502).json({
            error: "Could not connect to the email service."
        });
    }
};