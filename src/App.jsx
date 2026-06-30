import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Analyzer from './pages/Analyzer.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Admin from './pages/Admin.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<Landing />} />
      <Route path="/analyze"   element={<Analyzer />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/admin"     element={<RequireAuth><RequireAdmin><Admin /></RequireAdmin></RequireAuth>} />
    </Routes>
  )
}
