import React, { useState } from 'react';
import { login, register } from '../services/authService';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (isRegister) {
        await register(username, password, fullname);
      } else {
        await login(username, password);
      }
      onLoginSuccess();
    } catch (err: any) {
      if (err.message === 'PENDING_ACTIVATION') {
        if (isRegister) {
          setSuccess('Account created! Please wait for admin activation.');
          setUsername('');
          setPassword('');
          setFullname('');
          setIsRegister(false);
        } else {
          setError('Your account is not active yet. Please contact admin.');
        }
      } else if (err.message === 'USER_NOT_FOUND') {
        setError('Username not found. Please register first.');
      } else if (err.message === 'INVALID_PASSWORD') {
        setError('Incorrect password. Please try again.');
      } else if (err.message === 'USERNAME_TAKEN') {
        setError('This username is already taken. Please choose another.');
      } else {
        setError(isRegister ? `Registration failed: ${err.message}` : `Login failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">🖥️</div>
          <h1>V 0.0.1 - IT Stock</h1>
          <p>{isRegister ? 'Create a new account' : 'Sign in to continue'}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label htmlFor="fullname" className="login-label">Full Name</label>
              <input
                id="fullname"
                type="text"
                className="login-input"
                placeholder="Ex: Imad Radhi"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label htmlFor="username" className="login-label">Username</label>
            <input
              id="username"
              type="text"
              className="login-input"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          {success && <div className="login-success">✅ {success}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (isRegister ? 'Creating...' : 'Signing in...') : (isRegister ? 'Create Account' : 'Sign In →')}
          </button>

          <div className="login-footer">
            <p>
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                className="login-link-btn"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                  setSuccess(null);
                }}
              >
                {isRegister ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
