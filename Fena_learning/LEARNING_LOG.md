# 📚 Fena Learning Log — Commands, Packages & Tools

This file tracks every command run, library installed, and file created step-by-step with a short explanation of its purpose.

---

## 🚀 Step 1: Project Root Setup (`Fenaria/`)

### 1. Root Orchestrator & Multi-Package Architecture
- **Files Created**: `package.json`
- **Command Executed**:
  ```bash
  npm install
  ```
- **Installed Packages**:
  - `concurrently` (v9.1.2)
    - **Use**: Runs multiple commands in parallel inside a single terminal with color-coded log streams.
- **Why 3 `package.json` and 3 `node_modules` folders?**
  - **Root (`package.json`)**: Acts as the project orchestrator/remote control. Its `node_modules` contains only developer orchestration tools like `concurrently`.
  - **`backend/package.json`**: Strictly defines server-side libraries (`express`, `mongoose`, `bcryptjs`, `jsonwebtoken`). Its dependencies never leak into the frontend.
  - **`frontend/package.json`**: Strictly defines client-side UI libraries (`react`, `react-router-dom`, `vite`). The Node server never bundles these.
  - **Decoupling Benefit**: Prevents dependency bloat, secures database credentials, and allows Render to host the backend as a Web Service and the frontend as a zero-cost Static Site.
- **Execution Lifecycle**:
  - `npm install` (in root): Installs `concurrently` to root `node_modules`.
  - `npm run dev` (in root): Reads root `package.json` scripts and triggers `concurrently "npm run dev --prefix backend" "npm run dev --prefix frontend"`, launching both Express (port 5000) and Vite (port 5173) in one single terminal.
  - `npm run backend`: Runs only the backend API server.
  - `npm run frontend`: Runs only the React frontend server.

---

## 🛠️ Step 2: Backend Setup (`backend/`)

### 1. Backend Dependencies Installation
- **Files Created**: `backend/package.json`, `backend/.env`, `backend/.env.example`
- **Command Executed**:
  ```bash
  cd backend
  npm install
  ```
- **Installed Packages & Purpose**:
  - `express` (v4.21.2)
    - **Use**: Core Node.js web framework to create servers, routes, and REST API endpoints.
  - `mongoose` (v8.9.2)
    - **Use**: Connects Node.js to MongoDB Atlas, enforces schemas (like `User`), and executes database queries.
  - `dotenv` (v16.4.7)
    - **Use**: Loads sensitive configuration (database URI, JWT secret, ports) from `.env` into `process.env`.
  - `cors` (v2.8.5)
    - **Use**: Cross-Origin Resource Sharing middleware that allows the frontend (`http://localhost:5173`) to call the backend (`http://localhost:5000`).
  - `bcryptjs` (v2.4.3)
    - **Use**: Hashes user passwords with random salt rounds so raw passwords are never saved in the database.
  - `jsonwebtoken` (v9.0.2)
    - **Use**: Generates signed JWT tokens upon login/signup and validates them in protected routes.

### 2. Backend Files Created
- `config/db.js`: Mongoose database connection script.
- `models/User.js`: MongoDB Customer Schema with pre-save password hashing and `comparePassword` method.
- `middleware/authMiddleware.js`: Extracts and verifies Bearer JWT token from HTTP headers.
- `controllers/authController.js`: Customer registration, login, logout, and `/me` profile logic.
- `routes/authRoutes.js`: Maps endpoints (`/register`, `/login`, `/logout`, `/me`) to controller functions.
- `server.js`: Express app initialization, CORS, JSON parsing, health check route (`/api/health`).

### 3. Cloud Database Configuration (MongoDB Atlas)
- **Configured Variable**: `MONGO_URI` in `backend/.env`
- **Cluster**: Free M0 Sandbox on AWS (Mumbai `ap-south-1`)
- **Connection Test**: Verified connection via Mongoose with TLS/SSL.
- **Use**: Stores all application data in the cloud so both your local PC and Render production can read/write data seamlessly for free.

---

## ⚛️ Step 3: Frontend Setup (`frontend/`)

### 1. Vite + React Project Scaffolding
- **Command Executed**:
  ```bash
  npx -y create-vite@latest frontend --template react --no-immediate --no-interactive
  ```
- **Purpose**: Creates a modern React 18 single-page application powered by Vite for instant hot-module-replacement (HMR) and fast production builds.

### 2. Frontend Dependencies Installation
- **Command Executed**:
  ```bash
  cd frontend
  npm install
  npm install react-router-dom axios lucide-react
  ```
- **Installed Packages & Purpose**:
  - `react-router-dom` (v7.x)
    - **Use**: Handles client-side navigation between pages (e.g., `/login`, `/register`, `/`) without reloading the browser.
  - `axios` (v1.x)
    - **Use**: Makes HTTP requests to the backend API (`GET`, `POST`, `PUT`, `DELETE`).
  - `lucide-react` (v0.x)
    - **Use**: Lightweight, beautiful icon set (Mail, Lock, Eye, EyeOff, Sparkles, MapPin, etc.).

### 3. Frontend Files Created
- `src/api/axiosClient.js`: Configured Axios instance with baseURL and automatic Bearer token interceptor.
- `src/context/AuthContext.jsx`: React Context managing user authentication state, token storage in `localStorage`, login, register, and logout.
- `src/index.css`: Complete art studio design system with dark luxury theme, custom variables, glassmorphism, and responsive inputs.
- `src/pages/customer/Login.jsx`: Customer sign-in page with ambient glow, password visibility toggle, and error alerts.
- `src/pages/customer/Register.jsx`: Customer registration page with password confirmation and optional shipping fields.
- `src/App.jsx`: Main routing setup wrapping all routes inside `AuthProvider` and `BrowserRouter`.

---

## 🔧 Step 4: MongoDB Connection & Error Handling Resilience

### 1. Issue Diagnosed
- **Error**: `MongooseError: Operation 'users.findOne()' buffering timed out after 10000ms` & `Could not connect to any servers in your MongoDB Atlas cluster`.
- **Root Cause**: MongoDB Atlas Network Access did not include the current local IP address, causing Atlas to reject connection handshakes. Meanwhile, Mongoose's default 10-second query buffering obscured the root cause with a generic 500 error.

### 2. Code Enhancements Applied
- **Fast Fail in `backend/config/db.js`**:
  - Added `serverSelectionTimeoutMS: 5000` to fail fast within 5s instead of hanging for 30s.
  - Wrapped `dns.setServers` in error safety block to retain fallback DNS servers.
- **Accurate Error Propagation in `backend/controllers/authController.js`**:
  - Catches `MongooseError` and `MongoServerSelectionError` directly.
  - Returns clear HTTP 503 response explicitly directing the user to whitelist `0.0.0.0/0` in MongoDB Atlas Network Access.

---

## 🎨 Step 5: Frontend UI Harmonization & Typography Polish

### 1. Typography & Google Fonts Integration
- **Files Modified**: `frontend/index.html`, `frontend/src/index.css`
- **Purpose**: Integrated Google Font **`Inter`** (weights 300 to 700) with `-webkit-font-smoothing` and updated the default sans-serif font stack. This eliminates awkward fallback system fonts and ensures crisp, modern text rendering across Windows and mobile browsers.

### 2. Unified Landing & Authentication Pages (`App.jsx`, `Login.jsx`, `Register.jsx`)
- **Harmonized Design**: Applied the dark glassmorphic card container (`backdrop-filter: blur(16px)`), ambient blurred background (`/images/auth.png`), and luxury gradient buttons across Home, Sign In, and Sign Up pages.
- **Simplified Terminology**: Replaced creative phrasing with direct, standard terminology:
  - Header: *"Sign In"* and *"Sign Up"*
  - Subtitles: *"Sign in to your account"* and *"Sign up for a new account"*
  - Buttons: *"Sign In"* and *"Sign Up"*
  - Footer Links: *"Already have an account? Sign In"* and *"Don’t have an account? Sign Up"*
- **Dual Proper Action Buttons**: Home screen now features dedicated, full-prominence action buttons for both **Sign In** and **Sign Up** for guests, plus a streamlined user profile card with **Sign Out** for authenticated customers.

---

*(This log will be updated whenever a new package is installed, tool is configured, or feature command is executed).*
