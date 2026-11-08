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
        setProducts(res.data.reverse());
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const handleBeliWhatsApp = (namaBarang) => {
    const noWA = "6281234567890"; // Ganti pakai nomer kamu/Rika
    const pesan = `Halo Kak, saya tertarik mau beli ${namaBarang}. Apakah barangnya masih ready?`;
    window.open(`https://wa.me/${noWA}?text=${encodeURIComponent(pesan)}`, '_blank');
  };

  // KARTU PRODUK YANG SUDAH DIPERBAIKI (TIDAK PANJANG LAGI)
  const ProductCard = ({ product, index }) => (
    <motion.div 
      className="mp-card" 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ delay: index * 0.1 }} 
      whileHover={{ y: -8, scale: 1.02 }} 
      style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
    >
      <div 
        className="card-img-placeholder" 
        style={{ 
          backgroundImage: product.image ? `url(https://rc-thrift-backend-production.up.railway.app/storage/${product.image})` : 'none', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          width: '100%',
          aspectRatio: '1 / 1', // INI KUNCI AGAR FOTO KOTAK SEMPURNA
          backgroundColor: '#f3f4f6'
        }}>
      </div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', padding: '12px', gap: '8px' }}>
        <h4 className="product-name" style={{ margin: 0, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#18181b' }}>
          {product.name}
        </h4>
        <div className="product-price" style={{ fontWeight: 'bold', fontSize: '14px', color: '#18181b' }}>
          Rp {Number(product.price).toLocaleString('id-ID')}
        </div>
        <button 
          onClick={() => handleBeliWhatsApp(product.name)} 
          style={{ background: '#25D366', color: 'white', padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '12px' }}
        >
          <MessageCircle size={14} /> Pesan
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
        {/* BANNER 1920x600 TERKUNCI (Ganti URL-nya dengan gambar kamu) */}
        <section 
          className="mp-banner" 
          style={{ 
            width: '100%',
            aspectRatio: '1920 / 600',
            display: 'flex',
            backgroundImage: 'url("/banner.jpg")', // Sesuaikan path ini
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="banner-content" style={{ width: '100%', height: '100%' }}></motion.div>
        </section>

        <section className="mp-categories" style={{ marginBottom: '10px' }}>
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
          
          {/* GRID PRODUK */}
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