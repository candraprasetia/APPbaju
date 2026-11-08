import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: 'cowok' }); 
  const [image, setImage] = useState(null);
  
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = () => {
    // 1. UPDATE GET DATA
    axios.get('https://rc-thrift-backend-production.up.railway.app/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Gagal mengambil data:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      // 2. UPDATE POST (EDIT)
      axios.post(`https://rc-thrift-backend-production.up.railway.app/api/products/${editingId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(() => {
        handleCancelEdit();
        fetchProducts();
      });
    } else {
      // 3. UPDATE POST (TAMBAH BARU)
      axios.post('https://rc-thrift-backend-production.up.railway.app/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(() => {
        setForm({ name: '', price: '' });
        setImage(null);
        document.getElementById('fileInput').value = "";
        fetchProducts();
      });
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({ name: product.name, price: product.price });
    setImage(null); 
    document.getElementById('fileInput').value = "";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', price: '' });
    setImage(null);
    document.getElementById('fileInput').value = "";
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      // 4. UPDATE DELETE
      axios.delete(`https://rc-thrift-backend-production.up.railway.app/api/products/${id}`).then(() => fetchProducts());
    }
  };

  return (
    <div className="dashboard-container">
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

            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '15px' }}>
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
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image ? (
                      /* 5. UPDATE TAMPILAN GAMBAR */
                      <img 
                        src={`https://rc-thrift-backend-production.up.railway.app/storage/${p.image}`} 
                        alt={p.name} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
                      />
                    ) : (
                      <span style={{color: '#a1a1aa', fontSize: '12px'}}>No Image</span>
                    )}
                  </td>
                  
                  <td>{p.name}</td>
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