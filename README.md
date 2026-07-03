# MeetWise AI 🧠✨

> A premium, futuristic AI-powered meeting intelligence platform built for modern teams.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ruchi-dev-source/Meetwise)

---

## 📖 Project Overview

MeetWise AI is a full-featured AI meeting intelligence SaaS platform that automatically transcribes, summarises, and extracts action items from your meetings. The platform is designed with a premium dark cosmic aesthetic, drawing design inspiration from Linear, Vercel, Notion AI, and OpenAI.

The website is a high-fidelity multi-page interactive mockup demonstrating all core product surfaces.

---

## ✨ Features

- 🎙️ **AI Transcription** – Real-time speaker-diarized meeting transcription
- 📋 **Smart Summaries** – Auto-generated concise meeting summaries
- ✅ **Action Item Extraction** – Intelligent task detection from conversations
- 📊 **Analytics Suite** – Weekly meeting frequency charts, NLP topic clouds, sentiment analysis
- 📅 **Calendar Integration** – Google Calendar & Outlook connection support
- 🔒 **Enterprise Security** – SOC 2, GDPR, and end-to-end encryption
- 🌐 **Workspace Management** – Custom slugs, logo upload, team seats, and role-based access
- 🎨 **Premium UI** – Glassmorphism, floating gradient orbs, micro-animations, dark cosmic theme

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (Semantic) |
| Styling | Tailwind CSS v3 (CDN) + Vanilla CSS (glassmorphism) |
| Icons | Lucide Icons (CDN) |
| Fonts | Google Fonts – Space Grotesk, Inter |
| Server (Dev) | `serve` (Node.js static server) |
| Deployment | Vercel (Static) |

---

## 🚀 Installation & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ installed

### 1. Clone the repository
```bash
git clone https://github.com/Ruchi-dev-source/Meetwise.git
cd Meetwise
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the local dev server
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

The root URL (`/`) will redirect to the **Landing Page**. All sidebar navigation links route between pages automatically.

---

## 📄 Page Routes

| Page | Local URL | Vercel Route |
|---|---|---|
| 🏠 Landing / Features | `/meetwise_ai_features/code.html` | `/` |
| 🔐 Login | `/meetwise_ai_login/code.html` | `/login` |
| 📊 Dashboard | `/meetwise_ai_dashboard/code.html` | `/dashboard` |
| 📈 Analytics | `/meetwise_ai_analytics_dashboard/code.html` | `/analytics` |
| 🎙️ Meeting Details | `/meetwise_ai_meeting_details/code.html` | `/meeting` |
| 👤 Profile | `/meetwise_ai_profile/code.html` | `/profile` |
| ⚙️ Settings | `/meetwise_ai_settings/code.html` | `/settings` |

---

## ☁️ Deployment on Vercel

### One-Click Deploy
Click the **Deploy with Vercel** button at the top of this README.

### Manual Deploy
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy:
   ```bash
   vercel --prod
   ```

The `vercel.json` file in the project root handles all route mappings automatically.

---

## 📁 Folder Structure

```
meetwise-ai/
├── meetwise_ai_features/          # Landing Page / Home
│   └── code.html
├── meetwise_ai_login/             # Login Page
│   └── code.html
├── meetwise_ai_dashboard/         # Main Workspace Dashboard
│   └── code.html
├── meetwise_ai_analytics_dashboard/  # Analytics Suite
│   └── code.html
├── meetwise_ai_meeting_details/   # Meeting Transcript & Actions
│   └── code.html
├── meetwise_ai_profile/           # User Profile Settings
│   └── code.html
├── meetwise_ai_settings/          # Workspace Settings
│   └── code.html
├── executive_precision/           # Supporting assets/components
├── .gitignore                     # Git ignore rules
├── vercel.json                    # Vercel routing config
├── package.json                   # Project metadata & scripts
└── README.md                      # This file
```

---

## 📜 License

MIT License © 2024 MeetWise AI Team

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.
