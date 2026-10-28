import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Agendar from './pages/Agendar.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendar" element={<Agendar />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
