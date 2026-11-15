import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, User, Shirt, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://rc-thrift-backend-production.up.railway.app/api/products')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const handleBeliWhatsApp = (namaBarang) => {
    const noWA = "6281297439419";
    const pesan = `Halo Kak, saya tertarik mau beli ${namaBarang}. Apakah barangnya masih ready?`;
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
        <section
          className="mp-banner"
          style={{
            width: '100%',
            aspectRatio: '1920 / 600',
            display: 'flex',
            backgroundImage: 'url("/banner.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="banner-content"
            style={{ width: '100%', height: '100%' }}
          ></motion.div>
        </section>

        <section className="mp-categories" style={{ marginBottom: '9px' }}>
          <div className="category-grid">
            <Link to="/kategori/cowok" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="category-card" style={{ cursor: 'pointer' }}>
                <div className="cat-icon-wrapper cowok"><Shirt size={24} /></div>
                <div className="cat-text"><h4>Koleksi Cowok</h4></div>
              </div>
            </Link>

            <Link to="/kategori/cewek" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="category-card" style={{ cursor: 'pointer' }}>
                <div className="cat-icon-wrapper cewek"><Sparkles size={24} /></div>
                <div className="cat-text"><h4>Koleksi Cewek</h4></div>
              </div>
            </Link>
          </div>
        </section>

        <section className="mp-products" style={{ paddingTop: '10px', paddingBottom: '60px' }}>
          <div className="section-header"><h3>LATEST DROPS</h3></div>
          <div className="product-grid">
            {products.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>Belum ada produk jualan.</p>
            ) : (
              products.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  onBuy={handleBeliWhatsApp}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}