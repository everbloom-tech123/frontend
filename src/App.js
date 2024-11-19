import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import pages
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import ViewAllExperiencesPage from './pages/viewall';
import ManageExperiences from './Admin_Pages/ManageExperience.jsx';  // Updated import
import WishlistPage from './pages/WishlistPage';
import ExperienceDetails from './pages/ExperienceDetails';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Routes>
        <Route 
          path="/manage-experiences" 
          element={
            <ProtectedRoute role="ADMIN">
              <ManageExperiences />  {/* Updated component name */}
            </ProtectedRoute>
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
          <Route index element={<HomePage />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="experience/:id" element={<ExperienceDetails />} />
          <Route path="experience" element={<ViewAllExperiencesPage />} />
          <Route 
            path="wishlist" 
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;