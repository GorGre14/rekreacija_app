import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Providers
import { AppProvider } from "./Context/AppContext";

// UI
import Navbar from "./Components/Navbar";

// Pages
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import CreateEventPage from "./Pages/CreateEventPage";
import EventDetailsPage from "./Pages/EventDetailsPage";
import EditEventPage from "./Pages/EditEventPage";
import ProfilePage from "./Pages/ProfilePage";

// Guard
import ProtectedRoute from "./Components/ProtectedRoute";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Navbar />
        <div style={{ padding: 16 }}>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route
              path="/events/:id/edit"
              element={
                <ProtectedRoute>
                  <EditEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}
