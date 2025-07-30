# 🎙️ Speech-to-Text Transcription Web App
This is a full-stack voice transcription web app that allows users to upload or record audio, transcribe it using the Deepgram API, and store & retrieve transcriptions using Supabase. 
The frontend is built with React + Tailwind CSS and deployed on Netlify, while the backend is powered by Express.js and deployed on Render.

## 🌐 Live Demo
* Frontend (Netlify): https://kdspeechtotext.netlify.app/
* Backend (Render): https://tts-d3ed.onrender.com

## ✨ Features
* Upload audio files or record voice directly
* Transcribe speech to text using Deepgram API
* Store and retrieve transcripts using Supabase
* View and download transcription history
* Beautiful modern UI with Tailwind CSS

## 🧱 Tech Stack
* Frontend: React + TypeScript + Tailwind CSS
* Backend: Node.js + Express.js
* Transcription API: Deepgram
* Database: Supabase (PostgreSQL)
* Hosting: Netlify (frontend) + Render (backend)


## 🚀 Project Structure
📁 client/
  React frontend using Vite
📁 server/
  Node.js + Express backend


## 🔧 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/speech-to-text-app.git
cd speech-to-text-app
```

### 2. Install dependencies
Frontend:
```bash
cd client
npm install
```

Backend:
```bash
cd ../server
npm install
```

## 🔑 Environment Variables
Create a .env file in the server folder with the following:
.env
PORT=5000
DEEPGRAM\_API\_KEY=your\_deepgram\_api\_key
SUPABASE\_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
SUPABASE\_ANON\_KEY=your\_supabase\_anon\_key
SUPABASE\_SERVICE\_ROLE\_KEY=your\_supabase\_service\_key

> Don't share these keys publicly.

## 🏗️ Supabase Setup
1. Go to [https://supabase.com](https://supabase.com) and create a project.
2. Create a table called transcripts with the following schema:

| Column      | Type        | Notes                       |
| ----------- | ----------- | --------------------------- |
| id          | int4        | Primary Key, auto increment |
| filename    | text        | Audio file name             |
| text        | text        | Transcription result        |
| created\_at | timestamptz | default now()               |

3. Get your project URL and anon/service keys from Supabase → Project Settings → API.


## 🔁 Deepgram Setup
1. Go to [https://deepgram.com](https://deepgram.com)
2. Sign up and get your free API key from the dashboard.

## 🧪 Running Locally
Frontend:
```bash
cd client
npm run dev
```

Backend:
```bash
cd server
node index.js
```

Then visit [http://localhost:5173](http://localhost:5173) in your browser.


## 🚢 Deployment
Frontend (Netlify):
* Connect your client/ folder to Netlify
* Set base directory to client
* Add build command: npm run build
* Publish directory: dist

Backend (Render):
* Connect your server/ folder as a new web service
* Set build & start command to:
  bash
  npm install
  node index.js
* Add the same .env variables in Render's Environment tab


## 📂 API Endpoints

| Method | Endpoint              | Description                 |
| ------ | --------------------- | --------------------------- |
| POST   | /api/audio/transcribe | Uploads + transcribes audio |
| GET    | /api/history          | Returns past transcriptions |


<img width="1894" height="912" alt="Screenshot 2025-07-30 224247" src="https://github.com/user-attachments/assets/eaff5594-712c-4e9a-9007-f0f415fe6879" />

## 🧠 Credits

* Deepgram — for the transcription engine
* Supabase — for backend database
* Netlify + Render — for deployment
* Tailwind CSS — for clean UI
