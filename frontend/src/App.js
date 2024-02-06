import "./App.css";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";
import React, { useState } from "react";
import { AuthContext } from "./context/auth-context";

function App() {
  const [user, setUser] = useState({ token: null, userId: null });

  const login = (token, userId, tokenExpiration) => {
    setUser({ token, userId });
  };
  const logout = () => {
    setUser({ token: null, userId: null });
  };
  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ ...user, login, logout, setUser }}>
        <MainNavigation />
        <main className="main-content">
          <Routes>
            {!user.token && (
              <Route path="/" element={<Navigate to="/auth" />} />
            )}
            {!user.token && <Route path="/auth" element={<AuthPage />} />}

            {/* redirect to events if logged in*/}
            {user.token && (
              <Route path="/" element={<Navigate to="/events" />} />
            )}
            {user.token && (
              <Route path="/auth" element={<Navigate to="/events" />} />
            )}
            {/* redirect to auth if bookings is accessed while logged out*/}
            {!user.token && (
              <Route path="/bookings" element={<Navigate to="/auth" />} />
            )}

            <Route path="/events" element={<EventsPage />} />
            {user.token && (
              <Route path="/bookings" element={<BookingsPage />} />
            )}
          </Routes>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
