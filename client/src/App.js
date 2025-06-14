import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdminDashboard from './dashboards/adminDashboard';
import UserDashboard from './dashboards/userDashboard';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import Footer from './components/Footer';
import './App.css';

// This should eventually be replaced with live data
const data = [
  { id: '1', title: 'Example Scrape', description: 'This is just a test item.' },
];

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
}

function App() {
  const [query, setQuery] = useState('');

  return (
    <AuthProvider>
      <Router>
        <Navbar query={query} setQuery={setQuery} items={data} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
