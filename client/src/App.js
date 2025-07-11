/*  client/src/App.js  */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Outlet,
  // useLocation
} from 'react-router-dom';

import { AuthProvider,
  //  useAuth
   } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Contact from './pages/Contact';

import DashboardRouter from './routes/DashboardRouter';
import Profile from './pages/Dashboard/Profile';
import AdminScrapes from './pages/Dashboard/Admin/AdminScrapes';
import UserScrapes from './pages/Dashboard/User/UserScapes';
import UserDashboardHome from './dashboards/userDashboard';
import AdminDashboardHome from './dashboards/adminDashboard';
import ManageUsers from './pages/Dashboard/Admin/ManageUsers';

import Navbar from './components/Navbar';
import Footer from './components/Footer';


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* ── Public routes ── */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Contact />} />


          {/* ── Protected routes ── */}
          <Route element={<ProtectedRoute />}>
            {/* layout that adds/removes sidebar as needed */}
              {/* shared dashboard entry */}
              <Route path="/dashboard" element={<DashboardRouter />} />

              {/* ADMIN */}
              <Route path="/dashboard/admin" element={<AdminDashboardHome />} />
              <Route path="/admin/scrapes" element={<AdminScrapes />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/profile" element={<Profile />} />

              {/* USER */}
              <Route path="/dashboard/user" element={<UserDashboardHome />} />
              <Route path="/user/scrapes" element={<UserScrapes />} />
              <Route path="/user/profile" element={<Profile />} />
            </Route>
        </Routes>

        <Footer />
      </AuthProvider>
    </Router>
  );
}
