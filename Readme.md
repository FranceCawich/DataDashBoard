# DataDashBoard System Under Development 

A modern data dashboard platform built with **React** for the frontend and **FastAPI** for the backend.  
The system allows users to connect databases, upload CSV/JSON files, select tables and fields, and generate interactive dashboards, reports, charts, and graphs.

---

## 👨‍💻 Author

**Created by:** Francis Cawich  
**Contact:** cawich.francis@gmail.com

---

# 🚀 Features

- React frontend dashboard UI
- FastAPI backend API
- Connect to external databases
- Upload CSV and JSON files
- Select tables and fields dynamically
- Generate interactive reports
- Create charts and data visualizations
- Modern and scalable architecture

---

# 📋 Prerequisites

Ensure the following are installed on your system:

- Python 3.x
- Node.js
- npm or pnpm

---

# ⚙️ Backend Setup (FastAPI)

## 1️⃣ Navigate to the backend directory

```bash
cd Back_end
```

## 2️⃣ Create virtual environment

```bash
python -m venv venv
```

## 3️⃣ Activate virtual environment

### Linux / Mac

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

---

## 4️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

---

## 5️⃣ Start the FastAPI server

```bash
uvicorn main:app --reload
```

Backend will run on:

```bash
http://127.0.0.1:8000
```

---

# 🎨 Frontend Setup (React)

## 1️⃣ Navigate to frontend directory

```bash
cd frontend
```

---

## 2️⃣ Install dependencies

Using npm:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

---

## 3️⃣ Start the React development server

Using npm:

```bash
npm run dev
```

Or using pnpm:

```bash
pnpm dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---
# ⚙️ Database Configurations Docker (Postgres)
## Build the Image for Postgres 

```bash
docker build -it postgres:v1 .
```
## Run the container
```bash
docker compose up 
```
## Connet to the database via PGAdmin or any Cliente of your choice 



# 📂 Supported Data Sources

- MySQL
- PostgreSQL
- CSV Files
- JSON Files

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- JavaScript / TypeScript
- Docker 

## Backend

- FastAPI
- Python
- SQLAlchemy

---

# 📊 Project Goal

The goal of this project is to provide users with a simple and powerful platform for importing, managing, analyzing, and visualizing data through interactive dashboards and reports.

---

# 📄 License

This project is open-source and available for educational and development purposes. Currently Under developmet as a hubby.. feel free to Contribute as we go along 
