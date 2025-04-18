
# Document Management System

A modern React application for document management, question-answering, and team collaboration.

## Features

- **User Authentication**: Secure login and registration
- **Document Management**: Create, view, and organize documents
- **Q&A System**: Ask questions, get answers, and collaborate with team members
- **Role-Based Access Control**: Different permissions for admin, editor, and viewer roles

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Context API, TanStack Query
- **Routing**: React Router v6
- **Testing**: Vitest, React Testing Library
- **Mock Backend**: Local storage-based API simulation

## Getting Started

### Prerequisites

- Node.js v14 or higher
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage report:
```bash
npm run test:coverage
```

## Project Structure

- `src/components/`: Reusable UI components
- `src/contexts/`: React context providers
- `src/hooks/`: Custom React hooks
- `src/pages/`: Application pages
- `src/services/`: API service layer
- `src/lib/`: Utility functions
- `src/__tests__/`: Test suites

## Default User Accounts

For demo purposes, the application comes with three pre-configured user accounts:

- **Admin**: admin@example.com (Role: Admin)
- **Editor**: editor@example.com (Role: Editor)
- **Viewer**: viewer@example.com (Role: Viewer)

You can use any of these email addresses with any password to log in.

## Documentation

For detailed technical documentation, see [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md).

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
