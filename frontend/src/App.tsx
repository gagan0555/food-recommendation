import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import Explore from "./pages/Explore";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import QuestionDetail from "./pages/QuestionDetail";
import AskQuestion from "./pages/AskQuestion";
import "./App.css";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    setLoading(false);

    // Listen for storage changes (login/logout from other tabs or pages)
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("authToken");
      setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading while checking auth

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Landing /> : <Navigate to="/auth" />} />
        <Route path="/explore" element={isLoggedIn ? <Explore /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!isLoggedIn ? <Auth /> : <Navigate to="/" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/auth" />} />
        <Route path="/ask" element={isLoggedIn ? <AskQuestion /> : <Navigate to="/auth" />} />
        <Route path="/question/:id" element={isLoggedIn ? <QuestionDetail /> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
