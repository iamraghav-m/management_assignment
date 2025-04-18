
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QA from '../QA';
import { BrowserRouter } from 'react-router-dom';
import { Question } from '@/services/mockApi';

// Mock the mockApi service
vi.mock('@/services/mockApi', () => ({
  mockApi: {
    questions: {
      getAll: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock the auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Import the mocked modules to manipulate them
import { mockApi } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';

const renderQA = () => {
  return render(
    <BrowserRouter>
      <QA />
    </BrowserRouter>
  );
};

describe('QA Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'viewer' },
      loading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true,
      hasRole: vi.fn(),
    });
  });

  it('should display loading state initially', async () => {
    vi.mocked(mockApi.questions.getAll).mockResolvedValue([]);
    
    renderQA();
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should display questions after loading', async () => {
    const mockQuestions: Question[] = [
      {
        id: '1',
        title: 'Test Question 1',
        content: 'This is a test question',
        askedBy: '1',
        askedAt: new Date().toISOString(),
        status: 'unanswered',
        answers: []
      },
      {
        id: '2',
        title: 'Test Question 2',
        content: 'This is another test question',
        askedBy: '1',
        askedAt: new Date().toISOString(),
        status: 'answered',
        answers: [{ id: 'a1', content: 'Test answer', answeredBy: '2', answeredAt: new Date().toISOString() }]
      }
    ];
    
    vi.mocked(mockApi.questions.getAll).mockResolvedValue(mockQuestions);
    
    renderQA();
    
    await waitFor(() => {
      expect(screen.getByText('Questions & Answers')).toBeInTheDocument();
    });
    
    // Check if we can switch to browse tab
    const browseTab = screen.getByRole('tab', { name: /browse questions/i });
    await userEvent.click(browseTab);
    
    // Check if the unanswered tab shows the correct content
    const unansweredTab = screen.getByRole('tab', { name: /unanswered/i });
    await userEvent.click(unansweredTab);
    
    expect(screen.getByText('Test Question 1')).toBeInTheDocument();
  });

  it('should allow asking a new question', async () => {
    vi.mocked(mockApi.questions.getAll).mockResolvedValue([]);
    vi.mocked(mockApi.questions.create).mockResolvedValue({
      id: 'new',
      title: 'New Test Question',
      content: 'This is a new test question',
      askedBy: '1',
      askedAt: new Date().toISOString(),
      status: 'unanswered',
      answers: []
    });
    
    renderQA();
    
    await waitFor(() => {
      expect(screen.getByText('Questions & Answers')).toBeInTheDocument();
    });
    
    // Switch to the ask tab
    const askTab = screen.getByRole('tab', { name: /ask a question/i });
    await userEvent.click(askTab);
    
    // Fill the form
    const titleInput = screen.getByLabelText(/question title/i);
    const contentInput = screen.getByLabelText(/details/i);
    
    await userEvent.type(titleInput, 'New Test Question');
    await userEvent.type(contentInput, 'This is a new test question');
    
    const submitButton = screen.getByRole('button', { name: /submit question/i });
    await userEvent.click(submitButton);
    
    expect(mockApi.questions.create).toHaveBeenCalledWith({
      title: 'New Test Question',
      content: 'This is a new test question',
      askedBy: '1',
    });
  });
});
