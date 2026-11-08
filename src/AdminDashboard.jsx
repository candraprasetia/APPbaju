import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: 'cowok' });
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProducts = () => {
    axios.get('https://rc-thrift-backend-production.up.railway.app/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Gagal mengambil data:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showSuccessPopup = (message) => {
    setSuccessMsg(message);
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('category', form.category); 
    
    if (image) {
      formData.append('image', image);
    }

    if (editingId) {
      axios.post(`https://rc-thrift-backend-production.up.railway.app/api/products/${editingId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(() => {
        handleCancelEdit();
        fetchProducts();
        showSuccessPopup("Mantap! Produk berhasil di-update!");
      });
    } else {
      axios.post('https://rc-thrift-backend-production.up.railway.app/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(() => {
        setForm({ name: '', price: '', category: 'cowok' });
        setImage(null);
        document.getElementById('fileInput').value = "";
        fetchProducts();
        showSuccessPopup("Mantap! Produk baru berhasil ditambahkan!");
      });
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({ name: product.name, price: product.price, category: product.category || 'cowok' });
    setImage(null); 
    document.getElementById('fileInput').value = "";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', price: '', category: 'cowok' });
    setImage(null);
    document.getElementById('fileInput').value = "";
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      axios.delete(`https://rc-thrift-backend-production.up.railway.app/api/products/${id}`).then(() => {
        fetchProducts();
        showSuccessPopup("Produk berhasil dihapus!");
      });
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      width: '100%', 
      backgroundColor: '#f4f4f5', // Pastikan warna background mencakup seluruh halaman
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      boxSizing: 'border-box',
      padding: '12px' 
    }}>
      
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 10 }} 
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'fixed',
              top: '15px',
              right: '15px',
              left: '15px',
              maxWidth: '400px',
              margin: '0 auto',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '14px 20px',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              zIndex: 9999,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              textAlign: 'center'
            }}
          >
            <span>✅</span> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <header style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px',
        padding: '10px 0'
      }}>
        <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', margin: 0 }}>Dashboard Admin</h2>
        <Link to="/" className="btn-logout" style={{ padding: '8px 14px', fontSize: '14px', textDecoration: 'none' }}>Lihat Toko</Link>
      </header>

      <main style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Form Card */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>{editingId ? "Edit Produk" : "Tambah Produk Baru"}</h3>
          <form onSubmit={handleSubmit} className="crud-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Nama Baju (misal: Vintage Crewneck)" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <input 
              type="number" 
              placeholder="Harga (misal: 85000)" 
              value={form.price} 
              onChange={e => setForm({...form, price: e.target.value})} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '14px', boxSizing: 'border-box' }}
            />
            
            <select 
              value={form.category} 
              onChange={e => setForm({...form, category: e.target.value})} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e4e4e7', backgroundColor: '#fafafa', fontSize: '14px', color: '#3f3f46', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
            >
              <option value="cowok">Koleksi Cowok</option>
              <option value="cewek">Koleksi Cewek</option>
            </select>
            
            <label style={{ display: 'block', fontSize: '13px', color: '#71717a' }}>
              {editingId ? "Upload foto baru (Opsional)" : "Upload foto barang"}
            </label>
            <input 
              type="file" 
              id="fileInput" 
              accept="image/*" 
              onChange={e => setImage(e.target.files[0])} 
              required={!editingId} 
              style={{ width: '100%', fontSize: '14px' }} 
            />

            <button type="submit" className="btn-save" style={{ width: '100%', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
              {editingId ? "Update Data" : "Simpan ke Database"}
            </button>
            
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn-cancel" style={{ width: '100%', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
                Batal Edit
              </button>
            )}
          </form>
        </div>

        {/* Table Card */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Daftar Produk</h3>
          
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
            <table className="crud-table" style={{ minWidth: '600px', width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f4f4f5', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Gambar</th>
                  <th style={{ padding: '10px' }}>Nama Produk</th>
                  <th style={{ padding: '10px' }}>Kategori</th>
                  <th style={{ padding: '10px' }}>Harga</th>
                  <th style={{ padding: '10px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                    <td style={{ padding: '10px' }}>
                      {p.image ? (
                        <img src={`https://rc-thrift-backend-production.up.railway.app/storage/${p.image}`} alt={p.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                      ) : (
                        <span style={{ color: '#a1a1aa', fontSize: '12px' }}>No Image</span>
                      )}
                    </td>
                    <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{p.name}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', backgroundColor: p.category === 'cewek' ? '#fce7f3' : '#e0f2fe', color: p.category === 'cewek' ? '#db2777' : '#0284c7' }}>
                        {p.category === 'cewek' ? 'Cewek' : 'Cowok'}
                      </span>
                    </td>
                    <td style={{ padding: '10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Rp {Number(p.price).toLocaleString('id-ID')}</td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleEdit(p)} className="btn-edit" style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="btn-delete" style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}