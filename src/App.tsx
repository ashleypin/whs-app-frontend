import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateReport from './pages/CreateReport';
import Profile from './pages/Profile';
import Incidents from './pages/Incidents';
import IncidentDetail from './pages/IncidentDetail';
import Workplaces from './pages/Workplaces';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/incidents/:id" element={<IncidentDetail />} />
        <Route path="/create-report" element={<CreateReport />} />
        <Route path="/workplaces" element={<Workplaces />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
