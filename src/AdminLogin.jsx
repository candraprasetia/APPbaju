import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Bypass login sementara untuk langsung masuk ke sistem CRUD
    navigate('/admin/dashboard');
  };

  return (
    <div className="login-wrapper">
      <motion.div className="login-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <h2>Admin Portal</h2>
        <p>Akses khusus pengelola CR Thrift</p>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group"><input type="text" placeholder="Username" required /></div>
          <div className="input-group"><input type="password" placeholder="Password" required /></div>
          <button type="submit" className="btn-login">Masuk Dashboard</button>
        </form>
        <Link to="/" className="back-link">Kembali ke Katalog</Link>
      </motion.div>
    </div>
  );
}