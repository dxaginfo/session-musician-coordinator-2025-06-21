import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import store from './redux/store';
import { loadUser } from './redux/slices/authSlice';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';

// Auth Pages
import RegisterPage from './pages/Register/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';

// Main Pages
import HomePage from './pages/Home/HomePage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import SearchPage from './pages/Search/SearchPage';
import AboutPage from './pages/About/AboutPage';
import ContactPage from './pages/Contact/ContactPage';

// Musician Pages
import MusicianProfileSetupPage from './pages/Musician/MusicianProfileSetupPage';
import MusicianProfilePage from './pages/Musician/MusicianProfilePage';
import MusicianEditProfilePage from './pages/Musician/MusicianEditProfilePage';
import MusicianBookingsPage from './pages/Musician/MusicianBookingsPage';

// Client Pages
import ClientProfileSetupPage from './pages/Client/ClientProfileSetupPage';
import ClientProfilePage from './pages/Client/ClientProfilePage';
import ClientEditProfilePage from './pages/Client/ClientEditProfilePage';
import ClientProjectsPage from './pages/Client/ClientProjectsPage';

// Project Pages
import ProjectDetailsPage from './pages/Project/ProjectDetailsPage';
import CreateProjectPage from './pages/Project/CreateProjectPage';
import EditProjectPage from './pages/Project/EditProjectPage';

// Booking Pages
import BookingDetailsPage from './pages/Booking/BookingDetailsPage';
import CreateBookingPage from './pages/Booking/CreateBookingPage';

// Not Found
import NotFoundPage from './pages/NotFound/NotFoundPage';

// Private Route Component
interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = store.getState().auth.isAuthenticated;
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

const App: React.FC = () => {
  useEffect(() => {
    // Check for token and load user
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Alert />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/search" element={<SearchPage />} />
              
              {/* Musician Public Profile */}
              <Route path="/musicians/:id" element={<MusicianProfilePage />} />

              {/* Client Public Profile */}
              <Route path="/clients/:id" element={<ClientProfilePage />} />

              {/* Private Routes */}
              <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
              
              {/* Musician Routes */}
              <Route path="/musician-profile-setup" element={<PrivateRoute element={<MusicianProfileSetupPage />} />} />
              <Route path="/musician/edit-profile" element={<PrivateRoute element={<MusicianEditProfilePage />} />} />
              <Route path="/musician/bookings" element={<PrivateRoute element={<MusicianBookingsPage />} />} />
              
              {/* Client Routes */}
              <Route path="/client-profile-setup" element={<PrivateRoute element={<ClientProfileSetupPage />} />} />
              <Route path="/client/edit-profile" element={<PrivateRoute element={<ClientEditProfilePage />} />} />
              <Route path="/client/projects" element={<PrivateRoute element={<ClientProjectsPage />} />} />
              
              {/* Project Routes */}
              <Route path="/projects/new" element={<PrivateRoute element={<CreateProjectPage />} />} />
              <Route path="/projects/:id" element={<PrivateRoute element={<ProjectDetailsPage />} />} />
              <Route path="/projects/:id/edit" element={<PrivateRoute element={<EditProjectPage />} />} />
              
              {/* Booking Routes */}
              <Route path="/bookings/new" element={<PrivateRoute element={<CreateBookingPage />} />} />
              <Route path="/bookings/:id" element={<PrivateRoute element={<BookingDetailsPage />} />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;