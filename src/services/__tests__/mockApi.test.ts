
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mockApi, User, Document, Question } from '../mockApi';

describe('mockApi', () => {
  // Save original localStorage
  const originalLocalStorage = window.localStorage;

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Mock localStorage.getItem for initial data
    vi.spyOn(localStorage, 'getItem').mockImplementation((key) => {
      if (key === 'docManagement_users') {
        return JSON.stringify([
          {
            id: '1',
            name: 'Test Admin',
            email: 'admin@test.com',
            role: 'admin',
          },
          {
            id: '2',
            name: 'Test User',
            email: 'user@test.com',
            role: 'viewer',
          },
        ]);
      }
      if (key === 'docManagement_documents') {
        return JSON.stringify([
          {
            id: '1',
            title: 'Test Document',
            content: 'Test content',
            createdBy: '1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            type: 'pdf',
            size: 100,
            status: 'published',
          },
        ]);
      }
      if (key === 'docManagement_questions') {
        return JSON.stringify([
          {
            id: '1',
            title: 'Test Question',
            content: 'What is this?',
            askedBy: '2',
            askedAt: '2024-01-01T00:00:00Z',
            status: 'unanswered',
            answers: [],
          },
        ]);
      }
      return null;
    });
    
    // Mock global Date
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-04-01'));
  });

  afterEach(() => {
    vi.useRealTimers();
    // Restore original localStorage
    Object.defineProperty(window, 'localStorage', { value: originalLocalStorage });
  });

  describe('auth', () => {
    it('should login a user with valid credentials', async () => {
      const user = await mockApi.auth.login('admin@test.com', 'password');
      expect(user).toEqual({
        id: '1',
        name: 'Test Admin',
        email: 'admin@test.com',
        role: 'admin',
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'docManagement_currentUser',
        JSON.stringify({
          id: '1',
          name: 'Test Admin',
          email: 'admin@test.com',
          role: 'admin',
        })
      );
    });

    it('should throw an error when logging in with invalid email', async () => {
      await expect(mockApi.auth.login('invalid@test.com', 'password')).rejects.toThrow('Invalid email or password');
    });

    it('should register a new user', async () => {
      const newUser = await mockApi.auth.register('New User', 'new@test.com', 'password');
      expect(newUser).toHaveProperty('id');
      expect(newUser.name).toBe('New User');
      expect(newUser.email).toBe('new@test.com');
      expect(newUser.role).toBe('viewer');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'docManagement_currentUser',
        expect.any(String)
      );
    });

    it('should throw an error when registering with existing email', async () => {
      await expect(mockApi.auth.register('Test Admin Clone', 'admin@test.com', 'password')).rejects.toThrow('User with this email already exists');
    });

    it('should logout the current user', async () => {
      await mockApi.auth.logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('docManagement_currentUser');
    });
  });

  describe('users', () => {
    it('should get all users', async () => {
      const users = await mockApi.users.getAll();
      expect(users).toHaveLength(2);
      expect(users[0].name).toBe('Test Admin');
    });

    it('should get a user by id', async () => {
      const user = await mockApi.users.getById('1');
      expect(user.name).toBe('Test Admin');
    });

    it('should throw an error when getting a non-existent user', async () => {
      await expect(mockApi.users.getById('999')).rejects.toThrow('User not found');
    });

    it('should create a new user', async () => {
      const newUser = await mockApi.users.create({
        name: 'Created User',
        email: 'created@test.com',
        role: 'editor',
      });
      expect(newUser).toHaveProperty('id');
      expect(newUser.name).toBe('Created User');
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should update a user', async () => {
      const updatedUser = await mockApi.users.update('1', { name: 'Updated Admin' });
      expect(updatedUser.name).toBe('Updated Admin');
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should delete a user', async () => {
      const result = await mockApi.users.delete('1');
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('documents', () => {
    it('should get all documents', async () => {
      const documents = await mockApi.documents.getAll();
      expect(documents).toHaveLength(1);
      expect(documents[0].title).toBe('Test Document');
    });

    it('should create a new document', async () => {
      // Mock getCurrentUser to return a user
      vi.spyOn(mockApi.auth, 'getCurrentUser').mockReturnValue({
        id: '1',
        name: 'Test Admin',
        email: 'admin@test.com',
        role: 'admin',
      });

      const newDocument = await mockApi.documents.create({
        title: 'New Document',
        content: 'New content',
        createdBy: '1',
        type: 'docx',
        size: 200,
        status: 'draft',
      });
      expect(newDocument).toHaveProperty('id');
      expect(newDocument.title).toBe('New Document');
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('questions', () => {
    it('should get all questions', async () => {
      const questions = await mockApi.questions.getAll();
      expect(questions).toHaveLength(1);
      expect(questions[0].title).toBe('Test Question');
    });

    it('should create a new question', async () => {
      // Mock getCurrentUser to return a user
      vi.spyOn(mockApi.auth, 'getCurrentUser').mockReturnValue({
        id: '1',
        name: 'Test Admin',
        email: 'admin@test.com',
        role: 'admin',
      });

      const newQuestion = await mockApi.questions.create({
        title: 'New Question',
        content: 'New question content',
        askedBy: '1',
      });
      expect(newQuestion).toHaveProperty('id');
      expect(newQuestion.title).toBe('New Question');
      expect(newQuestion.status).toBe('unanswered');
      expect(newQuestion.answers).toEqual([]);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should add an answer to a question', async () => {
      // Mock getCurrentUser to return a user
      vi.spyOn(mockApi.auth, 'getCurrentUser').mockReturnValue({
        id: '1',
        name: 'Test Admin',
        email: 'admin@test.com',
        role: 'admin',
      });

      const updatedQuestion = await mockApi.questions.addAnswer('1', 'Test answer');
      expect(updatedQuestion.answers).toHaveLength(1);
      expect(updatedQuestion.answers[0].content).toBe('Test answer');
      expect(updatedQuestion.status).toBe('answered');
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });
});
