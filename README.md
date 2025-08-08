## Nutty

A minimal calorie log app built with Express and MongoDB. Includes JWT auth (access + refresh tokens), role-based access (user/admin), REST APIs, and static pages served from `public/`.

### Tech stack
- **Node.js + Express 5**
- **MongoDB + Mongoose 8**
- **JWT** for auth (access 15m, refresh 7d)
- **bcrypt** for password hashing
- **nodemon** for local dev

---

## Getting started

### Prerequisites
- Node.js (16.20+ recommended 18+)
- A MongoDB connection string

### Install
```bash
npm install
```

### Configure environment
Create a `.env` file in the project root:
```
PORT=3000
mongodb_uri=your_mongodb_uri
ACCESS_TOKEN_SECRET=replace_with_random_string
REFRESH_TOKEN_SECRET=replace_with_random_string
```

- **PORT**: optional (defaults to 3000)
- **mongodb_uri**: required
- **ACCESS_TOKEN_SECRET / REFRESH_TOKEN_SECRET**: required, use strong random values

### Run
```bash
# development (with reload)
npm run dev

# production
npm start
```

App will be available at `http://localhost:<PORT>`.

---

## Project structure
```
config/        # environment configuration
controllers/   # request handlers
middleware/    # auth + error handlers
models/        # mongoose schemas/models
routes/        # route definitions and API index
public/        # static files and pages (/, /login, /register, /dashboard)
app.js         # server bootstrap and wiring
```

---

## Frontend pages
- `/` → `public/homepage/homepage.html`
- `/login` → `public/loginpage/loginpage.html`
- `/register` → `public/registerpage/registerpage.html`
- `/dashboard` → `public/dashboardpage/dashboardpage.html`

---

## API overview

- Base URL: `http://localhost:<PORT>/api`
- Authentication: Bearer access token in the `Authorization` header
  - `Authorization: Bearer <access_token>`
- Tokens:
  - Access token: expires in 15 minutes
  - Refresh token: expires in 7 days
- Error format:
  - `{ "message": string, "stack"?: string }` (`stack` only in non-production)

---

## Endpoints

### Users
- POST `/api/users`
  - Create a user
  - Body:
    ```json
    { "name": "alice", "email": "a@example.com", "password": "secret123" }
    ```
  - Response (201):
    ```json
    { "id": "<id>", "name": "alice", "email": "a@example.com", "role": "user" }
    ```

- POST `/api/users/login`
  - Log in with username and password
  - Body:
    ```json
    { "name": "alice", "password": "secret123" }
    ```
  - Response:
    ```json
    { "access_token": "<jwt>", "refresh_token": "<jwt>" }
    ```

- POST `/api/users/refresh`
  - Exchange refresh token for a new access token
  - Body:
    ```json
    { "refresh_token": "<jwt>" }
    ```
  - Response:
    ```json
    { "access_token": "<jwt>" }
    ```

- GET `/api/users/me` (auth required)
  - Returns the authenticated user (sans password)

- GET `/api/admin/users` (admin required)
  - Returns all users (sans passwords)

### Logs (auth required)
All endpoints below require a valid access token. They operate on the current user’s logs.

- GET `/api/logs`
  - List current user’s logs

- GET `/api/logs/:id`
  - Get a specific log owned by the current user

- POST `/api/logs`
  - Create a log
  - Body:
    ```json
    {
      "name": "Banana",
      "calorie": 105,
      "serving_size": 1,
      "time": "08:30",
      "date": "2025-01-01"
    }
    ```

- PUT `/api/logs/:id`
  - Update a log (owned by current user)
  - Body: any subset of fields used in creation

- DELETE `/api/logs/:id`
  - Delete a log (owned by current user)

### Admin Logs (admin required)
- GET `/api/admin/logs`
- GET `/api/admin/logs/:id`

---

## Auth details

- Access tokens must be provided as `Authorization: Bearer <token>`.
- `authenticateToken` validates access tokens and populates `req.user` with `{ id, name }`.
- `requireAdmin` checks the user’s role from the database; only `role: "admin"` may access admin routes.
- Passwords are hashed with `bcrypt` when creating users.

---

## Example usage (curl)

```bash
# 1) Create user
curl -s -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"alice","email":"a@example.com","password":"secret123"}'

# 2) Login (get tokens)
TOKENS=$(curl -s -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"name":"alice","password":"secret123"}')

ACCESS=$(echo $TOKENS | node -pe 'JSON.parse(fs.readFileSync(0)).access_token')

# 3) Get profile
curl -s http://localhost:3000/api/users/me \
  -H "Authorization: Bearer $ACCESS"

# 4) Create a log
curl -s -X POST http://localhost:3000/api/logs \
  -H "Authorization: Bearer $ACCESS" \
  -H "Content-Type: application/json" \
  -d '{"name":"Banana","calorie":105,"serving_size":1,"time":"08:30","date":"2025-01-01"}'
```

---

## Scripts
- `npm run dev` → start with nodemon
- `npm start` → start server
- `npm test` → placeholder

## License
ISC
