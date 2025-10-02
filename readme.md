# InterviewApp — AI-Powered Interview Assistant

> 🚀 A React + Node interview platform that runs timed, AI-generated interviews and provides an interviewer dashboard.  
> Built to satisfy the **Swipe Internship Assignment** requirements:  
> 🧑‍💻 Interviewee (chat) + 🧑‍🏫 Interviewer (dashboard) tabs, resume parsing, missing-field prompts, timed questions, persistence, and “Welcome Back” flow.

---

## 📚 Table of Contents
1. [About the Project](#about-the-project)  
2. [Preview](#preview)  
3. [Tech Stack](#tech-stack)  
4. [Features](#features)  
5. [Environment Variables](#environment-variables)  
6. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Run Locally](#run-locally)  
7. [Deployment](#deployment)  
8. [Usage](#usage)  
9. [Roadmap](#roadmap)     
10. [Contact](#contact)  


---

## 📝 About the Project

**InterviewApp** is a full-stack application (frontend + backend) that simulates a **timed AI interview** for a Full Stack (React/Node) role.

- Candidates upload resumes (PDF/DOCX)  
- Missing fields (Name, Email, Phone) are auto-detected and prompted  
- AI runs a 6-question interview:  
  - 2 Easy (20s)  MCQ question
  - 2 Medium (60s) MSQ question 
  - 2 Hard (120s)  Text based question
- Auto-submission happens on timeout  
- At the end, an **AI-generated score and summary** are created  
- Interviewer dashboard shows **candidate list, scores, history, and summaries**  
- All sessions persist across refreshes, including a **“Welcome Back”** modal for unfinished interviews

---

## 🖼 Preview

### 🎥 Demo Video

<p align="center">
  <a href="https://youtu.be/kCeSD5q0MyE" target="_blank">
    <img src="https://img.youtube.com/vi/kCeSD5q0MyE/0.jpg" 
         alt="Watch the demo" 
         width="720" />
  </a>
</p>
---

## 🧰 Tech Stack

### **Frontend**
- ⚡ Vite + React 18 + TypeScript  
- 🎨 TailwindCSS + shadcn UI  
- 🧠 Redux Toolkit + redux-persist  
- 📄 pdfjs-dist (resume reading)  
- 🛣 react-router-dom

### **Backend**
- 🟩 Node.js + Express  
- 📝 Prisma ORM  
- 🗄 Supabase (DB/storage)  
- ☁️ Cloudinary (resume uploads)  
- 📚 pdf-parse (resume text extraction)  
- 📎 multer (file uploads)  
- 🤖 Gemini / Generative Language API (AI questions + scoring)

### **Other**
- Local persistence: redux-persist + localStorage  
- Dev tools: vite, nodemon, eslint, prettier, vitest

---

## ✨ Features

- ✅ Resume upload (PDF, DOCX)  
- 📝 Auto-extraction of **Name / Email / Phone**  
- 🤖 Chatbot prompts for missing fields before interview starts  
- 🧠 AI-generated timed questions (Easy / Medium / Hard)  
- ⏱ Question timers & auto-submit  
- 📊 Per-question scoring and progress tracking  
- 📝 Final AI score and concise summary  
- 🧑‍🏫 Interviewer dashboard with **candidate list, search & sort**  
- 🕵️ Candidate detail view: **chat history + AI scores**  
- 💾 Local persistence & “Welcome Back” modal for unfinished sessions of assessment
- 🚨 Friendly error handling for invalid files & network issues
- implemented searchbar, pagination and sorting options functionality candidate-table.
-used scalaten for loading data


---

## 🔐 Environment Variables

> ⚠️ **Never** commit `.env` files or secrets to GitHub.  
> Use `.env.local`, secret managers, or deployment platform secrets.

### 📂 Backend `.env` Example
```env
# Database (Prisma)
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>"

# Supabase (optional)
SUPABASE_URL="https://<your-supabase-project>.supabase.co"
SUPABASE_ANON_KEY="<your-supabase-anon-key>"

# App
PORT=5000

# Generative AI Model (Gemini)
GEMINI_API_KEY="<your-generative-model-api-key>"
GEMINI_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Cloudinary
CLOUDINARY_CLOUD_NAME="<your-cloud-name>"
CLOUDINARY_API_KEY="<your-cloudinary-api-key>"
CLOUDINARY_API_SECRET="<your-cloudinary-api-secret>"
```


# 🚀 Getting Started

Follow these steps to set up the project locally.

---

## ✅ Prerequisites

- 🟢 **Node.js ≥ 18**  
- 📦 **npm / pnpm / yarn**  
- 🗄 **PostgreSQL or Supabase** account  
- ☁️ **Cloudinary** account (for resume storage)  
- 🤖 **Gemini API Key** (or any supported AI model)

---

## 📦 Installation

### 1️⃣ Clone the repo
```bash
git clone https://github.com/vikash000x/interviewapp.git
cd interviewapp
```

---
## 2️⃣ Install dependencies
```code
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

---
## 3️⃣ Set up environment variables

---
### Visit the app at:
👉 Frontend: http://localhost:5173

👉 Backend: http://localhost:5000

---
## 🌐 Deployment

You can deploy the project using any modern platform:

Frontend: Vercel / Netlify / Render

Backend: Render / Railway / Fly.io / Heroku

Database: Supabase or your own PostgreSQL server

Environment Secrets: Configure .env securely on your hosting platform

---
## 🧭 Usage

-  Go to the Interviewee Tab → upload your resume

- Fill in any missing details if prompted

-  The timed AI interview starts (6 questions by difficulty)

-  AI scores answers and generates a performance summary

-  Visit the Interviewer Tab to see:  Candidate list, Scores, Chat history, Summaries


---
## 🛣 Roadmap

- ✅ Core Interview Flow

- 📝 Resume Parsing + Missing Field Prompts

- 📊 Interviewer Dashboard

- 💾 Data Persistence & Welcome Back Modal

- 🔁 Real-time syncing with WebSocket

- 🧑‍💼 Admin panel for managing interviews

- 📈 Analytics dashboard for interviewer


---
### **📬 Contact**

- 👤 Author: Vikash Sinha

- 📧 Email: vikashsinha045@gmail.com

- 🌐 Portfolio: [@my-portfolio](https://portfolio-vikash-sinhas-projects.vercel.app/)

- 💼 LinkedIn: [@my-linkedin](https://www.linkedin.com/in/vikash-sinha-215000259/)






