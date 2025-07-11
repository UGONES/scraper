import { useAuth } from "../context/AuthContext";
import '../css/dashboard.css';

const DashboardHome = () => {
  const { auth } = useAuth();
  const isAdmin = auth?.role === "admin";

  return (
    <div className="dashboard-home">
      <h2 className="home-header">Welcome back, {auth?.username || auth?.email || "User"}!</h2>

      {isAdmin ? (
        <>
          <p className="home-decscript">This is your personal dashboard. Use the sidebar to:</p>
          <ul>
            <li className="home-list">👥 Manage all users</li>
            <li className="home-list">📂 Review scraping history</li>
            <li className="home-list">📝 Edit your profile details</li>
          </ul>
        </>
      ) : (
        <>
          <p className="home-decscript">This is your personal dashboard. Use the sidebar to:</p>
          <ul>
            <li className="home-list">📂 View your scrape history</li>
            <li className="home-list">📝 Update your account profile</li>
          </ul>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
// Note: This component serves as a landing page for the dashboard.
// It provides a brief overview of the user's role and available actions.