# Task Manager Application

Aplikasi Task Manager sederhana untuk mengelola aktivitas harian dengan fitur manajemen user dan CRUD tasks.

## 🚀 Live Demo

- **Frontend**: https://taskmanager-pretest.vercel.app
- **Backend API**: https://taskmanager-pretest-production.up.railway.app
- **API Documentation**: https://taskmanager-pretest-production.up.railway.app/api-docs

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Token)
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Railway

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router
- **Deployment**: Vercel

## 📁 Project Structure

```
test-taskmanager-indocryptonetwork/
├── be/                 # Backend API
│   ├── src/
│   │   ├── config/     # Configuration files
│   │   ├── modules/    # Feature modules (user, task)
│   │   ├── shared/     # Shared middleware & utilities
│   │   └── index.ts    # Entry point
│   ├── prisma/         # Database schema
│   └── package.json
├── fe/                 # Frontend Application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── App.tsx     # Main app component
│   └── package.json
└── README.md          # This file
```

## 🔑 Features

### User Management
- ✅ User registration
- ✅ User login with JWT authentication
- ✅ View all users
- ✅ View user profile
- ✅ Update user profile
- ✅ Delete user account

### Task Management
- ✅ Create new task (Auth required)
- ✅ View all tasks
- ✅ View my tasks (Auth required)
- ✅ View task by ID
- ✅ Update task (Auth required)
- ✅ Delete task (Auth required)
- ✅ Toggle task completion status
- ✅ View tasks by user ID

### Additional Features
- ✅ One-to-many relationship (User → Tasks)
- ✅ Input validation & error handling
- ✅ CORS configuration
- ✅ Request logging
- ✅ API documentation with Swagger

## 📚 API Endpoints

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users` | Register new user | ❌ |
| POST | `/api/users/login` | User login | ❌ |
| GET | `/api/users` | List all users | ❌ |
| GET | `/api/users/:id` | Get user by ID | ✅ |
| PUT | `/api/users/:id` | Update user | ✅ |
| DELETE | `/api/users/:id` | Delete user | ✅ |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/tasks` | Create new task | ✅ |
| GET | `/api/tasks` | List all tasks | ❌ |
| GET | `/api/tasks/my-tasks` | Get current user's tasks | ✅ |
| GET | `/api/tasks/:id` | Get task by ID | ❌ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |
| GET | `/api/users/:id/tasks` | Get tasks by user ID | ❌ |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Supabase account)

### Backend Setup

1. Navigate to backend directory:
```bash
cd be
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (see `.env.example`):
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
```

4. Run database migrations:
```bash
npx prisma migrate deploy
npx prisma generate
```

5. Start development server:
```bash
npm run dev
```

Backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd fe
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Task Model
```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 📝 API Request/Response Examples

### Register User
**Request:**
```bash
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

### Login
**Request:**
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-03-14T10:00:00.000Z",
    "updatedAt": "2026-03-14T10:00:00.000Z"
  }
}
```

### Create Task
**Request:**
```bash
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task manager API",
  "completed": false
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the task manager API",
  "completed": false,
  "userId": 1,
  "createdAt": "2026-03-14T10:00:00.000Z",
  "updatedAt": "2026-03-14T10:00:00.000Z"
}
```

### Get All Tasks
**Request:**
```bash
GET /api/tasks
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the task manager API",
    "completed": false,
    "userId": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    },
    "createdAt": "2026-03-14T10:00:00.000Z",
    "updatedAt": "2026-03-14T10:00:00.000Z"
  }
]
```

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=          # PostgreSQL connection string
JWT_SECRET=            # Secret key for JWT
JWT_EXPIRES_IN=        # Token expiration (e.g., "7d")
PORT=                  # Server port (optional, default: 3000)
PRODUCTION_URL=        # Production backend URL (for Swagger docs)
```

### Frontend (.env)
```env
VITE_API_URL=          # Backend API URL
```

## 🚀 Deployment

### Backend (Railway)
1. Push code to GitHub
2. Connect Railway to your repository
3. Add environment variables in Railway dashboard
4. Deploy automatically

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `fe`
4. Add environment variables
5. Deploy

## 👨‍💻 Author

**Technical Test - Junior Backend Developer**

## 📄 License

This project is created for technical test purposes.
