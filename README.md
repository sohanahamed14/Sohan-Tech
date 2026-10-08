# SOHAN TECH ⚡

Modern, responsive e-commerce web platform for mobiles, laptops, chargers, drones, and tech accessories.

[![Live Demo](https://img.shields.io/badge/Live_Demo-sohantech.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://sohantech.vercel.app)
[![Database](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 🌐 Live Store
Visit the live deployment: **[https://sohantech.vercel.app](https://sohantech.vercel.app)**

---

## ✨ Features
- **Categorized Tech Catalog**: Smartphones, Laptops, Chargers, Accessories, and Drones with live brand filters.
- **Client-Side Cart Engine**: IndexedDB offline persistence with seamless multi-item cart management.
- **Order Tracking & Management**: Full receipt generation, receipt printing, and status monitoring.
- **User Authentication**: Secure Login, Registration, and Profile sync powered by Supabase & REST API.
- **Modern Responsive Design**: Adaptive dark/light theme switching with glassmorphism UI.

---

## 📁 Project Structure

```text
SOHAN TECH/
├── index.html                     # Main storefront entry point
├── README.md                      # Documentation
├── vercel.json                    # Routing and deployment rules
├── pages/                         # Category & functional pages
│   ├── accessories.html
│   ├── account.html
│   ├── chargers.html
│   ├── drones.html
│   ├── laptops.html
│   ├── mobiles.html
│   ├── orders.html
│   └── support.html
├── css/                           # Design system & stylesheets
│   └── style.css
├── js/                            # Application JavaScript
│   ├── api.js                     # Supabase & backend API integration
│   ├── app.js                     # Catalog, cart, checkout & UI logic
│   └── db.js                      # IndexedDB local storage engine
├── images/                        # Static media assets & category icons
└── backend/                       # API routes & database schemas
    ├── api/                       # Auth, cart, orders, newsletter endpoints
    ├── config/                    # Database and CORS configurations
    ├── helpers/                   # Auth and response utilities
    ├── schema.sql                 # MySQL schema
    ├── supabase_schema.sql        # Supabase PostgreSQL schema
    └── supabase_rls.sql           # Row Level Security policies
```

---

## 🛠️ Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3, IndexedDB API
- **Database & Cloud**: Supabase (PostgreSQL), MySQL
- **Hosting**: Vercel

---

## 📄 License
MIT License.
