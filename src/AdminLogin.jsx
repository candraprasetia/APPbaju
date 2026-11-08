import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Ganti email dan password ini sesuai keinginan kalian
    if (email === 'admin@.com' && password === 'admin00') {
      navigate('/admin/dashboard');
    } else {
      alert('Akses Ditolak! Email atau Password salah.');
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f4f5' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '360px' }}>
        <Lock size={40} style={{ marginBottom: '20px', color: '#18181b' }} />
        <h2 style={{ marginBottom: '24px' }}>Login Admin CR</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #e4e4e7', borderRadius: '8px' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '24px', border: '1px solid #e4e4e7', borderRadius: '8px' }} />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#18181b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Masuk Dashboard</button>
      </form>
    </div>
  );
}