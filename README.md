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
BUS_BOOKING/
│
├── api/                          # Django REST API app
│   ├── migrations/
│   ├── __pycache__/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── backend/                      # Django backend project
│   ├── __pycache__/
│   ├── asgi.py
│   ├── manage.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── frontend/                     # React frontend
│   ├── node_modules/
│   ├── public/
│   └── src/
│       ├── api/
│       │   ├── api.js
│       │   └── index.js
│       │
│       ├── assets/
│       │   └── react.svg
│       │
│       ├── components/
│       │   ├── Account.jsx
│       │   ├── BusCard.jsx
│       │   ├── Footer.jsx
│       │   ├── Form1.jsx
│       │   ├── Navbar.jsx
│       │   ├── SearchBuses.jsx
│       │   └── SeatMap.jsx
│       │
│       ├── images/
│       │   └── The bus rides along the city road ….jpeg
│       │
│       ├── pages/
│       │   ├── About.jsx
│       │   ├── Account.jsx
│       │   ├── AdminRegister.jsx
│       │   ├── BusResults.jsx
│       │   ├── Checkout.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── MyBookings.jsx
│       │   ├── Search.jsx
│       │   └── SeatSelection.jsx
│       │
│       ├── styles/
│       │   ├── account.css
│       │   ├── AdminRegister.css
│       │   ├── buscard.css
│       │   ├── form.css
│       │   ├── home.css
│       │   ├── navbar.css
│       │   ├── results.css
│       │   └── seatselection.css
│       │
│       ├── App.css
│       ├── App.jsx
│       ├── Checkout.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── index.html
│       ├── package.json
│       ├── package-lock.json
│       ├── vite.config.js
│       └── README.md
│
├── .gitignore
└── package.json

