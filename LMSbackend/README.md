Laravel LMS — DevSecOps Implementation

First and foremost, I would like to thank Muhamet Ali for developing and open-sourcing the LMSbackend project, which serves as the foundation for this implementation.

This repository focuses on integrating DevSecOps principles, automated CI/CD pipelines, application security, containerization, and AWS cloud deployment into an existing Laravel-based Learning Management System (LMS).

The objective is to establish a secure, automated, reliable, and scalable software delivery process by integrating security controls throughout the application lifecycle, standardizing deployment procedures, and applying production-oriented infrastructure and operational practices.

The original LMS application is maintained by its respective author. This repository focuses on the DevSecOps architecture, automation, security integrations, infrastructure configuration, and deployment workflow implemented around the application.

Project Objectives

CI/CD Automation: Establish automated build, testing, security validation, and deployment pipelines.

Containerization: Package the application using Docker with optimized and security-conscious container configurations.

Security Integration: Incorporate source code analysis, secret detection, dependency vulnerability scanning, and container image scanning.

Secure Configuration: Implement appropriate secrets management, environment configuration, and access controls.

AWS Cloud Deployment: Design and deploy the application using AWS infrastructure and cloud security best practices.

Infrastructure as Code: Automate infrastructure provisioning and configuration where applicable.

Monitoring and Observability: Integrate logging, health checks, monitoring, and operational visibility.

Reliability and Scalability: Apply deployment strategies and infrastructure practices that support maintainability, availability, and future growth.





# Laravel LMS Backend — Learning Management System API

This repository contains a production-ready Learning Management System (LMS) backend built using the Laravel framework.
The system is designed with a modular architecture, clear role separation, API-driven structure, and secure authentication flows.
It includes full support for course management, lessons, quizzes, e-commerce order flow, user progress tracking, messaging, and platform administration.

---

## 1. Project Overview

This backend provides a complete LMS infrastructure and exposes RESTful API endpoints for:

* User authentication and role-based authorization
* Course and lesson creation, management, and delivery
* Quiz and question management
* E-commerce features such as cart operations, order creation, and order history
* Student learning progress tracking
* Favorites management
* Messaging between users and administrators
* Administrative dashboards and analytics
* Full SuperAdmin control panel

The project follows industry standards regarding route structure, middleware usage, validation, security, and scalability.

---

## 2. System Features

### 2.1 Authentication and Authorization

* Laravel Sanctum token-based authentication
* Role-based access control for **User**, **Admin**, and **SuperAdmin**
* Separate login throttling (`throttle:login`)
* Global rate limiting for all API endpoints (`throttle:api`)
* Secure logout mechanism
* Validation of all incoming input data

### 2.2 SuperAdmin Capabilities

* Create and remove admin accounts
* Manage all categories (create, update, delete)
* Manage global site settings
* Approve courses before publication
* Access and control all conversations/messages
* Access system-wide analytics and revenue data
* Manage all orders and view detailed order records

### 2.3 Admin Capabilities

* Create, update, and delete owned courses
* Upload course images
* Manage lessons, including video/document uploads
* Create, update, and delete quizzes and questions
* Access an admin dashboard with stored analytics
* View only their own created courses

### 2.4 User (Student) Capabilities

* Browse courses, categories, and course details
* Add items to the cart and complete orders
* View order history
* Mark lessons as watched and track progress
* Retrieve course content and continue lessons
* Add and remove favorite lessons and courses
* Send messages and view inbox
* Manage personal profile and password updates

### 2.5 Course and Lesson Features

* Multi-level course structure
* Lessons support multiple file formats:

  * Video (`mp4`, `mov`, `ogg`, `qt`)
  * Documents (`pdf`, `doc`, `docx`, `xls`, `xlsx`, `ppt`, `pptx`)
  * Images
* Each course can have multiple lessons and quizzes
* Course status ("approved" or not) is enforced by the SuperAdmin

### 2.6 E-Commerce and Orders

* Add to cart, remove from cart, view cart
* Place orders with total price calculation
* View user-specific order history
* Admin and SuperAdmin order management
* Order detail inspection
* Revenue analytics and growth reporting

### 2.7 Messaging System

* User-to-admin messaging channel
* Admin and SuperAdmin can view all messages
* Messages grouped by conversations
* Secure conversation deletion (admin only)

### 2.8 Progress Tracking

* Track watched lessons
* Retrieve complete watch history
* Display progress for each course
* Continue from last watched lesson

### 2.9 Favorites

* Add/remove favorite courses
* Add/remove favorite lessons
* Retrieve favorite items at any time

---

## 3. Project Structure

```
app/
 └── Http/
      ├── Controllers/
      │     ├── AuthController.php
      │     ├── AdminController.php
      │     ├── CartController.php
      │     ├── CategoryController.php
      │     ├── CoursesController.php
      │     ├── LessonController.php
      │     ├── QuizController.php
      │     ├── ChatController.php
      │     ├── OrderController.php
      │     ├── OrderManagementOrderController.php
      │     ├── UserProfileController.php
      │     ├── WatchedLessonController.php
      │     └── FavoriteController.php
      └── Middleware/
bootstrap/
config/
database/
public/
resources/
routes/
 ├── api.php
 └── web.php
storage/
```

The `api.php` file uses structured route groups with prefixes and middleware:

* `/superadmin/...`
* `/admin/...`
* `/user/...`
* Public/guest endpoints without authentication

This ensures maximum clarity, maintainability, and separation of concerns.

---

## 4. Installation

### 4.1 Clone the Repository

```
git clone https://github.com/your-username/LMSbackend.git
cd LMSbackend
```

### 4.2 Install Dependencies

```
composer install
```

### 4.3 Create Environment File

```
cp .env.example .env
php artisan key:generate
```

### 4.4 Configure Database in `.env`

```
DB_DATABASE=lms
DB_USERNAME=root
DB_PASSWORD=yourpassword
```

### 4.5 Run Migrations

```
php artisan migrate --seed
```

### 4.6 Start Development Server

```
php artisan serve
```

---

## 5. Docker Deployment

The project supports Docker for containerized deployment.

### Start containers:

```
docker-compose up -d
```

### Services Provided

* PHP-FPM
* Nginx
* MySQL
* Redis

API available at:

```
http://localhost:8000
```

---

## 6. API Overview

### 6.1 Public Endpoints

* `POST /login`
* `POST /admin/login`
* `POST /register`
* `GET  /settings`
* `GET  /courses`
* `GET  /courses/popular`
* `GET  /courses/new`
* `GET  /course/{id}`
* `GET  /categories`
* `GET  /category/{id}`

### 6.2 Authenticated User Endpoints

Includes:

* Cart operations
* Order creation and history
* Profile management
* Favorites
* Lesson progress
* Messaging

### 6.3 Admin Endpoints

Includes:

* Course creation and update
* Lesson management
* Quiz management
* Dashboard data

### 6.4 SuperAdmin Endpoints

Includes:

* Admin creation and deletion
* Category CRUD
* Course approval
* Site setting management
* Sales analytics
* Order management
* Platform-wide messaging control

---

## 7. Security Features

The backend implements industry-standard security mechanisms:

* Laravel Sanctum authentication
* Role-based access middleware
* Login rate-limiting
* API throttling
* Full request validation
* CORS configuration
* File upload validation (MIME and size limits)
* CSRF protection for web routes
* Authorization gates and policies (role layers)

---

## 8. License

This project is licensed under the **MIT License**.


