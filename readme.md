# Recruitment App — Backend (Node.js + Express + MongoDB)

Backend for the Recruitment App prototype.  
Provides authentication, job posting, application handling, resume upload, and applicant scoring endpoints expected by the frontend.

---

## Table of contents
- [Quick Start](#quick-start)  
- [Prerequisites](#prerequisites)  
- [Environment Variables](#environment-variables)  
- [Install & Run](#install--run)  
- [API Endpoints (summary)](#api-endpoints-summary)  
- [Data Models (summary)](#data-models-summary)  
- [Example Requests (curl)](#example-requests-curl)  
- [Resume upload & storage](#resume-upload--storage)  
- [Authentication & Security notes](#authentication--security-notes)  
- [Deployment notes](#deployment-notes)  
- [Troubleshooting](#troubleshooting)  
- [Tests & QA](#tests--qa)
- [License](#license)

---

## Quick Start

1. Copy `.env.example` to `.env` and fill in values.  
2. Install dependencies and run:

```bash
npm install
npm run dev        # development (nodemon)
npm start          # production (node)
```

## Prerequisites

*   Node.js v16+
*   `npm` or `yarn`
*   MongoDB (Atlas or local)
*   Optional: Cloudinary account for resume storage (or any file store accessible via URL)

## Environment Variables

Create a `.env` file at project root with these keys:

```ini
PORT=8050
MONGO_URI=mongodb://localhost:27017/recruitment-app
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

*   `MONGO_URI` — MongoDB connection string.
*   `JWT_SECRET` — secret for signing JWTs.
*   Cloudinary keys are optional but recommended for resume uploads.

## Install & Run

```bash
git clone <repo>
cd backend
npm install

# development
npm run dev

# production build (if any build step) and run
npm start
```

Typical `package.json` scripts used:

```json
{
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  }
}
```

## API Endpoints (summary)

### Auth

| Method | Endpoint | Description | Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register user | `{ name, email, password, role: 'applicant'\|'employer', phone? }` | `{ message, user, token }` |
| `POST` | `/auth/login` | Login | `{ email, password }` | `{ message, user, token }` |
| `GET` | `/auth/profile` | Get profile **(protected)** | `Header: Authorization: Bearer <token>` | `user` object |

### Jobs

| Method | Endpoint | Description | Body | Protection |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/jobs/create` | Create a job | `{ title, description, company, location, skillsRequired: [] , postedBy }` | **Employer** |
| `GET` | `/jobs` | List all jobs | - | Public |
| `GET` | `/jobs/user/:userId` | List jobs posted by a user (employer) | - | Public |

### Applications

| Method | Endpoint | Description | Body | Protection |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/applications/apply` | Apply to a job (multipart/form-data with resume file or `resumeUrl` + applicant info). | `jobId, userId, resumeUrl (or resume file), parsedText, score` | **Protected** |
| `GET` | `/applications/job/:jobId` | List applicants for a job (sorted by score desc) | - | **Protected** |

**Note:** All protected routes expect `Authorization: Bearer <token>` header. The frontend in this project stores the JWT in cookie `auth_token` and sends it with requests as needed.

## Data Models (summary)

### User

```javascript
{
  _id,
  name: String,
  email: String,
  password: String, // hashed
  role: 'applicant'|'employer',
  phone: String,
  resumeUrl: String
}
```

### Job

```javascript
{
  _id,
  title,
  description,
  company,
  location,
  skillsRequired: [String],
  postedBy: ObjectId (ref User),
  applicants: [ObjectId] (ref Application),
  createdAt,
  appliedcount: Number
}
```

### Application

```javascript
{
  _id,
  jobId: ObjectId,
  userId: ObjectId (or populated user object),
  resumeUrl: String,
  score: Number,     // AI match score
  appliedAt: Date
}
```

## Example Requests (curl)

### Register:

```bash
curl -X POST http://localhost:8050/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Parth","email":"p@example.com","password":"pass123","role":"applicant"}'
```

### Login:

```bash
curl -X POST http://localhost:8050/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"p@example.com","password":"pass123"}'
```

### Create job (requires token):

```bash
curl -X POST http://localhost:8050/jobs/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Backend Dev","description":"API work","company":"Acme","location":"Remote","skillsRequired":["node","sql"],"postedBy":"<userId>"}'
```

### Apply to job (multipart with file):

```bash
curl -X POST http://localhost:8050/applications/apply \
  -H "Authorization: Bearer <TOKEN>" \
  -F "jobId=<jobId>" \
  -F "userId=<userId>" \
  -F "resume=@/path/to/resume.pdf"
```

### List applicants for job:

```bash
curl http://localhost:8050/applications/job/<jobId>
```

## Resume upload & storage

*   **Option A (recommended):** upload resumes to Cloudinary (or S3) and store the public URL in `Application.resumeUrl`.
*   **Option B:** store in server filesystem (not recommended for production).

After upload, parse resume text (pdf -> text) and run match-score pipeline; store score in the `Application` record.

## Authentication & Security notes

*   Passwords must be hashed using `bcrypt` (example shown in controllers).
*   Sign JWTs with `JWT_SECRET`. Tokens returned to frontend; ideally backend should set `httpOnly`, `Secure` cookies for production.
*   Validate request bodies (required fields) and check roles (only employer may create jobs).
*   Implement rate limiting and input sanitization in production.

## Deployment notes

*   Use environment variables in your host (Render / Heroku / AWS / DigitalOcean).
*   Ensure `MONGO_URI` points to a production-grade MongoDB (Atlas recommended).
*   If serving frontend from the same server, serve the built static folder and add a wildcard route that returns `index.html` for SPA routing.

Example Express static serve:

```javascript
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));
```

## Troubleshooting

*   **404 on frontend routes after deploy:** configure server rewrites or use hash-based routing for the SPA.
*   **CORS:** enable CORS for your frontend origin during dev.
*   **Token not accepted:** check `Authorization` header format and `JWT_SECRET` mismatch between environments.

## Tests & QA

*   Add unit tests for critical utilities (JWT middleware, scoring logic, parsing).
*   Run integration tests to simulate apply → score → display flow.
*   Test with a set of sample resumes and job descriptions to validate ranking stability.
