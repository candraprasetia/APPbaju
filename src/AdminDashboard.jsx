import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: 'cowok' });
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  // STATE UNTUK MUNCULIN POP-UP SUCCESS
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProducts = () => {
    axios.get('https://rc-thrift-backend-production.up.railway.app/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Gagal mengambil data:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // FUNGSI UNTUK MENAMPILKAN POP-UP SELAMA 3 DETIK
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
        showSuccessPopup("Mantap! Produk berhasil di-update!"); // POP-UP EDIT
      });
    } else {
      axios.post('https://rc-thrift-backend-production.up.railway.app/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(() => {
        setForm({ name: '', price: '', category: 'cowok' });
        setImage(null);
        document.getElementById('fileInput').value = "";
        fetchProducts();
        showSuccessPopup("Mantap! Produk baru berhasil ditambahkan!"); // POP-UP TAMBAH
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
        showSuccessPopup("Produk berhasil dihapus!"); // POP-UP HAPUS
      });
    }
  };

  return (
    <div className="dashboard-container" style={{ position: 'relative' }}>
      
      {/* KODE POP-UP MUNCUL DARI ATAS */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 20 }} 
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              backgroundColor: '#10b981', // Warna hijau elegan
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              zIndex: 9999,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>✅</span> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="dash-header">
        <h2>Dashboard Admin Thrift</h2>
        <Link to="/" className="btn-logout">Lihat Toko</Link>
      </header>

      <main className="dash-main">
        <div className="dash-form-card">
          <h3>{editingId ? "Edit Produk" : "Tambah Produk Baru"}</h3>
          <form onSubmit={handleSubmit} className="crud-form">
            <input type="text" placeholder="Nama Baju (misal: Vintage Crewneck)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input type="number" placeholder="Harga (misal: 85000)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            
            <select 
              value={form.category} 
              onChange={e => setForm({...form, category: e.target.value})} 
              required 
              style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #e4e4e7', backgroundColor: '#fafafa', fontSize: '14px', color: '#3f3f46', outline: 'none', cursor: 'pointer' }}
            >
              <option value="cowok">Koleksi Cowok</option>
              <option value="cewek">Koleksi Cewek</option>
            </select>
            
            <label style={{display: 'block', marginBottom: '5px', fontSize: '13px', color: '#71717a'}}>
              {editingId ? "Upload foto baru (Opsional, biarkan kosong jika tidak ingin ganti foto)" : "Upload foto barang"}
            </label>
            <input type="file" id="fileInput" accept="image/*" onChange={e => setImage(e.target.files[0])} required={!editingId} style={{ marginBottom: '15px' }} />

            <button type="submit" className="btn-save">
              {editingId ? "Update Data" : "Simpan ke Database"}
            </button>
            
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn-cancel" style={{marginTop: '10px'}}>
                Batal Edit
              </button>
            )}
          </form>
        </div>

        <div className="dash-table-card">
          <h3>Daftar Produk</h3>
          <table className="crud-table">
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image ? (
                      <img src={`https://rc-thrift-backend-production.up.railway.app/storage/${p.image}`} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <span style={{color: '#a1a1aa', fontSize: '12px'}}>No Image</span>
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: p.category === 'cewek' ? '#fce7f3' : '#e0f2fe', color: p.category === 'cewek' ? '#db2777' : '#0284c7' }}>
                      {p.category === 'cewek' ? 'Cewek' : 'Cowok'}
                    </span>
                  </td>
                  <td>Rp {Number(p.price).toLocaleString('id-ID')}</td>
                  <td>
                    <button onClick={() => handleEdit(p)} className="btn-edit" style={{marginRight: '8px'}}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="btn-delete">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}