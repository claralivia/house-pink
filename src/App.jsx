import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Agendar from './pages/Agendar.jsx'
import Entrar from './pages/Entrar.jsx'
import Painel from './pages/Painel.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendar" element={<Agendar />} />
      <Route path="/entrar" element={<Entrar />} />
      <Route path="/painel" element={<Painel />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
