import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import CategoryPage from './CategoryPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/kategori/:id" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;