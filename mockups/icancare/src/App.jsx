import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './layouts/AppShell'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Knowledge from './pages/Knowledge'
import Reminders from './pages/Reminders'
import Centres from './pages/Centres'
import Menu from './pages/Menu'
import Article from './pages/Article'
import AddMedicine from './pages/AddMedicine'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route element={<AppShell />}>
          <Route path="/home" element={<Home />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/centres" element={<Centres />} />
          <Route path="/menu" element={<Menu />} />
        </Route>
        <Route path="/article" element={<Article />} />
        <Route path="/add-medicine" element={<AddMedicine />} />
      </Routes>
    </BrowserRouter>
  )
}
