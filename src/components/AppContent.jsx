import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GitLearningPlatform from './GitLearningPlatform';
import LoginRoute from './LoginRoute';
import NotFound from './NotFound';

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Learning" replace />} />
      <Route path="/Learning" element={<GitLearningPlatform />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppContent;
