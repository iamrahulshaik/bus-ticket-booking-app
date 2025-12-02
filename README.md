# WEGOOO – Bus Ticket Booking App

WEGOOO is a simple **bus ticket search & booking** app built with:

- **Frontend:** React (Vite)
- **Backend:** Django
- **Database:** SQLite (default, easy for development)

The goal is to let users search for buses between cities and (later) book seats.

---

## ✨ Features (current)

- Search form with **From** and **To** city inputs
- React UI with `Navbar` and `Form1` components
- Django backend with a sample API endpoint:  
  `GET /api/hello/` → returns a test JSON response

> More features like real bus search, seat booking, and user login can be added later.

---

## 📁 Project Structure

```bash
wegooo/
│
├── BACKEND/
│   ├── manage.py
│   ├── wegooo/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   └── api/
│       ├── views.py
│       ├── models.py
│       ├── urls.py
│       └── ...
│
└── FRONTEND/
    └── wegooo-frontend/
        ├── index.html
        ├── package.json
        └── src/
            ├── Components/
            │   ├── Navbar.jsx
            │   ├── Navbar.css
            │   ├── Form1.jsx
            │   └── Form1.css
            ├── App.jsx
            ├── main.jsx
            └── index.css
