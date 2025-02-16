// src/App.js
import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { tokenManager } from './utils/TokenManager';
import axios from 'axios';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Import pages
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import ViewAllExperiencesPage from './pages/viewall';
import ManageExperience from './Admin_Pages/ManageExperiences';
import WishlistPage from './pages/WishlistPage';
import ExperienceDetails from './pages/ExperienceDetails';
import BookingPage from './pages/BookingPage';
import ViewBySubPage from './pages/ViewBySubPage';
import ContactForm from './pages/contactForm';
import AboutUs from './pages/aboutUs';
import ExperienceByLocation from './pages/ViewBydistrict';

// Setup axios interceptors
const setupAxiosInterceptors = (logoutCallback) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        tokenManager.clearSession();
        logoutCallback();
      }
      return Promise.reject(error);
    }
  );
};

const MainLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setupAxiosInterceptors(() => {
      logout();
      navigate('/signin');
    });

    return () => {
      // Cleanup if needed
    };
  }, [logout, navigate]);

  return children;
};

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Routes>
        <Route 
          path="/manage-experiences" 
          element={
            <AdminRoute>
              <ManageExperience />
            </AdminRoute>
          } 
        />
      </Routes>
    </div>
  );
};

const PublicLayout = () => {
  return (
    <div className="public-layout flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/viewall" element={<ViewAllExperiencesPage />} />
          <Route path="/experience/:id" element={<ExperienceDetails />} />
          <Route path="/contact-us" element={<ContactForm />} />
          <Route path="/about-us" element={<AboutUs />} />
          
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking" 
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/viewby/:categoryId" element={<ViewBySubPage />} />
          <Route path="/viewby/district/:districtId" element={<ExperienceByLocation />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router basename="/">
      <AuthProvider>
        <MainLayout>
          <div className="flex flex-col min-h-screen">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              />
              <Route path="/*" element={<PublicLayout />} />
            </Routes>
          </div>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
};

export default App;