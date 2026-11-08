import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, User, Shirt, Sparkles, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://rc-thrift-backend-production.up.railway.app/api/products')
      .then(res => {
        // Membalik urutan array agar barang paling baru (terakhir diinput) muncul di atas
        setProducts(res.data.reverse());
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const handleBeliWhatsApp = (namaBarang) => {
    const noWA = "6281234567890"; // Ganti pakai nomer kamu atau Rika
    const pesan = `Halo Kak, saya tertarik mau beli ${namaBarang}. Apakah barangnya masih ready?`;
    window.open(`https://wa.me/${noWA}?text=${encodeURIComponent(pesan)}`, '_blank');
  };

  const ProductCard = ({ product, index }) => (
    <motion.div className="mp-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} style={{ display: 'flex', flexDirection: 'column' }}>
      <div 
        className="card-img-placeholder" 
        style={{ backgroundImage: product.image ? `url(https://rc-thrift-backend-production.up.railway.app/storage/${product.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', height: '200px' }}>
      </div>
      <div className="card-body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '15px' }}>
        <h4 className="product-name">{product.name}</h4>
        <div className="product-price" style={{ marginBottom: '15px', fontWeight: 'bold' }}>
          Rp {Number(product.price).toLocaleString('id-ID')}
        </div>
        <button onClick={() => handleBeliWhatsApp(product.name)} style={{ marginTop: 'auto', background: '#25D366', color: 'white', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
          <MessageCircle size={18} /> Pesan via WA
        </button>
      </div>
    </motion.div>
  );

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
        {/* Banner Tanpa Teks */}
        <section className="mp-banner">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="banner-content"></motion.div>
        </section>

        <section className="mp-categories">
          <div className="category-grid">
            {/* Link akan memindahkan user ke halaman /kategori/cowok */}
            <Link to="/kategori/cowok" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="category-card" style={{ cursor: 'pointer' }}>
                <div className="cat-icon-wrapper cowok"><Shirt size={24} /></div>
                <div className="cat-text"><h4>Koleksi Cowok</h4></div>
              </div>
            </Link>
            
            {/* Link akan memindahkan user ke halaman /kategori/cewek */}
            <Link to="/kategori/cewek" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="category-card" style={{ cursor: 'pointer' }}>
                <div className="cat-icon-wrapper cewek"><Sparkles size={24} /></div>
                <div className="cat-text"><h4>Koleksi Cewek</h4></div>
              </div>
            </Link>
          </div>
        </section>

        {/* Semua Produk Campur (Terbaru di atas) */}
        <section className="mp-products" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
          <div className="section-header"><h3>LATEST DROPS (Semua Produk)</h3></div>
          <div className="product-grid">
            {products.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>Belum ada produk jualan.</p>
            ) : (
              products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            )}
          </div>
        </section>
      </main>
    </div>
  );
}