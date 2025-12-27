# Face Recognition Brain – Backend API

This repository contains the backend REST API for the Face Recognition Brain application. It handles authentication, session management, user profiles, face detection requests, database persistence, and health monitoring.

---

## 🧩 Related Repositories

- 🔗 Frontend: https://github.com/ahung1709/facerecognitionbrain

  User authentication, image submission, and UI rendering

- 🔗 AWS Lambda (Rank Badge): https://github.com/ahung1709/rankly

  A lightweight serverless function that converts a user’s face-detection entry count into a visual rank badge (emoji)

---

## 🏗 Architecture Overview

The Face Recognition Brain application follows a decoupled, cloud-friendly architecture with separate frontend, backend, and serverless components.

Below is a high-level view of how the system components interact.

    [ Browser / React Frontend ]
        |
        | HTTPS (JWT in Authorization header)
        v
    [ Node.js / Express API ]
        |
        | SQL (Knex)
        v
    [ PostgreSQL (Neon) ]
        |
        | Session validation
        v
    [ Redis (Upstash) ]
        |
        | Image analysis
        v
    [ Clarifai API ]

    [ React Frontend ]
        |
        | HTTPS (rank query)
        v
    [ AWS Lambda (Rank Badge) ]

---

## 🛠 Tech Stack (Backend)

- Node.js
- Express
- PostgreSQL (Neon)
- Redis (Upstash)
- Knex.js
- JSON Web Tokens (JWT)
- Clarifai API
- Docker & Docker Compose
- GitHub Actions (scheduled health checks / keep-alive)
- Render (deployment)

---

## ⚙️ Environment Variables

This backend relies on environment variables for configuration and secrets management.

### Required Environment Variables

#### Authentication

```env
JWT_SECRET=your_jwt_secret
```

#### Clarifai API (Face Detection)

```env
CLARIFAI_PAT=your_clarifai_personal_access_token
CLARIFAI_USER_ID=your_clarifai_user_id
CLARIFAI_APP_ID=your_clarifai_app_id
CLARIFAI_MODEL_ID=your_model_id
CLARIFAI_MODEL_VERSION_ID=your_model_version_id
```

Used by the backend to submit images to Clarifai for face detection.

#### Database & Cache

The following are configured via Docker Compose for local development and via the hosting provider in production:

- DATABASE_URL – PostgreSQL connection string (Neon)
- REDIS_URL – Redis connection string (Upstash)
- PORT – Server port

---

## 🔐 Authentication & Session Management

- JWT is issued on user registration and sign-in
- JWTs are stored and validated via Redis
- Redis-backed session management allows:
  - Easy signout
  - Token invalidation
  - Additional security layer beyond stateless JWTs

---

## 📦 API Responsibilities

- User registration & authentication
- Profile retrieval and updates
- Image submission & face detection
- Entry count persistence
- Session validation
- Health and dependency monitoring

---

## 🤖 Face Detection Flow

1. Frontend submits image URL
2. Backend sends image to Clarifai API
3. Face detection data is returned
4. Entry count is incremented in PostgreSQL
5. Detection results are returned to frontend

---

## ❤️ Health Check Endpoints

- `GET /health` – Basic API health
- `GET /health/full` – API + PostgreSQL + Redis health
- `GET /health/ping` – Lightweight ping endpoint

Used by:

- GitHub Actions (scheduled keep-alive and monitoring)
- External cron services

These endpoints improve observability, enable automated uptime monitoring, and help detect infrastructure or dependency issues early.

---

## 🐳 Local Development (Docker)

- Docker
- Docker Compose

### Building the image and starting the container

```bash
docker-compose up --build
```

The API will be available at: http://localhost:3001

### Starting the container without rebuilding the image

```bash
docker-compose up
```

### Stopping the container

```bash
docker-compose down
```
