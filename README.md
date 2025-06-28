<div align="center">
    <img src="./public/Code.png" height="80px"></img>
</div>


# AuthLab API

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![Jest](https://img.shields.io/badge/Jest-Testing-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🔐 Overview

**AuthLab API** is a robust authentication service built with Node.js, TypeScript, and Express. It provides secure user registration, login, and JWT-based authentication with comprehensive testing and Docker support.

---

## ✨ Features

- 🔒 JWT-based authentication with refresh tokens
- 👤 User registration and login
- 🛡️ Password hashing with bcrypt
- 📊 Input validation with Joi
- 🚦 Rate limiting and security headers
- 📚 Swagger API documentation
- 🧪 Comprehensive testing (unit & integration)
- 🐳 Docker containerization
- 🔄 CI/CD ready
- ☁️ SST for ECS deploy in AWS

---

## 🏗️ Project Structure

```bash
auth-lab/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── index.ts               # Application entry point
│   ├── config/
│   │   ├── database.ts        # MongoDB connection
│   │   └── env.ts             # Environment configuration
│   ├── controllers/
│   │   ├── auth.controller.ts # Authentication logic
│   │   └── user.controller.ts # User management
│   ├── middlewares/
│   │   ├── auth.middleware.ts # JWT verification
│   │   └── validate.middleware.ts # Input validation
│   ├── models/
│   │   └── user.model.ts      # User schema
│   ├── routes/
│   │   ├── auth.routes.ts     # Auth endpoints
│   │   └── user.routes.ts     # User endpoints
│   ├── validations/
│   │   ├── auth.validation.ts # Auth validation schemas
│   │   └── user.validation.ts # User validation schemas
│   ├── types/
│   │   └── express.d.ts       # Type definitions
│   └── docs/
│       └── openapi.yaml       # API documentation
├── tests/
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── setup.ts               # Test configuration
├── Dockerfile                 # Docker configuration
└── docker-compose.yml         # Multi-container setup
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/Veras-D/auth-lab.git
cd auth-lab
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Configure your environment variables:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth-db
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

---

## 📚 API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | User login |
| GET | `/api/auth/profile` | Get user profile |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/token/refresh` | Refresh JWT token |
| GET | `/api/users` | Get all users |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Unit Tests

```bash
npm run test:unit
```

### Integration Tests

```bash
npm run test:integration
```

### Test Coverage

```bash
npm run test:coverage
```

### Watch Mode

```bash
npm run test:watch
```

---

## 🐳 Docker Deployment

### Build and Run

```bash
npm run docker:build
npm run docker:run
```

### Development with Docker Compose

```bash
npm run docker:dev
```

### Production with Docker Compose

```bash
npm run docker:prod
```

---

## 🚀 Deploy to Render

1. Fork this repository
2. Connect your GitHub account to Render
3. Create a new Web Service
4. Configure environment variables
5. Deploy automatically on git push

### Render Configuration

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment**: Node.js
- **Instance Type**: Free tier compatible

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Build TypeScript to JavaScript |
| `start` | Start production server |
| `test` | Run all tests |
| `test:unit` | Run unit tests only |
| `test:integration` | Run integration tests only |
| `test:watch` | Run tests in watch mode |
| `test:coverage` | Generate test coverage report |
| `test:ci` | Run tests for CI/CD |
| `lint` | Run ESLint |
| `docker:build` | Build Docker image |
| `docker:run` | Run Docker container |

---

## 🛠️ Technologies

- **Node.js** - Runtime environment
- **TypeScript** - Type safety
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Joi** - Input validation
- **Jest** - Testing framework
- **Swagger** - API documentation
- **Docker** - Containerization

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS protection
- Security headers with Helmet
- Input validation and sanitization

---

## 📄 License

[MIT](LICENSE)

---

## ☕ Support

[![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/verivi)

---

<div align="center">
  <p>© 2025 VERAS. All rights reserved.</p>
</div>
