import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';

// Login route component - checks auth and shows login if needed
function LoginRoute() {
  const { currentUser, loading } = useAuth();

  // While loading, show a minimal loading state
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)'
      }}>
        <div style={{ color: '#34d399' }}>Loading...</div>
      </div>
    );
  }

  // If already logged in, redirect to home
  if (currentUser) {
    return <Navigate to="/Learning" replace />;
  }

  // If not logged in, show login page
  return <Login />;
}

export default LoginRoute;
