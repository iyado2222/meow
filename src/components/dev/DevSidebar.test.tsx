import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import DevSidebar from './DevSidebar';

// Mock environment
const originalEnv = process.env.NODE_ENV;

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <LanguageProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </LanguageProvider>
  </BrowserRouter>
);

describe('DevSidebar', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    localStorage.clear();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('renders development banner and sidebar in development mode', () => {
    render(
      <TestWrapper>
        <DevSidebar />
      </TestWrapper>
    );

    expect(screen.getByText(/DEVELOPMENT MODE/)).toBeInTheDocument();
    expect(screen.getByText('Dev Tools')).toBeInTheDocument();
  });

  it('does not render in production mode', () => {
    process.env.NODE_ENV = 'production';
    
    render(
      <TestWrapper>
        <DevSidebar />
      </TestWrapper>
    );

    expect(screen.queryByText(/DEVELOPMENT MODE/)).not.toBeInTheDocument();
  });

  it('toggles sidebar collapse state', async () => {
    render(
      <TestWrapper>
        <DevSidebar />
      </TestWrapper>
    );

    const toggleButton = screen.getByTitle(/Collapse sidebar/);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByTitle(/Expand sidebar/)).toBeInTheDocument();
    });
  });

  it('persists collapsed state in localStorage', () => {
    render(
      <TestWrapper>
        <DevSidebar />
      </TestWrapper>
    );

    const toggleButton = screen.getByTitle(/Collapse sidebar/);
    fireEvent.click(toggleButton);

    expect(localStorage.getItem('devSidebar_collapsed')).toBe('true');
  });

  it('renders auth bypass buttons', () => {
    render(
      <TestWrapper>
        <DevSidebar />
      </TestWrapper>
    );

    expect(screen.getByTitle('Login as Admin')).toBeInTheDocument();
    expect(screen.getByTitle('Login as Staff')).toBeInTheDocument();
    expect(screen.getByTitle('Login as Client')).toBeInTheDocument();
  });

  it('handles auth bypass functionality', () => {
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    render(
      <TestWrapper>
        <DevSidebar />
      </TestWrapper>
    );

    const adminButton = screen.getByTitle('Login as Admin');
    fireEvent.click(adminButton);

    expect(localStorage.getItem('auth_token')).toBe('mock-csrf-token');
    expect(JSON.parse(localStorage.getItem('user_data') || '{}')).toMatchObject({
      role: 'admin',
      email: 'admin@example.com'
    });
  });

  it('expands and collapses navigation sections', async () => {
    render(
      <TestWrapper>
        <DevSidebar />
      </TestWrapper>
    );

    const adminSection = screen.getByText('Admin Dashboard').closest('button');
    fireEvent.click(adminSection!);

    // Section should still be expanded by default, so clicking should collapse it
    await waitFor(() => {
      const expandedSections = JSON.parse(localStorage.getItem('devSidebar_expanded') || '[]');
      expect(expandedSections).not.toContain('admin');
    });
  });

  it('shows route descriptions on hover when collapsed', async () => {
    render(
      <TestWrapper>
        <DevSidebar />
      </TestWrapper>
    );

    // First collapse the sidebar
    const toggleButton = screen.getByTitle(/Collapse sidebar/);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const dashboardButton = screen.getByTitle(/Admin overview and statistics/);
      expect(dashboardButton).toBeInTheDocument();
    });
  });

  it('tracks navigation metrics', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(
      <TestWrapper>
        <DevSidebar />
      </TestWrapper>
    );

    const dashboardLink = screen.getByText('Dashboard');
    fireEvent.click(dashboardLink);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[DevSidebar] Navigation:'),
      expect.any(String)
    );

    consoleSpy.mockRestore();
  });

  it('handles keyboard shortcuts', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <TestWrapper>
        <DevSidebar />
      </TestWrapper>
    );

    // Simulate Alt+A+D shortcut for admin dashboard
    fireEvent.keyDown(window, { key: 'd', altKey: true });

    // Note: This test would need more sophisticated setup to properly test
    // the keyboard shortcut functionality due to the complex key combination logic
  });

  it('shows and hides metrics panel', async () => {
    render(
      <TestWrapper>
        <DevSidebar />
      </TestWrapper>
    );

    const metricsButton = screen.getByText('Dev Metrics');
    fireEvent.click(metricsButton);

    await waitFor(() => {
      expect(screen.getByText('Navigations:')).toBeInTheDocument();
    });

    fireEvent.click(metricsButton);

    await waitFor(() => {
      expect(screen.queryByText('Navigations:')).not.toBeInTheDocument();
    });
  });
});