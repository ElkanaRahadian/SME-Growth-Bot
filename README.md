# 🌱 SME Growth Bot

AI-powered business advisor for entrepreneurs. Get instant analysis on business feasibility, startup costs, revenue projections, and risk assessment.

<div align="center">
  <img width="1200" height="600" alt="SME Growth Bot Demo" src="[INSERT_YOUR_SCREENSHOT_URL_HERE]" />
</div>

## ✨ Features

- 💬 **AI Chat Interface** - Powered by Google Gemini
- 📊 **Business Analysis** - Feasibility, costs, projections, risks
- 🎨 **Modern Design** - Glassmorphic UI with smooth animations
- 📱 **Fully Responsive** - Works on mobile, tablet, desktop
- ⚡ **Fast & Free** - Quick responses, no authentication needed

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **AI:** Google Gemini API

## 🚀 Quick Start

**Prerequisites:** Node.js 16+, Gemini API key ([get free key](https://aistudio.google.com/app/apikeys))

```bash
# 1. Clone repo
git clone https://github.com/ElkanaRahadian/SME-Growth-Bot.git
cd SME-Growth-Bot

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# 4. Run
npm start

# 5. Open http://localhost:3000
```

## 📖 Project Structure

```
sme-growth-bot/
├── public/
│   ├── home.html      # UI
│   ├── home.css       # Styling & animations
│   └── home.js        # Frontend logic
├── server.js          # Backend & Gemini integration
├── package.json       # Dependencies
└── .env.example       # Environment template
```

## 💻 API

**POST /api/chat**
```json
{
  "message": "Help me check the feasibility of a coffee shop",
  "conversation": []
}
```

Response: AI-generated business analysis

## 🎓 Example Use Cases

- Coffee shop feasibility check
- Laundry business budget estimation
- F&B risk assessment
- Retail startup planning

## 🔧 Development

**Change colors:** Edit `public/home.css` (search `#ff6b6b`)
**Change AI behavior:** Edit `server.js` (modify `systemInstruction`)
**Add features:** Edit HTML, CSS, or JavaScript files

## ⚠️ Important

- **Never commit `.env`** - Keep API keys secret
- API key goes in `.env` (use `.env.example` as template)
- For production: Set `NODE_ENV=production`

## 📄 License

MIT License - feel free to use and modify

## 🤝 Contributing

Found a bug or have suggestions? Open an [Issue](https://github.com/ElkanaRahadian/SME-Growth-Bot/issues)

---

**Made with ❤️ for entrepreneurs**

[GitHub](https://github.com/ElkanaRahadian/SME-Growth-Bot) • [Issues](https://github.com/ElkanaRahadian/SME-Growth-Bot/issues)

**Version:** 2.0.0 | **Status:** Production Ready ✅
