# แบบทดสอบเข้าทำงานกับ Data Wow

โปรเจกต์นี้เป็นการทดสอบทางเทคนิคสำหรับกระบวนการสมัครงานกับบริษัท **Data Wow**  
ภายในประกอบด้วยระบบ **Full-stack** โดยใช้ **Next.js** สำหรับฝั่ง Frontend และ **NestJS** สำหรับฝั่ง Backend/API

---

## 📁 โครงสร้างโปรเจกต์

```
.
├── frontend/   # เว็บแอปพลิเคชัน (Next.js)
└── backend/    # API ฝั่งเซิร์ฟเวอร์ (NestJS)
```

---

## 🚀 วิธีเริ่มต้นใช้งาน

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/your-username/datawow-test.git
cd datawow-test
```

---

## 🖥️ ส่วน Frontend (Next.js)

### เข้าไปในโฟลเดอร์ frontend

```bash
cd frontend
```

### ติดตั้ง dependencies

```bash
npm install
```

### รันเซิร์ฟเวอร์สำหรับพัฒนา

```bash
npm run dev
```

แอปพลิเคชันจะอยู่ที่: `http://localhost:3000`

---

## 🔧 ส่วน Backend (NestJS)

### เข้าไปในโฟลเดอร์ backend

```bash
cd backend
```

### ติดตั้ง dependencies

```bash
npm install
```

### รันเซิร์ฟเวอร์ backend

```bash
npm run start:dev
```

API จะใช้งานได้ที่: `http://localhost:3001` (หรือพอร์ตที่ตั้งไว้)

---

## ⚙️ ตัวแปร Environment

คุณอาจต้องตั้งค่าไฟล์ `.env` ในแต่ละส่วนของโปรเจกต์:

### `.env` (frontend)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### `.env` (backend)

```
PORT=3001
```

> ⚠️ ไม่ควร commit ไฟล์ `.env` ที่มีข้อมูลสำคัญ

---

## 📦 หมายเหตุสำหรับการ Deploy

- frontend (`/frontend`) สามารถ deploy บน **Vercel**
- backend (`/backend`) แนะนำให้ deploy แยกบนแพลตฟอร์ม เช่น **Render**, **Railway**, หรือ **Heroku**

---

## 🧑‍💻 ผู้พัฒนา

- Your Name Here
- [Your GitHub](https://github.com/your-username)

---

## 📄 License

โปรเจกต์นี้สร้างขึ้นเพื่อใช้ในการทดสอบเท่านั้น ไม่ได้อนุญาตให้ใช้งานในเชิงพาณิชย์
