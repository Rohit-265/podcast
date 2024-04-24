import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homepage';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import UserDashboard from './components/Dashboard';
import ComposePodcast from './components/composepod';
import ListenPodPage from './components/listenpod';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/compose-pod" element={<ComposePodcast />} />
        <Route path="/listen-pod" element={<ListenPodPage />} />





      </Routes>
    </Router>
  );
};

export default App;
