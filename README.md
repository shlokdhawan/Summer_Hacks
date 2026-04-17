# Inbox Zero AI: Unified Communication Aggregator

A high-performance communication aggregator that pulls real-time data from **Gmail** and **Telegram** into a unified, AI-powered dashboard. Built for hackathons and power users who want to achieve "Inbox Zero" across multiple platforms.

## ✨ Features

- **Unified Inbox:** Real-time sync for Gmail and Telegram.
- **AI Categorization:** Automatically groups messages using **Gemini 1.5 Pro**.
- **Semantic Search (RAG):** Search through your communication history using natural language, powered by **Pinecone** vector embeddings.
- **Instant Feed:** Ultra-fast UI with background processing for AI enrichment and indexing.
- **Glassmorphism UI:** Modern, premium dark-mode interface.

## 🚀 Tech Stack

- **Backend:** FastAPI (Python), Redis (Memory/Persistence), Pinecone (Vector DB)
- **Frontend:** React, TypeScript, Vite, TailwindCSS (Vanilla CSS logic)
- **AI:** Google Gemini 1.5 Pro

## 🛠️ Getting Started

### Prerequisites

- Python 3.9+
- Node.js & npm
- [Gemini API Key](https://aistudio.google.com/)
- [Telegram Bot Token](https://t.me/botfather)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure your environment:
   Create a `.env` file based on the provided template (see `.env.example` once created).
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🔒 Security Note

The `.env` file and persistent message stores (`.inboxzero_messages.json`) are **automatically ignored** via `.gitignore` to protect your API keys and private data.

---
Built with ❤️ by [Shlok Dhawan](https://github.com/shlokdhawan)
