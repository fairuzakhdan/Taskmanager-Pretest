# Testing Documentation

## Overview

Project ini menggunakan **Jest** sebagai testing framework dengan **Prisma Mock** untuk database mocking.

## Test Structure

```
src/__tests__/
├── mocks/
│   └── prisma.mock.ts          # Prisma client mock singleton
├── unit/
│   ├── user/
│   │   └── user.controller.test.ts    # Unit tests untuk user controller
│   └── task/
│       └── task.controller.test.ts    # Unit tests untuk task controller
└── integration/
    ├── user.integration.test.ts       # Integration tests untuk user API
    └── task.integration.test.ts       # Integration tests untuk task API
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test user.controller.test
```

## Test Types

### 1. Unit Tests
Unit tests menguji individual functions/controllers secara terisolasi dengan mocking semua dependencies.

**Location:** `src/__tests__/unit/`

**Coverage:**
- User Controller:
  - ✅ register
  - ✅ login
  - ✅ getAllUsers
  - ✅ getUserById
  - ✅ updateUser
  - ✅ deleteUser

- Task Controller:
  - ✅ createTask
  - ✅ getAllTasks
  - ✅ getMyTasks
  - ✅ getTaskById
  - ✅ updateTask
  - ✅ deleteTask
  - ✅ getUserTasks

### 2. Integration Tests
Integration tests menguji API endpoints secara end-to-end dengan mocked database.

**Location:** `src/__tests__/integration/`

**Coverage:**
- User API:
  - ✅ POST /api/users (Register)
  - ✅ POST /api/users/login
  - ✅ GET /api/users
  - ✅ GET /api/users/:id
  - ✅ PUT /api/users/:id
  - ✅ DELETE /api/users/:id

- Task API:
  - ✅ POST /api/tasks
  - ✅ GET /api/tasks
  - ✅ GET /api/tasks/my-tasks
  - ✅ GET /api/tasks/:id
  - ✅ PUT /api/tasks/:id
  - ✅ DELETE /api/tasks/:id
  - ✅ GET /api/users/:id/tasks

## Test Scenarios

### Authentication Tests
- ✅ Valid credentials
- ✅ Invalid credentials
- ✅ Missing token
- ✅ Invalid token

### Authorization Tests
- ✅ User can only view own profile
- ✅ User can only update own profile
- ✅ User can only delete own account
- ✅ User can only update own tasks
- ✅ User can only delete own tasks

### Validation Tests
- ✅ Required fields validation
- ✅ Email uniqueness validation
- ✅ Resource not found (404)

### Business Logic Tests
- ✅ Password hashing
- ✅ JWT token generation
- ✅ Default task status
- ✅ Cascade delete (tasks deleted when user deleted)

## Mocking Strategy

### Database Mocking
Menggunakan `jest-mock-extended` untuk mock Prisma Client:

```typescript
import { prismaMock } from '../../mocks/prisma.mock';

// Mock database response
prismaMock.user.findUnique.mockResolvedValue(mockUser);
```

### JWT Mocking
```typescript
import * as jwtUtil from '../../../utils/jwt.util';

jest.mock('../../../utils/jwt.util');
(jwtUtil.generateToken as jest.Mock).mockReturnValue('mock-token');
```

### Bcrypt Mocking
```typescript
import bcrypt from 'bcrypt';

jest.mock('bcrypt');
(bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
(bcrypt.compare as jest.Mock).mockResolvedValue(true);
```

## Test Configuration

### jest.config.js
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
};
```

## Best Practices

1. **Isolate Tests**: Setiap test harus independent dan tidak bergantung pada test lain
2. **Mock External Dependencies**: Database, external APIs, dan third-party libraries di-mock
3. **Clear Test Names**: Gunakan descriptive test names yang menjelaskan scenario
4. **Arrange-Act-Assert**: Struktur test dengan pola AAA
5. **Reset Mocks**: Reset mocks di `beforeEach` untuk menghindari test pollution

## Troubleshooting

### Tests Failing Due to Mock Not Reset
Pastikan `mockReset(prismaMock)` dipanggil di `beforeEach` di `prisma.mock.ts`

### TypeScript Errors
Pastikan semua types sudah benar dan gunakan type casting jika perlu:
```typescript
mockRequest as AuthRequest
```

### Import Errors
Pastikan path import benar dan file extension `.ts` tidak perlu ditulis

## Coverage Goals

Target coverage:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Check coverage dengan:
```bash
npm run test:coverage
```

Coverage report akan tersimpan di folder `coverage/`.
