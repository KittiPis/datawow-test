# DataWow Technical Assessment

This repository contains a full-stack technical assessment project for the **Data Wow** recruitment process.  
The project demonstrates frontend and backend integration using **Next.js** and **NestJS** respectively.

---

## 📁 Project Structure

```
.
├── frontend/   # Frontend application using Next.js
└── backend/    # Backend API using NestJS
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/datawow-test.git
cd datawow-test
```

---

## 🖥️ Frontend (Next.js)

### Navigate to the frontend folder:

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

---

## 🔧 Backend (NestJS)

### Navigate to the backend folder:

```bash
cd backend
```

### Install dependencies

```bash
npm install
```

### Run the backend server

```bash
npm run start:dev
```

The backend API will be available at: `http://localhost:3001` (or your configured port)

---

## ⚙️ Environment Variables

You may need `.env` files in each folder (`frontend/.env` and `backend/.env`).  
Example environment variables can include:

### `.env` (frontend)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### `.env` (backend)

```
PORT=3001
```

> ⚠️ Make sure to never commit `.env` files containing sensitive information.

---

## 📦 Deployment Notes

- The frontend (`/frontend`) is deployed via **Vercel**.
- The backend (`/backend`) is not deployed to Vercel and can be run locally or deployed to platforms like **Render**, **Railway**, or **Heroku**.

---

## 🧑‍💻 Author

- Your Name Here
- [Your GitHub](https://github.com/your-username)

---

## 📄 License

This project is for recruitment testing purposes only and is not licensed for production use.
