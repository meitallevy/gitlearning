import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Terminal, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import neatteamLogo from '../assets/neatteam-logo.svg';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate('/Learning');
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate('/Learning');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={neatteamLogo} alt="NeatTeam Logo" className="login-icon" />
          <h1 className="login-title">Git Mastery Academy</h1>
          <p className="login-subtitle">
            {isSignUp ? 'Create an account to track your progress' : 'Sign in to continue your learning journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="login-input-group">
            <Mail className="login-input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="login-input-group">
            <Lock className="login-input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button login-button-primary"
          >
            {loading ? (
              'Loading...'
            ) : isSignUp ? (
              <>
                <UserPlus className="login-button-icon" />
                Sign Up
              </>
            ) : (
              <>
                <LogIn className="login-button-icon" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-divider">
          <span className="login-divider-text">or</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="login-button login-button-google"
        >
          <svg className="login-google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="login-footer">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="login-toggle"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
