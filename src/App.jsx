import './App.css'
import HomePage from './pages/HomePage/HomePage'
import MainPage from './pages/MainPage/MainPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLoader from './components/AppLoader/AppLoader';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import { useAuth } from './context/AuthContext';
import WelcomePage from './pages/WelcomePage/WelcomePage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  return (
    <Routes>
      {/* Welcome Page (default when logged out) */}
      <Route
        path="/"
        element={user ? <MainPage /> : <WelcomePage />}
      />
      {/* Public Route */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <HomePage />}
      />
      {/* Protected Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
