import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { RideProvider } from './context/RideContext';

// Components
import Navbar from './components/Navbar';
import { ProtectedRoute, CaptainProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// User Protected Pages
import Home from './pages/Home';
import BookRide from './pages/BookRide';
import RideSearching from './pages/RideSearching';
import RideHistory from './pages/RideHistory';
import Profile from './pages/Profile';

// Captain Pages
import CaptainLogin from './pages/captain/CaptainLogin';
import CaptainRegister from './pages/captain/CaptainRegister';
import CaptainDashboard from './pages/captain/CaptainDashboard';
import CaptainRide from './pages/captain/CaptainRide';
import CaptainProfile from './pages/captain/CaptainProfile';

export default function App() {
  return (
    <AuthProvider>
      <RideProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-gray-900 selection:bg-amber-400 selection:text-gray-950">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* ── Public Routes ── */}
              <Route path="/" element={<Landing />} />

              <Route
                path="/login"
                element={
                  <PublicOnlyRoute target="user">
                    <Login />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute target="user">
                    <Register />
                  </PublicOnlyRoute>
                }
              />

              <Route
                path="/captain/login"
                element={
                  <PublicOnlyRoute target="captain">
                    <CaptainLogin />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/captain/register"
                element={
                  <PublicOnlyRoute target="captain">
                    <CaptainRegister />
                  </PublicOnlyRoute>
                }
              />

              {/* ── User / Rider Protected Routes ── */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book"
                element={
                  <ProtectedRoute>
                    <BookRide />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ride/searching"
                element={
                  <ProtectedRoute>
                    <RideSearching />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rides"
                element={
                  <ProtectedRoute>
                    <RideHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* ── Captain Protected Routes ── */}
              <Route
                path="/captain/dashboard"
                element={
                  <CaptainProtectedRoute>
                    <CaptainDashboard />
                  </CaptainProtectedRoute>
                }
              />
              <Route
                path="/captain/rides"
                element={
                  <CaptainProtectedRoute>
                    <CaptainRide />
                  </CaptainProtectedRoute>
                }
              />
              <Route
                path="/captain/profile"
                element={
                  <CaptainProtectedRoute>
                    <CaptainProfile />
                  </CaptainProtectedRoute>
                }
              />

              {/* ── Fallback ── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Toast Notification Container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1a1a2e',
                color: '#fff',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                padding: '12px 18px',
              },
              success: {
                iconTheme: {
                  primary: '#f5c518',
                  secondary: '#1a1a2e',
                },
              },
            }}
          />
        </div>
      </RideProvider>
    </AuthProvider>
  );
}