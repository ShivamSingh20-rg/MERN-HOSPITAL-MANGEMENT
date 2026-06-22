# MERN Hospital Management System

A full-stack Hospital Management System built with the MERN stack (MongoDB, Express.js, React, Node.js) and Vite. This application features a comprehensive patient portal and a dedicated Admin dashboard for managing doctors, services, and hospital records.

## Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS (assumed)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Deployment:** Vercel (Frontend) & Render (Backend)

---

## Project Structure

This is a monorepo containing both the frontend and backend in a single repository:

```
MERN-HOSPITAL-MANGEMENT/
├── backend/               # Node/Express API
│   ├── package.json
│   └── server.js          # Entry point
├── HOSPITAL/              # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   └── pages/         # Client-facing pages (Home, etc.)
│   ├── Admin/             # Admin Dashboard UI
│   │   └── pages/         # Admin pages (AddDoctor, AddService)
│   └── package.json
└── README.md

git clone [https://github.com/ShivamSingh20-rg/MERN-HOSPITAL-MANGEMENT.git](https://github.com/ShivamSingh20-rg/MERN-HOSPITAL-MANGEMENT.git)
cd MERN-HOSPITAL-MANGEMENT
