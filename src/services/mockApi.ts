
import { toast } from "sonner";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatar?: string;
}

export interface Document {
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

export interface Question {
  id: string;
  title: string;
  content: string;
  askedBy: string;
  askedAt: string;
  status: "unanswered" | "answered";
  documentId?: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  content: string;
  answeredBy: string;
  answeredAt: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
  },
  {
    id: "2",
    name: "Editor User",
    email: "editor@example.com",
    role: "editor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=editor"
  },
  {
    id: "3",
    name: "Viewer User",
    email: "viewer@example.com",
    role: "viewer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=viewer"
  }
];

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Getting Started Guide",
    content: "This is a guide to help you get started with our system.",
    createdBy: "1",
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2024-04-01T10:00:00Z",
    type: "pdf",
    size: 1024,
    status: "published"
  },
  {
    id: "2",
    title: "API Documentation",
    content: "Comprehensive API documentation for developers.",
    createdBy: "2",
    createdAt: "2024-04-02T14:30:00Z",
    updatedAt: "2024-04-03T09:15:00Z",
    type: "docx",
    size: 2048,
    status: "published"
  },
  {
    id: "3",
    title: "Internal Processes",
    content: "Documentation of internal company processes.",
    createdBy: "1",
    createdAt: "2024-04-05T16:20:00Z",
    updatedAt: "2024-04-10T11:45:00Z",
    type: "pdf",
    size: 3072,
    status: "draft"
  }
];

const mockQuestions: Question[] = [
  {
    id: "1",
    title: "How do I upload a new document?",
    content: "I'm trying to upload a new document but can't find the right button.",
    askedBy: "3",
    askedAt: "2024-04-10T09:00:00Z",
    status: "answered",
    answers: [
      {
        id: "a1",
        content: "Click on the '+ New Document' button in the top right of the documents page.",
        answeredBy: "1",
        answeredAt: "2024-04-10T10:30:00Z"
      }
    ]
  },
  {
    id: "2",
    title: "Can I change document permissions?",
    content: "I need to restrict access to a specific document to certain users.",
    askedBy: "2",
    askedAt: "2024-04-11T14:20:00Z",
    status: "unanswered",
    documentId: "2",
    answers: []
  }
];

// Local storage keys
const USERS_KEY = 'docManagement_users';
const DOCUMENTS_KEY = 'docManagement_documents';
const QUESTIONS_KEY = 'docManagement_questions';
const CURRENT_USER_KEY = 'docManagement_currentUser';

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initializeData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  }
  
  if (!localStorage.getItem(DOCUMENTS_KEY)) {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(mockDocuments));
  }
  
  if (!localStorage.getItem(QUESTIONS_KEY)) {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(mockQuestions));
  }
};

// Mock API service
export const mockApi = {
  // Auth API
  auth: {
    login: async (email: string, password: string) => {
      await delay(800);
      
      initializeData();
      
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, we would validate the password here
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      return user;
    },
    
    register: async (name: string, email: string, password: string, role: User['role'] = 'viewer') => {
      await delay(1000);
      
      initializeData();
      
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
      
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('User with this email already exists');
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      };
      
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      
      return newUser;
    },
    
    logout: async () => {
      await delay(500);
      localStorage.removeItem(CURRENT_USER_KEY);
    },
    
    getCurrentUser: (): User | null => {
      const userJson = localStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    }
  },
  
  // Users API
  users: {
    getAll: async () => {
      await delay(600);
      
      initializeData();
      
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
    },
    
    getById: async (id: string) => {
      await delay(400);
      
      initializeData();
      
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
      const user = users.find(u => u.id === id);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    },
    
    create: async (userData: Omit<User, 'id'>) => {
      await delay(800);
      
      initializeData();
      
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
      
      if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error('User with this email already exists');
      }
      
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      };
      
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
      
      return newUser;
    },
    
    update: async (id: string, updates: Partial<Omit<User, 'id'>>) => {
      await delay(800);
      
      initializeData();
      
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
      const index = users.findIndex(u => u.id === id);
      
      if (index === -1) {
        throw new Error('User not found');
      }
      
      const updatedUser = { ...users[index], ...updates };
      users[index] = updatedUser;
      
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Update current user if it's the same
      const currentUser = mockApi.auth.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      }
      
      return updatedUser;
    },
    
    delete: async (id: string) => {
      await delay(800);
      
      initializeData();
      
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
      const filteredUsers = users.filter(u => u.id !== id);
      
      if (filteredUsers.length === users.length) {
        throw new Error('User not found');
      }
      
      localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
      
      // Logout if it's the current user
      const currentUser = mockApi.auth.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
      
      return true;
    }
  },
  
  // Documents API
  documents: {
    getAll: async () => {
      await delay(700);
      
      initializeData();
      
      return JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '[]') as Document[];
    },
    
    getById: async (id: string) => {
      await delay(500);
      
      initializeData();
      
      const documents = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '[]') as Document[];
      const document = documents.find(d => d.id === id);
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      return document;
    },
    
    create: async (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
      await delay(1000);
      
      initializeData();
      
      const currentUser = mockApi.auth.getCurrentUser();
      if (!currentUser) {
        throw new Error('You must be logged in to create a document');
      }
      
      const documents = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '[]') as Document[];
      
      const now = new Date().toISOString();
      const newDocument: Document = {
        ...documentData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify([...documents, newDocument]));
      toast.success("Document created successfully");
      
      return newDocument;
    },
    
    update: async (id: string, updates: Partial<Omit<Document, 'id' | 'createdAt' | 'updatedAt'>>) => {
      await delay(800);
      
      initializeData();
      
      const documents = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '[]') as Document[];
      const index = documents.findIndex(d => d.id === id);
      
      if (index === -1) {
        throw new Error('Document not found');
      }
      
      const updatedDocument = { 
        ...documents[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      
      documents[index] = updatedDocument;
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
      toast.success("Document updated successfully");
      
      return updatedDocument;
    },
    
    delete: async (id: string) => {
      await delay(800);
      
      initializeData();
      
      const documents = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '[]') as Document[];
      const filteredDocuments = documents.filter(d => d.id !== id);
      
      if (filteredDocuments.length === documents.length) {
        throw new Error('Document not found');
      }
      
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(filteredDocuments));
      toast.success("Document deleted successfully");
      
      return true;
    }
  },
  
  // Q&A API
  questions: {
    getAll: async () => {
      await delay(700);
      
      initializeData();
      
      return JSON.parse(localStorage.getItem(QUESTIONS_KEY) || '[]') as Question[];
    },
    
    getById: async (id: string) => {
      await delay(500);
      
      initializeData();
      
      const questions = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || '[]') as Question[];
      const question = questions.find(q => q.id === id);
      
      if (!question) {
        throw new Error('Question not found');
      }
      
      return question;
    },
    
    create: async (questionData: Omit<Question, 'id' | 'askedAt' | 'status' | 'answers'>) => {
      await delay(1000);
      
      initializeData();
      
      const currentUser = mockApi.auth.getCurrentUser();
      if (!currentUser) {
        throw new Error('You must be logged in to ask a question');
      }
      
      const questions = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || '[]') as Question[];
      
      const newQuestion: Question = {
        ...questionData,
        id: Date.now().toString(),
        askedAt: new Date().toISOString(),
        status: 'unanswered',
        answers: []
      };
      
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify([...questions, newQuestion]));
      toast.success("Question submitted successfully");
      
      return newQuestion;
    },
    
    addAnswer: async (questionId: string, answerContent: string) => {
      await delay(800);
      
      initializeData();
      
      const currentUser = mockApi.auth.getCurrentUser();
      if (!currentUser) {
        throw new Error('You must be logged in to answer a question');
      }
      
      const questions = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || '[]') as Question[];
      const index = questions.findIndex(q => q.id === questionId);
      
      if (index === -1) {
        throw new Error('Question not found');
      }
      
      const newAnswer: Answer = {
        id: Date.now().toString(),
        content: answerContent,
        answeredBy: currentUser.id,
        answeredAt: new Date().toISOString()
      };
      
      const updatedQuestion = { 
        ...questions[index], 
        answers: [...questions[index].answers, newAnswer],
        status: 'answered' as const
      };
      
      questions[index] = updatedQuestion;
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
      toast.success("Answer submitted successfully");
      
      return updatedQuestion;
    },
    
    delete: async (id: string) => {
      await delay(800);
      
      initializeData();
      
      const questions = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || '[]') as Question[];
      const filteredQuestions = questions.filter(q => q.id !== id);
      
      if (filteredQuestions.length === questions.length) {
        throw new Error('Question not found');
      }
      
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(filteredQuestions));
      toast.success("Question deleted successfully");
      
      return true;
    }
  }
};

// Initialize data on module import
initializeData();
