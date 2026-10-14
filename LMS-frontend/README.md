
# LMS Frontend (React)

This repository contains the React frontend for a Learning Management System (LMS).  
It consumes the Laravel-based LMS backend API and provides separate interfaces for students, admins, and super admins, including course browsing, authentication, cart and order workflows, lesson watching, messaging, and administrative dashboards.

---

## 1. Overview

The application is a single-page React application built with Create React App and Tailwind CSS.  
It communicates with the backend through Axios-based API services and manages global state using React Context.

Main responsibilities:

- Public landing pages, categories, and course listing
- Authentication and role-based access (user, admin, super admin)
- User dashboard: purchased courses, watched lessons, favorites, messaging
- Admin dashboard: course, lesson, and quiz management
- Super admin dashboard: admin management, category management, site settings, orders, analytics
- Integration with site-wide settings (logo, favicon, texts, contact information)

---

## 2. Features

### 2.1 Public Area

- View site settings (logo, name, hero text, contact info)
- List categories
- List courses
- View course details
- View popular and new courses
- Search functionality (if enabled)

### 2.2 User (Student) Area

- Register and login using API
- View and update profile
- Change password
- Add courses to cart, remove from cart, view cart
- Place orders and see order history
- Access purchased courses and lessons
- Watch lessons (video or document based)
- Track watched lessons and continue where the user left off
- Manage favorite courses
- Manage favorite lessons
- Send messages and view inbox conversations

### 2.3 Admin Area

(Located under `src/admin`)

- Dashboard for course statistics
- Create, update, and delete courses
- Upload and manage course images
- Create, update, and delete lessons for a course
- Upload lesson videos and documents
- Create, update, and delete quizzes and questions
- View only the courses owned by the admin

### 2.4 Super Admin Area

(Located under `src/superadmin`)

- Create and list admin accounts
- Delete admin accounts
- Manage categories (create, update, delete)
- Approve or reject courses
- Manage global site settings (logo, favicon, header text, buttons, social links, contact info)
- View all orders and order details
- Access sales analytics data (revenue, orders, etc.)
- View and delete conversations and messages across the system

---

## 3. Technology Stack

- React (Create React App)
- React Router
- Axios
- React Context API
- Tailwind CSS
- JavaScript (ES6+)

---

## 4. Project Structure

Based on the current structure:

```text
lms-front-end/
 ├── build/
 ├── node_modules/
 ├── public/
 ├── src/
 │    ├── admin/           # Admin dashboard pages and components
 │    ├── api/             # API request modules (public/auth/user/admin/superadmin)
 │    ├── components/      # Shared UI components (header, footer, layouts, etc.)
 │    ├── context/         # Context providers (auth, cart, settings)
 │    ├── pages/           # Public and user-facing pages
 │    ├── services/        # Axios instances, helper services
 │    ├── superadmin/      # Super admin dashboard pages and components
 │    ├── App.css
 │    ├── App.js
 │    ├── index.css
 │    ├── index.js
 │    ├── reportWebVitals.js
 │    └── setupTests.js
 ├── .gitignore
 ├── package-lock.json
 ├── package.json
 ├── postcss.config.js
 ├── tailwind.config.js
 └── README.md
````

---

## 5. Installation and Setup

### 5.1 Prerequisites

* Node.js (LTS)
* npm or yarn
* Running instance of the LMS backend API

### 5.2 Clone the Repository

```bash
git clone https://github.com/your-username/lms-front-end.git
cd lms-front-end
```

### 5.3 Install Dependencies

```bash
npm install
```

### 5.4 Environment Configuration

Create a `.env` file in the project root if it does not exist and configure the backend URLs:

```bash
REACT_APP_API_BASE_URL=https://your-backend-domain.com/api
REACT_APP_IMAGE_BASE_URL=https://your-backend-domain.com/
```

These values are used by the modules inside `src/api/` and `src/services/` for all HTTP requests and image paths.

### 5.5 Start Development Server

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

### 5.6 Build for Production

```bash
npm run build
```

The production-ready build will be generated in the `build/` directory.
This folder can be deployed to any static hosting provider (Vercel, Netlify, Nginx, cPanel, etc.).

---

## 6. Authentication and State Management

* Authentication tokens are stored in `localStorage` after a successful login.
* Protected routes check for the presence of a valid token and user role.
* React Context is used for:

  * Authentication state (current user, roles, token)
  * Cart state (items, count)
  * Global settings fetched from the backend

Axios interceptors (inside `services` or `api` modules) attach the token to outgoing requests for protected endpoints.

---

## 7. Backend Integration

The frontend expects the following main API groups to exist on the Laravel backend:

* Public endpoints for settings, categories, courses, and course details
* Auth endpoints for login, register, and logout
* User endpoints for profile, cart, orders, favorites, watched lessons, and messaging
* Admin endpoints for course, lesson, and quiz management
* Super admin endpoints for admin accounts, categories, site settings, orders, analytics, and conversations

All URL paths are configured in the files under the `src/api/` directory.

---

## 8. Testing

This project uses the default testing setup provided by Create React App (Jest + React Testing Library).

Typical test command:

```bash
npm test
```

---

## 9. License

This project is licensed under the MIT License.

```

