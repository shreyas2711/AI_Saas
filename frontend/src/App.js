import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RemoveObjects from './pages/RemoveObjects';
import Home from './pages/Home';
import SharpenImage from './pages/SharpenImage';
import Login from './pages/Login';
import AuthProvider from './AuthProvider';
import ImageFolder from './pages/ImageFolder/ImageFolder';
import PaymentPage from './pages/PaymentPage';
import LayoutDesign from './LayoutDesign';
import UserDashboard from './pages/UserDashboard';
import UserLevelLayout from './UserLevelLayout';
import GenerativeReplace from './pages/GenerativeReplace';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Route for user-level layout */}
          <Route path="/userDetail" element={<UserLevelLayout />}>
            {/* Nested route under UserLevelLayout */}
            <Route path="upgrade" element={<PaymentPage />} />
            <Route path="userDashboard" element={<UserDashboard />} />
          </Route>

          {/* Route for login */}
          <Route path="/login" element={<Login />} />

          {/* LayoutDesign wraps the main layout */}
          <Route path="/" element={<LayoutDesign />}>
            {/* All child routes under the main layout */}
            <Route index element={<Home />} />
            <Route path="removeObjects" element={<RemoveObjects />} />
            <Route path="sharpenImage" element={<SharpenImage />} />
            <Route path="imageFolder" element={<ImageFolder />} />
            <Route path="replaceObject" element={<GenerativeReplace />} />
          
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
