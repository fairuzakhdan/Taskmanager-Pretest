# Task Manager API

Aplikasi Task Manager API sederhana untuk mengelola aktivitas harian dengan fitur manajemen user dan CRUD tasks.

## Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: bcrypt
- **Logger**: Winston
- **API Documentation**: Swagger/OpenAPI 3.0

## Features

- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ CRUD Operations untuk Tasks
- ✅ Relasi One-to-Many (User → Tasks)
- ✅ Validasi Input & Error Handling
- ✅ Environment Variables Configuration
- ✅ Request Logging dengan Winston
- ✅ Interactive API Documentation dengan Swagger
- ✅ Module-based Architecture
- ✅ Unit & Integration Testing
- ✅ Database Mocking untuk Tests
- ✅ Server Dropdown di Swagger (Dev/Prod)

## Installation & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd test-indonesia-crypto
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database (Supabase)

1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Copy connection string dari Settings → Database
4. Format connection string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres
   ```

### 4. Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan konfigurasi Anda:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
JWT_SECRET="your_secret_key_here"
JWT_EXPIRES_IN="7d"
PORT=3000
PRODUCTION_URL="https://your-production-url.com"
```

**Environment Variables:**
- `DATABASE_URL`: Connection string ke PostgreSQL database
- `JWT_SECRET`: Secret key untuk JWT token generation
- `JWT_EXPIRES_IN`: Durasi expired JWT token (default: 7d)
- `PORT`: Port server (default: 3000)
- `PRODUCTION_URL`: URL production server untuk Swagger dropdown

**Contoh Production URL:**
```env
PRODUCTION_URL="https://api.yourdomain.com"
PRODUCTION_URL="https://your-app.herokuapp.com"
PRODUCTION_URL="https://your-app.vercel.app"
```

### 5. Run Prisma Migration

```bash
npm run prisma:generate
npm run prisma:migrate
```

Saat diminta nama migration, ketik: `init`

### 6. Run Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

Server akan berjalan di `http://localhost:3000`

## API Documentation

### Interactive Documentation (Swagger UI)

Akses dokumentasi interaktif di browser:

```
http://localhost:3000/api-docs
```

**Fitur Swagger UI:**
- 📖 Dokumentasi lengkap semua endpoints
- 🧪 Try it out - Test API langsung dari browser
- 🔐 Authentication - Klik "Authorize" untuk input JWT token
- 📝 Request/Response examples untuk setiap endpoint
- ⚠️ Error responses dengan contoh message
- 🌐 **Server Dropdown** - Pilih antara Development atau Production server

### Swagger JSON Spec

Untuk mendapatkan OpenAPI specification dalam format JSON:

```bash
# Get Swagger JSON spec
curl http://localhost:3000/api-docs/swagger.json

# Save to file
curl http://localhost:3000/api-docs/swagger.json -o swagger.json
```

### Import ke Postman/Insomnia

1. Buka Postman/Insomnia
2. Import → Link
3. Paste: `http://localhost:3000/api-docs/swagger.json`
4. Semua endpoints akan ter-import otomatis

## API Endpoints Summary

Base URL: `http://localhost:3000/api`

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users` | Register user | ❌ |
| POST | `/users/login` | Login user | ❌ |
| GET | `/users` | Get all users | ❌ |
| GET | `/users/:id` | Get user by ID | ❌ |
| PUT | `/users/:id` | Update user | ❌ |
| DELETE | `/users/:id` | Delete user | ❌ |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/tasks` | Create task | ✅ |
| GET | `/tasks` | Get all tasks | ❌ |
| GET | `/tasks/my-tasks` | Get current user's tasks | ✅ |
| GET | `/tasks/:id` | Get task by ID | ❌ |
| PUT | `/tasks/:id` | Update task | ✅ |
| DELETE | `/tasks/:id` | Delete task | ✅ |
| GET | `/users/:id/tasks` | Get tasks by user ID | ❌ |

## Quick Start Examples

### 1. Register User
```http
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2026-03-12T04:03:21.717Z",
  "updatedAt": "2026-03-12T04:03:21.717Z"
}
```

#### 2. Login User
```http
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-03-12T04:03:21.717Z",
    "updatedAt": "2026-03-12T04:03:21.717Z"
  }
}
```

#### 3. Get All Users
```http
GET /users
```

**Response (200):**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-03-12T04:03:21.717Z",
    "updatedAt": "2026-03-12T04:03:21.717Z"
  }
]
```

#### 4. Get User by ID
```http
GET /users/:id
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2026-03-12T04:03:21.717Z",
  "updatedAt": "2026-03-12T04:03:21.717Z"
}
```

#### 5. Update User
```http
PUT /users/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

#### 6. Delete User
```http
DELETE /users/:id
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

### Task Endpoints

#### 1. Create Task (Auth Required)
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task manager API",
  "status": "pending"
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the task manager API",
  "status": "pending",
  "userId": 1,
  "createdAt": "2026-03-12T04:03:21.717Z",
  "updatedAt": "2026-03-12T04:03:21.717Z"
}
```

#### 2. Get All Tasks
```http
GET /tasks
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the task manager API",
    "status": "pending",
    "userId": 1,
    "createdAt": "2026-03-12T04:03:21.717Z",
    "updatedAt": "2026-03-12T04:03:21.717Z",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
]
```

#### 3. Get My Tasks (Auth Required)
```http
GET /tasks/my-tasks
Authorization: Bearer <token>
```

#### 4. Get Task by ID
```http
GET /tasks/:id
```

#### 5. Update Task (Auth Required)
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "completed"
}
```

#### 6. Delete Task (Auth Required)
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

#### 7. Get Tasks by User ID
```http
GET /users/:id/tasks
```

## Error Responses

**400 Bad Request:**
```json
{
  "error": "Email, password, and name are required"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid token"
}
```

**403 Forbidden:**
```json
{
  "error": "Not authorized to update this task"
}
```

**404 Not Found:**
```json
{
  "error": "Task not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## Database Schema

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
}
```

### Task Model
```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      String   @default("pending")
  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Project Structure

```
test-indonesia-crypto/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── logger.ts
│   │   └── swagger.ts
│   ├── modules/
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   └── user.routes.ts
│   │   └── task/
│   │       ├── task.controller.ts
│   │       └── task.routes.ts
│   ├── shared/
│   │   └── middleware/
│   │       ├── auth.middleware.ts
│   │       └── logger.middleware.ts
│   ├── utils/
│   │   └── jwt.util.ts
│   └── index.ts
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   ├── user.controller.test.ts
│   │   └── task.controller.test.ts
│   └── integration/
│       └── user.integration.test.ts
├── logs/
│   ├── combined.log
│   └── error.log
├── coverage/ (generated)
├── .env
├── .env.example
├── .gitignore
├── package.json
├── jest.config.js
├── tsconfig.json
├── TESTING.md
└── README.md
```

## Live URL

[Tambahkan URL deployment Anda di sini setelah deploy]

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode (requires Git)
npm run test:watch
```

### Test Coverage
- **Unit Tests**: User & Task controllers
- **Integration Tests**: API endpoints
- **Database**: Fully mocked (no real DB connection)
- **Coverage**: ~46% statements, 100% routes

## Deployment

### Pre-Deployment Checklist

⚠️ **CRITICAL - Sebelum Deploy:**

1. **Environment Security**
   ```bash
   # Pastikan .env TIDAK ter-commit ke Git
   git status  # .env tidak boleh muncul di list
   ```

2. **Generate Secure JWT Secret**
   ```bash
   # Generate random string untuk production
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Setup Production Database**
   - Buat database production terpisah
   - Jangan gunakan database development

### Deployment Steps

#### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit"

# PASTIKAN .env tidak ter-add!
git status
```

#### 2. Platform Deployment

**Heroku:**
```bash
# Install Heroku CLI
heroku create your-app-name

# Set environment variables
heroku config:set DATABASE_URL="your_production_database_url"
heroku config:set JWT_SECRET="your_secure_jwt_secret"
heroku config:set PRODUCTION_URL="https://your-app.herokuapp.com"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel dashboard:
# - DATABASE_URL
# - JWT_SECRET  
# - PRODUCTION_URL
# - NODE_ENV=production
```

**Railway:**
```bash
# Connect GitHub repo di Railway dashboard
# Set environment variables:
# - DATABASE_URL
# - JWT_SECRET
# - PRODUCTION_URL
# - NODE_ENV=production
```

#### 3. Production Environment Variables
```env
DATABASE_URL="postgresql://production_db_connection_string"
JWT_SECRET="super_secure_random_64_char_string"
JWT_EXPIRES_IN="7d"
PORT=3000
PRODUCTION_URL="https://your-actual-domain.com"
NODE_ENV="production"
```

#### 4. Database Migration (Production)
```bash
# Setelah deploy, jalankan migration:
npm run prisma:generate
npm run prisma:deploy
```

### Build Commands (Platform Config)

**package.json scripts:**
```json
{
  "build": "tsc && npm run prisma:generate",
  "start": "npm run prisma:deploy && node dist/index.js"
}
```

### Security Best Practices

- ✅ **Never commit .env** to Git
- ✅ **Use strong JWT secrets** in production
- ✅ **Separate production database** from development
- ✅ **Set NODE_ENV=production**
- ✅ **Use HTTPS** in production
- ✅ **Monitor logs** for security issues

### Post-Deployment

1. **Test API endpoints** di production URL
2. **Verify Swagger documentation** works
3. **Check server dropdown** shows correct URLs
4. **Monitor logs** untuk errors
5. **Update README** dengan live URL

## Notes

- Password di-hash menggunakan bcrypt sebelum disimpan ke database
- JWT token berlaku selama 7 hari (configurable via JWT_EXPIRES_IN)
- Relasi cascade delete: jika user dihapus, semua tasks miliknya juga terhapus
- Status task default: "pending"
- Request logging tersimpan di folder `logs/`
- Swagger documentation tersedia di `/api-docs`

## Author

[Nama Anda]

## License

ISC
