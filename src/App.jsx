import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Agendar from './pages/Agendar.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Conta from './pages/Conta.jsx'
import Entrar from './pages/Entrar.jsx'
import Painel from './pages/Painel.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendar" element={<Agendar />} />
      <Route path="/entrar" element={<Entrar />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/conta" element={<Conta />} />
      <Route path="/painel" element={<Painel />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
