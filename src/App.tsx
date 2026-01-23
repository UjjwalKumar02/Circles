import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./componentsV2//Landing";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community/:slug" element={<Community />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
