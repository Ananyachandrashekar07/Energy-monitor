import { AuthProvider } from './context/AuthContext';

import { Toaster } from 'react-hot-toast';

import { LoginPage, RegisterPage } from './pages/AuthPages';

import AnalyticsPage from './pages/AnalyticsPage';

import React from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { PublicRoute } from './routes/ProtectedRoute';

import ProtectedRoute from './routes/ProtectedRoute';

import AppLayout from './components/AppLayout';

import DashboardPage from './pages/DashboardPage';

import BuildingsPage from './pages/BuildingsPage';

import RoomsPage from './pages/RoomsPage';

import DevicesPage from './pages/DevicesPage';

import AlertsPage from './pages/AlertsPage';

import ReportsPage from './pages/ReportsPage';

// Lazy-ish: direct imports (bundle is fine for an internal app)


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color:      '#e2e8f0',
              border:     '1px solid #334155',
              borderRadius: '12px',
              fontSize:   '13px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#0f172a' } },
            error:   { iconTheme: { primary: '#f43f5e', secondary: '#0f172a' } },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected app routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard"  element={<DashboardPage />} />
              <Route path="/buildings"  element={<BuildingsPage />} />
              <Route path="/rooms"      element={<RoomsPage />} />
              <Route path="/devices"    element={<DevicesPage />} />
              <Route path="/analytics"  element={<AnalyticsPage />} />
              <Route path="/alerts"     element={<AlertsPage />} />
              <Route path="/reports"    element={<ReportsPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}