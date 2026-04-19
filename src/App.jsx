import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Analyzer from './pages/Analyzer.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/"        element={<Landing />} />
      <Route path="/analyze" element={<Analyzer />} />
    </Routes>
  )
}
