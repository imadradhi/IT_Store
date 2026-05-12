import React, { useState } from 'react';
import { login } from '../services/authService';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const loginEmail = email.includes('@') ? email : `${email}@gmail.com`;
      await login(loginEmail, password);
      onLoginSuccess();
    } catch {
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">🖥️</div>
          <h1>IT Stock </h1>
          <p>Sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="login-label">Username</label>
            <input
              id="email"
              type="text"
              className="login-input"
              placeholder="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="login-label">Password</label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">⚠️ {error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
};
