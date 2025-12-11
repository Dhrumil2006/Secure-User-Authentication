# Secure-User-Authentication

## ✅ What is this  
Secure-User-Authentication is a full-stack web application that implements secure user sign-up and login, session management, and protected routes. It aims to provide a simple but robust baseline for user authentication in web applications (e.g. hashing passwords, validating credentials, restricting access to authenticated users).

## 🛠️ Tech Stack  
- **Frontend**: TypeScript, CSS (with Tailwind) — code under `client/`  
- **Backend**: TypeScript/Node.js — code under `server/`  
- **Database / ORM / Config**: (As per `drizzle.config.ts`, or your chosen database setup)  
- **Build / Tooling**: Vite + PostCSS + accompanying configs (`vite.config.ts`, `postcss.config.js`, etc.)

## 🚀 Features / What it does  
- User **sign up** (with password hashing — not storing plain text)  
- User **login** (credentials check + session / token management)  
- **Protected routes/pages**: Certain parts of the app accessible only when logged in  
- Clean folder structure separating `client`, `server`, and shared configuration / types  

## 📥 How to run this project (Local Setup)  
1. Clone the repo  
   ```bash
   git clone https://github.com/Dhrumil2006/Secure-User-Authentication.git
   cd Secure-User-Authentication
Install dependencies
cd client
npm install
cd ../server
npm install
