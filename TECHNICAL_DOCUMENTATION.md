
# Document Management System - Technical Documentation

## Overview

This document provides technical details about the Document Management System, a web application built with React, TypeScript, and Tailwind CSS. The application allows users to manage documents, ask questions, and collaborate with team members.

## System Architecture

The application follows a frontend-only architecture with a simulated backend using local storage:

1. **Frontend Layer**: React with TypeScript
2. **UI Framework**: Tailwind CSS with Shadcn UI components
3. **State Management**: React Context API and React Query
4. **Routing**: React Router v6
5. **Storage**: Browser's Local Storage (mock backend)
6. **Authentication**: Simulated with localStorage

## Core Components

### Authentication System

- **AuthContext**: Central authentication state management
  - Located at: `src/contexts/AuthContext.tsx`
  - Manages user authentication, registration, and session persistence
  - Provides role-based access control

- **AuthGuard**: Route protection component
  - Located at: `src/components/guards/AuthGuard.tsx`
  - Restricts access to routes based on authentication status and user roles

### Layout Components

- **DashboardLayout**: Main authenticated application layout
  - Located at: `src/components/layout/DashboardLayout.tsx`
  - Provides consistent navigation and UI structure for authenticated pages

### API Services

- **mockApi**: Simulates backend API functionality
  - Located at: `src/services/mockApi.ts`
  - Manages CRUD operations for users, documents, and questions
  - Persists data in localStorage

### Feature Components

- **Document Management**:
  - `Documents.tsx`: Lists all documents
  - `DocumentNew.tsx`: Creates new documents

- **Q&A System**:
  - `QA.tsx`: Lists questions and allows asking new ones
  - `QADetail.tsx`: Displays details of a question and its answers

- **User Management**:
  - `Users.tsx`: Admin interface for managing users

## Data Models

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatar?: string;
}
```

### Document

```typescript
interface Document {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  size: number;
  status: "draft" | "published" | "archived";
}
```

### Question

```typescript
interface Question {
  id: string;
  title: string;
  content: string;
  askedBy: string;
  askedAt: string;
  status: "unanswered" | "answered";
  documentId?: string;
  answers: Answer[];
}
```

### Answer

```typescript
interface Answer {
  id: string;
  content: string;
  answeredBy: string;
  answeredAt: string;
}
```

## Authentication Flow

1. **Login**: User submits credentials, which are validated against localStorage data
2. **Registration**: New user data is stored in localStorage
3. **Session Persistence**: User session is maintained in localStorage
4. **Logout**: User session is removed from localStorage

## Route Structure

- `/`: Public landing page
- `/login`: User login page
- `/register`: User registration page
- `/dashboard`: Main authenticated dashboard
- `/documents`: Document listing page
- `/documents/new`: Document creation page
- `/qa`: Questions and answers listing page
- `/qa/:id`: Question detail page
- `/users`: User management page (admin only)
- `/unauthorized`: Access denied page
- `*`: 404 not found page

## Role-Based Access Control

- **Admin**: Access to all features, including user management
- **Editor**: Can create and edit documents, ask and answer questions
- **Viewer**: Can view documents, ask questions, but cannot create documents

## Development Setup

### Prerequisites

- Node.js v14 or higher
- npm or yarn package manager

### Running the Application

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Run tests: `npm test`

### Testing

- Unit tests are implemented using Vitest and React Testing Library
- Test files are located next to the components they test in `__tests__` folders
- Run tests with coverage: `npm run test:coverage`

## Deployment

The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service

## Known Limitations

- This is a frontend-only application with simulated backend
- Data persistence is limited to the browser's localStorage
- No real authentication or security mechanisms
- Limited error handling and validation

## Future Improvements

- Implement a real backend API with proper authentication
- Add comprehensive form validation
- Improve error handling and user feedback
- Implement file upload functionality
- Add document versioning capabilities
- Enhance search functionality across documents and questions
- Add user activity tracking and audit logs
