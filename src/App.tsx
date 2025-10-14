import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import CommunityPage from "./pages/CommunityPage";
import Explore from "./pages/ExplorePage";


function App() {
  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/community/:slug"
            element={
              <PrivateRoute>
                <CommunityPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <PrivateRoute>
                <Explore />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
