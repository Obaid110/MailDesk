# MailDesk

**A simple, lightweight email-sending dashboard powered by [Resend](https://resend.com).**

MailDesk lets you send emails through your verified Resend domains using a clean, straightforward web interface. Enter your API key, fill in the email details, and send messages directly from your browser.

## ✨ Features

- **Simple Dashboard** — A clean interface for composing and sending emails.
- **Resend API Integration** — Send emails using the Resend email API.
- **Custom Sender Address** — Use sender addresses authorized by your verified Resend domains.
- **Multiple Recipients** — Support for To, CC, and BCC fields.
- **Custom Subjects and Messages** — Write your own email subject and message.
- **API Key Input** — Enter your Resend API key directly in the dashboard.
- **Serverless Deployment** — Deploy easily with Vercel.

## 🛠️ Built With

- HTML
- CSS
- JavaScript
- Node.js
- Resend API
- Vercel

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/MailDesk.git
cd MailDesk
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Deploy to Vercel

1. Open [Vercel](https://vercel.com/).
2. Import your MailDesk GitHub repository.
3. Configure the project settings.
4. Deploy the application.
5. Open your deployment URL to access the dashboard.

### 3. Configure Resend

1. Create an account at [Resend](https://resend.com/).
2. Add and verify your sending domain.
3. Generate an API key.
4. Open MailDesk and enter your API key.
5. Complete the sender, recipient, subject, and message fields.
6. Click **Send Email**.

## 📧 How to Use

1. Enter your Resend API key.
2. Enter a verified sender address.
3. Add the recipient's email address.
4. Optionally add CC and BCC recipients.
5. Enter the subject and message.
6. Click **Send Email**.

Your sender address must be authorized by your Resend account. Email delivery is subject to Resend's account limits and sending policies.

## 🔐 Security

- Keep your Resend API key private.
- Never commit API keys or other secrets to GitHub.
- Only use API keys you own or are authorized to use.
- Use HTTPS when accessing your deployed dashboard.
- Protect publicly accessible deployments against unauthorized use.

**Important:** An API key entered in the dashboard should be sent only to your own trusted backend over HTTPS. Avoid storing it in browser storage or exposing it in logs.

## 📁 Project Structure

```text
MailDesk/
├── api/
│   └── index.js
├── README.md
└── vercel.json
```

## 🌐 Deployment

MailDesk is designed for deployment on Vercel using its serverless functions.

Once deployed, open your Vercel project URL to access the dashboard.

## 📄 License

This project is open source. Add a `LICENSE` file to specify the terms under which others may use, modify, and distribute your code.

---

**MailDesk — Simple email sending, powered by Resend.**
