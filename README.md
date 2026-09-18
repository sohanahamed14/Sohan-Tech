# SOHAN TECH ⚡

Modern, responsive e-commerce web platform for mobiles, laptops, chargers, drones, and tech accessories.

## Project Structure

```
SOHAN TECH/
├── index.html                     # Main entry point (Root)
├── README.md                      # Documentation
├── vercel.json                    # Routing and rewrites
├── pages/                         # Secondary category & feature pages
│   ├── accessories.html
│   ├── account.html
│   ├── chargers.html
│   ├── drones.html
│   ├── laptops.html
│   ├── mobiles.html
│   ├── orders.html
│   └── support.html
├── css/                           # Stylesheets
│   └── style.css
├── js/                            # Application JavaScript
│   ├── api.js                     # Supabase & backend API integration
│   ├── app.js                     # Catalog, cart, checkout & UI logic
│   └── db.js                      # IndexedDB local storage engine
├── images/                        # Static media assets
│   ├── accessories/
│   ├── banners/
│   ├── categories/
│   ├── chargers/
│   ├── drones/
│   ├── icons/
│   ├── laptops/
│   └── mobiles/
└── backend/                       # PHP API & SQL schemas
    ├── api/                       # Auth, cart, orders, newsletter endpoints
    ├── config/                    # Database and CORS configurations
    ├── helpers/                   # Auth and response utilities
    ├── schema.sql                 # MySQL schema
    ├── supabase_schema.sql        # Supabase PostgreSQL schema
    └── supabase_rls.sql           # Row Level Security policies
```

## Features
- **Categorized Catalog**: Smartphones, Laptops, Chargers, Accessories, and Drones.
- **Client-Side Cart**: IndexedDB persistence with smooth sync.
- **Order Tracking & Management**: Full receipt generation, printing, and status tracking.
- **User Authentication**: Login, register, profile update via Supabase / backend API.
- **Responsive & Dark/Light Mode**: Premium modern design with adaptive glassmorphism.
