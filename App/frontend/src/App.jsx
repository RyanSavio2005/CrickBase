import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddPlayer from './pages/AddPlayer';
import EditPlayer from './pages/EditPlayer';
import Login from './pages/Login';
import Register from './pages/Register';
import TeamPredictor from './pages/TeamPredictor';
import PlayerDetails from './pages/PlayerDetails';
import Profile from './pages/Profile';
import Players from './pages/Players';

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/players" element={<Players />} />
                <Route path="/add" element={<AddPlayer />} />
                <Route path="/edit/:id" element={<EditPlayer />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              <Route path="/predict" element={<TeamPredictor />} />
              <Route path="/player/:id" element={<PlayerDetails />} />
              <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;

