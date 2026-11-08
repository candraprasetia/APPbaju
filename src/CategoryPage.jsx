import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function CategoryPage() {
  const { id } = useParams(); // Akan berisi 'cowok' atau 'cewek' dari URL
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://rc-thrift-backend-production.up.railway.app/api/products')
      .then(res => {
        // Saring hanya yang kategorinya sama dengan URL, lalu balik agar yang terbaru di atas
        const filtered = res.data.filter(p => p.category === id).reverse();
        setProducts(filtered);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, [id]);

  const handleBeliWhatsApp = (namaBarang) => {
    const noWA = "6281234567890";
    const pesan = `Halo Kak, saya mau pesan koleksi ${id}: ${namaBarang}. Apakah masih ready?`;
    window.open(`https://wa.me/${noWA}?text=${encodeURIComponent(pesan)}`, '_blank');
  };

  return (
    <div className="marketplace-bg">
      <header className="mp-header">
        <div className="header-flex">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#18181b', fontWeight: 'bold' }}>
            <ArrowLeft size={20} /> Kembali ke Beranda
          </Link>
        </div>
      </header>

      <main className="mp-container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="section-header">
          <h3 style={{ textTransform: 'uppercase' }}>Koleksi {id}</h3>
        </div>
        
        <div className="product-grid">
          {products.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>Belum ada barang di kategori ini.</p>
          ) : (
            products.map((product, index) => (
              <motion.div key={product.id} className="mp-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-img-placeholder" style={{ backgroundImage: product.image ? `url(https://rc-thrift-backend-production.up.railway.app/storage/${product.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', height: '200px' }}></div>
                <div className="card-body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '15px' }}>
                  <h4 className="product-name">{product.name}</h4>
                  <div className="product-price" style={{ marginBottom: '15px', fontWeight: 'bold' }}>Rp {Number(product.price).toLocaleString('id-ID')}</div>
                  <button onClick={() => handleBeliWhatsApp(product.name)} style={{ marginTop: 'auto', background: '#25D366', color: 'white', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <MessageCircle size={18} /> Pesan via WA
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}