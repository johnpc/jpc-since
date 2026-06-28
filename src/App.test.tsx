import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// App imports Amplify-backed providers; stub the SDK-touching module.
vi.mock('./features/auth/authClient', () => ({
  currentEmail: vi.fn().mockResolvedValue(null),
  signIn: vi.fn(),
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
  signOut: vi.fn(),
}));

import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeDefined();
  });
});
