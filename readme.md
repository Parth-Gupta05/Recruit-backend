# Backend

A minimal Node.js/Express backend starter used by the Recruitment App project. This repository contains a lightweight API server, DB connection helper (MongoDB), and example environment configuration. It's intentionally small so you can extend it to add routes, controllers, authentication, and file upload handling.

## Quick overview

- Runtime: Node.js (ES modules enabled via "type": "module" in `package.json`)
- Main file: `index.js`
- DB helper: `database/dbconnect.js`
- Dev tool: `nodemon` (already included as a dependency)

## Getting started (Windows / PowerShell)

1. Install dependencies

```powershell
cd backend
npm install
```

2. Copy and fill environment variables

There is a `.env-sample` with the expected variables. Create a `.env` in the `backend` folder and set the values:

```
PORT=3000
OPENAI_API_KEY=your-api-key
MONGODB_URL=your-mongodb-connection-string
```

3. Start the server in development mode

```powershell
npm run dev
```

The `dev` script runs `nodemon index.js`. The server will log the listening port when it starts.

Note: `index.js` currently imports `database/dbconnect.js` but the call to actually connect is commented out. If you want the server to connect to MongoDB on start, open `index.js` and uncomment the `connection()` call (and ensure `MONGODB_URL` is set).

## Project structure

```
backend/
	index.js               # app entrypoint
	package.json
	.env-sample
	database/
		dbconnect.js         # MongoDB connection helper
	controllers/           # (empty) place for controller logic
	middlewares/           # (empty) custom middleware
	models/                # (empty) Mongoose models
	routes/                # (empty) API routes
	utils/                 # (empty) helper utilities
```

## Contract (small)

- Input: HTTP requests to Express server (JSON body, form-data for file uploads)
- Output: JSON responses and standard HTTP status codes
- Error modes: server logs to console; missing DB connection will prevent DB operations but server may still start if connection is disabled

## Common tasks

- Run in dev: `npm run dev`
- Add a route: create a file under `routes/` and wire it up in `index.js`
- Add a model: create a Mongoose schema in `models/` and use it in controllers

## Quick sanity check (curl)

Once server is running (example PORT=3000):

```powershell
# simple GET if you add a route; otherwise just test that server listens
curl http://localhost:3000
```

## Troubleshooting

- "port is undefined" — set `PORT` in your `.env` (or use a default in `index.js`).
- DB not connecting — ensure `MONGODB_URL` is valid and `connection()` is uncommented in `index.js`.
- Missing modules/errors on startup — run `npm install` in `backend`.

## Next steps / suggestions

- Enable the DB connection in `index.js` and implement at least one route and model (for example: a `users` model and auth routes).
- Add basic validation and error handling middleware.
- Move config values into a small `config/` helper for environment-based defaults.

## License & author

ISC — author: Parth Gupta

