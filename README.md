# 🎓 E-Learning Platform

<p align="center">
  <strong>A Full-Stack Online Learning Platform Built with the MERN Stack</strong>
</p>

<p align="center">
  <a href="YOUR_VERCEL_LINK">🌐 Live Demo</a>
  •
  <a href="https://github.com/ichadni/E_Learning_App">📂 GitHub Repository</a>
  •
  <a href="YOUR_RENDER_LINK">⚙️ Backend API</a>
</p>

<p align="center">

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)

</p>

---

## 📖 About The Project

**E-Learning Platform** is a full-stack web application developed using the **MERN stack** to provide a modern and structured digital learning experience.

The application follows a client-server architecture:

* **React + Vite** powers the frontend.
* **Node.js + Express.js** provides the backend REST API.
* **MongoDB + Mongoose** manages application data.
* **Cloudinary** is used for cloud-based media handling.
* **JWT and bcrypt** are used as part of the authentication and security layer.

The project is organized into independent `frontend` and `server` applications, making the codebase easier to develop, maintain, and deploy independently.

---

# ✨ Key Features

### 👤 User Management

* User registration and authentication
* Secure password handling
* JWT-based authentication
* User profile management
* Email-related functionality
* Account verification functionality

### 📚 Course Management

* Course creation and management
* Course browsing
* Course details
* Structured course content
* Lesson-based learning workflow

### 📝 Learning & Lessons

* Organized lesson content
* Course-based learning structure
* User-friendly learning interface
* Dynamic course and lesson navigation

### 💳 Payment System

* Payment-related backend functionality
* Dedicated payment routes
* Secure server-side payment processing architecture

### 🔔 Notifications

* Notification management
* Backend notification routes
* User-oriented notification workflow

### 🖼️ Media Management

* Image/file upload support
* Cloudinary integration
* Multer-based upload handling

### 🔐 Security

* JWT authentication
* Password hashing with bcrypt
* Environment-variable configuration
* CORS configuration
* Protected backend routes
* Server-side validation and authorization

---

# 🛠️ Technology Stack

## Frontend

| Technology       | Purpose                       |
| ---------------- | ----------------------------- |
| React.js         | UI development                |
| Vite             | Frontend build tool           |
| JavaScript       | Application logic             |
| React Router     | Client-side routing           |
| Axios            | API communication             |
| React Icons      | UI icons                      |
| React Hot Toast  | Notifications                 |
| Google reCAPTCHA | Bot protection / verification |

The frontend dependencies and Vite configuration are defined in the repository's `frontend/package.json`.

---

## Backend

| Technology | Purpose                    |
| ---------- | -------------------------- |
| Node.js    | Server-side runtime        |
| Express.js | REST API framework         |
| Mongoose   | MongoDB object modeling    |
| MongoDB    | Database                   |
| JWT        | Authentication             |
| bcrypt     | Password hashing           |
| CORS       | Cross-origin communication |
| Multer     | File upload handling       |
| Cloudinary | Cloud media storage        |
| Nodemailer | Email functionality        |
| UUID       | Unique identifiers         |
| dotenv     | Environment configuration  |

These dependencies are present in the project's backend package configuration.

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │        USER         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React + Vite      │
                         │      Frontend       │
                         │       Vercel        │
                         └──────────┬──────────┘
                                    │
                              HTTP / REST API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Express.js      │
                         │      REST API       │
                         │       Render        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Node.js        │
                         │   Server Logic      │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
             ┌────────────┐  ┌────────────┐  ┌────────────┐
             │  MongoDB   │  │ Cloudinary │  │   Email    │
             │  Database  │  │   Media    │  │  Service   │
             └────────────┘  └────────────┘  └────────────┘
```

The backend entry point configures Express, JSON parsing, CORS, API routes, and database connection. The current implementation exposes user, course, admin, notification, and payment route groups under `/api`.

---

# 🔄 Application Workflow

```text
User
  │
  ▼
React Frontend
  │
  │ Axios
  ▼
REST API
  │
  ▼
Express.js
  │
  ├── Authentication
  ├── User Management
  ├── Course Management
  ├── Admin Operations
  ├── Notifications
  └── Payments
  │
  ▼
Business Logic
  │
  ├──────────────┐
  ▼              ▼
MongoDB      Cloudinary
```

---

# 📂 Project Structure

The repository currently separates the application into `frontend` and `server` directories.

```text
E_Learning_App/
│
├── frontend/
│   │
│   ├── public/
│   ├── src/
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   │
│   ├── .env.example
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

# 📸 Application Screenshots

> Place your 10 PNG screenshots inside a `screenshots/` directory in the repository.

```text
screenshots/
├── 01-home.png
├── 02-login.png
├── 03-dashboard.png
├── 04-courses.png
├── 05-course-details.png
├── 06-lessons.png
├── 07-create-course.png
├── 08-verification.png
├── 09-notifications.png
└── 10-responsive.png
```

## 01. Home Page

<p align="center">
  <img src="./screenshots/01-home.png" width="92%" alt="E-Learning Platform Home Page">
</p>

---

## 02. Authentication

<p align="center">
  <img src="./screenshots/02-login.png" width="92%" alt="Authentication Interface">
</p>

---

## 03. Dashboard

<p align="center">
  <img src="./screenshots/03-dashboard.png" width="92%" alt="E-Learning Dashboard">
</p>

---

## 04. Courses

<p align="center">
  <img src="./screenshots/04-courses.png" width="92%" alt="Course Management">
</p>

---

## 05. Course Details

<p align="center">
  <img src="./screenshots/05-course-details.png" width="92%" alt="Course Details">
</p>

---

## 06. Lessons

<p align="center">
  <img src="./screenshots/06-lessons.png" width="92%" alt="Lesson Management">
</p>

---

## 07. Course / Content Creation

<p align="center">
  <img src="./screenshots/07-create-course.png" width="92%" alt="Course Creation">
</p>

---

## 08. Verification

<p align="center">
  <img src="./screenshots/08-verification.png" width="92%" alt="Verification System">
</p>

---

## 09. Notifications

<p align="center">
  <img src="./screenshots/09-notifications.png" width="92%" alt="Notification System">
</p>

---

## 10. Responsive Interface

<p align="center">
  <img src="./screenshots/10-responsive.png" width="92%" alt="Responsive Interface">
</p>

---

# 🎥 Project Demonstration

A complete walkthrough of the application is available in the project demonstration video.

<p align="center">

**▶️ [Watch the Full Project Demonstration](YOUR_VIDEO_LINK)**

</p>

The demonstration showcases the application's major workflows, interface, and core functionality.

---

# 🚀 Getting Started

Follow the instructions below to run the project locally.

## 📋 Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm
* Git
* MongoDB / MongoDB Atlas
* A code editor such as VS Code

Verify the installation:

```bash
node --version
npm --version
git --version
```

---

# 📥 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/ichadni/E_Learning_App.git
```

```bash
cd E_Learning_App
```

---

# 💻 Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Configure the required environment variables.

Start the development server:

```bash
npm run dev
```

The Vite development server will normally be available at:

```text
http://localhost:5173
```

The frontend package defines Vite development, build, lint, and preview scripts.

---

# ⚙️ Backend Setup

Open a new terminal and navigate to:

```bash
cd E_Learning_App/server
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Configure the required environment variables.

Start the development server:

```bash
npm run dev
```

For production:

```bash
npm start
```

The backend currently uses `npm run dev` for Nodemon development and `npm start` to run `node index.js`.

---

# 🔐 Environment Variables

## Backend

Create:

```text
server/.env
```

Example structure:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

Use the exact variable names required by your implementation.

## Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000
```

---

# ⚠️ Security

**Never commit sensitive credentials to GitHub.**

Do not expose:

```text
.env
API keys
Database credentials
JWT secrets
Cloudinary secrets
Email passwords
Payment credentials
```

Your repository currently shows a `server/.env` file in GitHub.

Before sharing the repository publicly:

1. Remove `server/.env` from the repository.
2. Add `.env` to `.gitignore`.
3. Keep `.env.example` with placeholder values.
4. Rotate any credentials that have already been exposed.

Example `.gitignore`:

```gitignore
node_modules/
.env
.env.local
.env.production
dist/
```

---

# 🌐 Deployment

## Frontend — Vercel

The React/Vite frontend can be deployed using **Vercel**.

```text
React + Vite
     │
     ▼
   Vercel
```

Configure the frontend environment variables in the Vercel project settings.

---

## Backend — Render

The Node.js + Express backend can be deployed using **Render**.

```text
Node.js
   +
Express.js
   │
   ▼
 Render
```

Configure the backend environment variables in Render.

The backend CORS configuration already reads `FRONTEND_URL`, falling back to the local Vite URL during development.

---

## Database — MongoDB

MongoDB is used as the application's primary database.

```text
Frontend
    │
    ▼
Backend API
    │
    ▼
MongoDB
```

For production deployment, MongoDB Atlas can be used as the cloud database provider.

---

# 🔌 API Architecture

The backend organizes functionality through separate route modules.

Current route groups include:

```text
/api
│
├── User Routes
├── Course Routes
├── Admin Routes
├── Notification Routes
└── Payment Routes
```

The current `server/index.js` mounts these route modules under `/api`.

---

# 🧪 Development Scripts

## Frontend

```bash
npm run dev
```

Start Vite development server.

```bash
npm run build
```

Create production build.

```bash
npm run preview
```

Preview production build.

```bash
npm run lint
```

Run ESLint.

These scripts are defined in the frontend project configuration.

---

## Backend

```bash
npm run dev
```

Start development server with Nodemon.

```bash
npm start
```

Start production server.

These scripts are defined in the backend package configuration.

---

# 📊 Technical Highlights

This project demonstrates practical experience with:

* Full-stack MERN development
* React component-based architecture
* RESTful API development
* Client-server communication
* MongoDB database integration
* Mongoose data modeling
* JWT authentication
* Password hashing
* File upload handling
* Cloudinary media management
* Email communication
* Payment-related backend integration
* Notification systems
* CORS configuration
* Environment-based configuration
* Git/GitHub version control
* Vercel deployment
* Render deployment

---

# 🧠 What I Learned

Through this project, I gained hands-on experience in designing and developing a complete full-stack application.

### Frontend

* Building reusable React components
* Managing application routing
* Connecting React applications with REST APIs
* Handling asynchronous API requests
* Creating responsive interfaces
* Managing frontend environment variables

### Backend

* Designing REST APIs
* Structuring Express applications
* Creating MongoDB models
* Implementing authentication
* Handling file uploads
* Integrating external services
* Managing middleware
* Configuring CORS

### Deployment

* Deploying React/Vite applications with Vercel
* Deploying Node.js/Express applications with Render
* Connecting production frontend and backend services
* Managing production environment variables

---

# 🔮 Future Improvements

Planned or potential improvements include:

* 🎥 Video-based learning
* 📝 Interactive quizzes and examinations
* 📊 Student progress tracking
* 🏆 Course completion certificates
* ⭐ Course reviews and ratings
* 💬 Student-instructor communication
* 🔔 Real-time notifications
* 📈 Advanced learning analytics
* 👨‍🏫 Dedicated instructor dashboard
* 💳 Enhanced payment workflow
* 🌙 Dark mode
* 📱 Improved mobile responsiveness
* 🔍 Advanced course search and filtering

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

### 1. Fork the Repository

Create your own fork of the project.

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature
```

### 3. Make Your Changes

Implement your feature or fix.

### 4. Commit

```bash
git add .
git commit -m "feat: add your feature"
```

### 5. Push

```bash
git push origin feature/your-feature
```

### 6. Create a Pull Request

Open a Pull Request from your feature branch.

---

# 🐛 Bug Reports & Suggestions

If you find a bug or have an improvement idea, please open an issue in the repository.

When reporting a bug, provide:

* Description
* Steps to reproduce
* Expected behavior
* Actual behavior
* Screenshots or logs when applicable

---

# 📄 License

This project is currently intended for **educational and portfolio purposes**.

If you plan to reuse or distribute the project, please contact the author regarding licensing and attribution.

---

# 👨‍💻 Author

## Ichadni

**Full-Stack Web Developer | MERN Stack Developer**

Interested in building practical, scalable, and user-focused web applications.

### Connect

<p align="left">

<a href="https://github.com/ichadni">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</a>

<a href="YOUR_LINKEDIN_PROFILE">
<img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
</a>

</p>

---

# ⭐ Support

If you found this project useful or interesting, consider giving the repository a ⭐.

Your support is greatly appreciated.

---

<p align="center">

### 💻 Built with the MERN Stack

**MongoDB • Express.js • React.js • Node.js**

</p>

<p align="center">
  <sub>Designed, developed, and deployed as a full-stack web application.</sub>
</p>
