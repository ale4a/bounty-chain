import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { BountyProvider } from './context/BountyContext';
import { AIProvider } from './context/AIContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Bounties from './pages/Bounties';
import BountyDetail from './pages/BountyDetail';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <UserProvider>
      <BountyProvider>
        <AIProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="bounties" element={<Bounties />} />
                <Route path="bounties/:id" element={<BountyDetail />} />
                <Route path="profile" element={<Profile />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Router>
        </AIProvider>
      </BountyProvider>
    </UserProvider>
  );
};

export default App;