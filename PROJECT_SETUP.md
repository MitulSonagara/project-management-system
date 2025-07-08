# 📦 Project Installation Guide

Welcome to the **Advanced Project Management System**!  
This guide explains how to set up the project on your local machine for development or testing purposes.

---

## 🚀 Tech Stack

- **Frontend**: React + Vite + Redux Toolkit + TailwindCSS + Material Tailwind
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **Authentication**: JWT-based, with Role-Based Access Control

---

## 🖥️ Prerequisites

Ensure you have the following installed on your machine:

- [Node.js (v18+)](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

Optional but recommended:
- [Yarn](https://yarnpkg.com/)

---

## 🔧 Project Structure

```
project-management-system/
├── client/     # Frontend
├── server/     # Backend
```
---

## ⚙️ Backend Setup

### 📂 Step 1: Navigate to the Backend Folder

```bash
cd server
````

### 📄 Step 2: Configure Environment Variables

* Copy the `.env.example` file and rename it to `.env`.
* Open `.env` and set the required environment variables:

  ```env
  NODE_ENV = Development #your development environment

  MONGODB_URI = #your mongodb uri

  JWT_SECRET = "your-jwt-secret" #your jwt secret

  PORT = 8800 #your port

  FRONTEND_URI = http://localhost:5173 #your frontend url
  ```

### 📦 Step 3: Install Dependencies

```bash
npm install
```

### 🚀 Step 4: Start the Backend Server

```bash
npm start
```

By default, backend runs at: [http://localhost:8800](http://localhost:8800)

---

## 🎨 Frontend Setup

### 📂 Step 1: Navigate to the Frontend Folder

```bash
cd client
```

### 📄 Step 2: Configure Environment Variables

* Copy the `.env.example` file and rename it to `.env`.
* Set the required environment variables if needed.
```env
VITE_APP_API_BASE_URL=http://localhost:8800 
```

### 📦 Step 3: Install Dependencies

```bash
npm install
```

### 🚀 Step 4: Start the Frontend Dev Server

```bash
npm run dev
```

By default, frontend runs at: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Notes

* Make sure MongoDB is running or that your Atlas credentials are correct.
* Ensure `.env` files are properly configured for both frontend and backend.
* Use `npm install` again if you face dependency issues.

---

## 🔗 Useful Commands

| Command       | Location               | Description                |
| ------------- | ---------------------- | -------------------------- |
| `npm start`   | `/server`              | Start backend server       |
| `npm run dev` | `/client`              | Start frontend in dev mode |
| `npm install` | `/server` or `/client` | Install dependencies       |

---

For further help or to report issues, visit the [Issues](https://github.com/MitulSonagara/project-management-system/issues) page.

Happy coding! 🚀

