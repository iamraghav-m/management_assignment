
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { User } from '@/services/mockApi';

// Mock the mockApi service
vi.mock('@/services/mockApi', () => ({
  mockApi: {
    auth: {
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn(),
    },
  },
}));

// Mock react-router-dom's navigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Import the mocked module to manipulate it
import { mockApi } from '@/services/mockApi';

// Test component that uses the auth context
const TestComponent = () => {
  const { user, login, register, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {user ? <p>User: {user.name}</p> : <p>Not logged in</p>}
      <p>Authenticated: {isAuthenticated ? 'yes' : 'no'}</p>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => register('Test User', 'test@example.com', 'password')}>Register</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

const renderWithAuthProvider = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render children when not authenticated', () => {
    vi.mocked(mockApi.auth.getCurrentUser).mockReturnValue(null);
    
    renderWithAuthProvider();
    
    expect(screen.getByText('Not logged in')).toBeInTheDocument();
    expect(screen.getByText('Authenticated: no')).toBeInTheDocument();
  });

  it('should show authenticated user when logged in', async () => {
    const mockUser: User = { id: '1', name: 'Test User', email: 'test@example.com', role: 'viewer' };
    vi.mocked(mockApi.auth.getCurrentUser).mockReturnValue(mockUser);
    
    renderWithAuthProvider();
    
    await waitFor(() => {
      expect(screen.getByText('User: Test User')).toBeInTheDocument();
      expect(screen.getByText('Authenticated: yes')).toBeInTheDocument();
    });
  });

  it('should call login function when login button is clicked', async () => {
    const mockUser: User = { id: '1', name: 'Test User', email: 'test@example.com', role: 'viewer' };
    vi.mocked(mockApi.auth.getCurrentUser).mockReturnValue(null);
    vi.mocked(mockApi.auth.login).mockResolvedValue(mockUser);
    
    renderWithAuthProvider();
    
    const loginButton = screen.getByText('Login');
    await userEvent.click(loginButton);
    
    expect(mockApi.auth.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should call logout function when logout button is clicked', async () => {
    const mockUser: User = { id: '1', name: 'Test User', email: 'test@example.com', role: 'viewer' };
    vi.mocked(mockApi.auth.getCurrentUser).mockReturnValue(mockUser);
    vi.mocked(mockApi.auth.logout).mockResolvedValue(undefined);
    
    renderWithAuthProvider();
    
    const logoutButton = screen.getByText('Logout');
    await userEvent.click(logoutButton);
    
    expect(mockApi.auth.logout).toHaveBeenCalled();
  });
});
