import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, User, Shirt, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 1. UPDATE GET DATA API
    axios.get('https://rc-thrift-backend-production.up.railway.app/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const handleBeliWhatsApp = (namaBarang) => {
    const noWA = "6281234567890"; // Ganti pakai nomer kamu atau Rika
    const pesan = `Halo Kak, saya tertarik mau beli ${namaBarang}. Apakah barangnya masih ada?`;
    window.open(`https://wa.me/${noWA}?text=${encodeURIComponent(pesan)}`, '_blank');
  };

  return (
    <div className="marketplace-bg">
      <header className="mp-header">
        <div className="header-flex">
          <Link to="/" className="mp-logo">CR <span>THRIFT.</span></Link>
          <div className="mp-search-box">
            <Search size={16} className="search-icon-left" />
            <input type="text" placeholder="Cari crewneck, flannel..." />
          </div>
          <div className="mp-icons">
            <div className="icon-cart"><ShoppingBag size={22} /></div>
            <Link to="/admin/login" className="icon-user"><User size={22} /></Link>
          </div>
        </div>
      </header>

      <main className="mp-container">
        <section className="mp-banner">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="banner-content">
            <h2>Thrift & Streetwear Archive</h2>
            <p>Koleksi Gen Z pilihan Rika & Candra. High quality, fair price.</p>
          </motion.div>
        </section>

        <section className="mp-categories">
          <div className="category-grid">
            <div className="category-card"><div className="cat-icon-wrapper cowok"><Shirt size={24} /></div><div className="cat-text"><h4>Koleksi Cowok</h4></div></div>
            <div className="category-card"><div className="cat-icon-wrapper cewek"><Sparkles size={24} /></div><div className="cat-text"><h4>Koleksi Cewek</h4></div></div>
          </div>
        </section>

        <section className="mp-products">
          <div className="section-header"><h3>LATEST DROPS</h3></div>
          <div className="product-grid">
            {products.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>Belum ada produk. Tambahkan dari halaman Admin.</p>
            ) : products.map((product, index) => (
              <motion.div 
                key={product.id} 
                className="mp-card"
                onClick={() => handleBeliWhatsApp(product.name)}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* 2. UPDATE LINK GAMBAR STORAGE */}
                <div 
                  className="card-img-placeholder"
                  style={{
                    backgroundImage: product.image ? `url(https://rc-thrift-backend-production.up.railway.app/storage/${product.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                
                <div className="card-body">
                  <h4 className="product-name">{product.name}</h4>
                  <div className="product-price">Rp {Number(product.price).toLocaleString('id-ID')}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}