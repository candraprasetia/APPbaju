import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '' });
  const [image, setImage] = useState(null);
  
  // State untuk menandakan apakah sedang dalam mode edit atau tambah baru
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = () => {
    axios.get('http://127.0.0.1:8000/api/products')
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
    if (image) {
      formData.append('image', image);
    }

    if (editingId) {
      // PROSES UPDATE
      axios.post(`http://127.0.0.1:8000/api/products/${editingId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(() => {
        handleCancelEdit();
        fetchProducts();
      });
    } else {
      // PROSES TAMBAH BARU
      axios.post('http://127.0.0.1:8000/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(() => {
        setForm({ name: '', price: '' });
        setImage(null);
        // Reset file input secara manual
        document.getElementById('fileInput').value = "";
        fetchProducts();
      });
    }
  };

  // Fungsi untuk mengisi form dengan data barang yang mau diedit
  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({ name: product.name, price: product.price });
    setImage(null); 
    document.getElementById('fileInput').value = ""; // Kosongkan pilihan file
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Otomatis scroll ke atas
  };

  // Fungsi membatalkan mode edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', price: '' });
    setImage(null);
    document.getElementById('fileInput').value = "";
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      axios.delete(`http://127.0.0.1:8000/api/products/${id}`).then(() => fetchProducts());
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
                  {/* Kolom Penampil Gambar */}
                  <td>
                    {p.image ? (
                      <img 
                        src={`http://127.0.0.1:8000/storage/${p.image}`} 
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