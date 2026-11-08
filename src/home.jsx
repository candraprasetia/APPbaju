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
    const noWA = "6281297439419";
    const pesan = `Halo Kak, saya tertarik mau beli ${namaBarang}. Apakah barangnya masih ready?`;
    window.open(`https://wa.me/${noWA}?text=${encodeURIComponent(pesan)}`, '_blank');
  };

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
      {/* 1. GAMBAR DIBUAT KOTAK SEMPURNA (ANTI PANJANG) */}
      <div 
        className="card-img-placeholder" 
        style={{ 
          backgroundImage: product.image ? `url(https://rc-thrift-backend-production.up.railway.app/storage/${product.image})` : 'none', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          width: '100%', 
          aspectRatio: '1 / 1', // Ini yang membuat gambar selalu proporsional
          backgroundColor: '#f3f4f6'
        }}>
      </div>
      
      {/* 2. PADDING DIKECILKAN AGAR LEBIH RINGKAS */}
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', padding: '12px', gap: '10px' }}>
        
        {/* 3. NAMA KIRI, HARGA KANAN DALAM SATU BARIS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <h4 className="product-name" style={{ 
            margin: 0, 
            fontSize: '13px', 
            lineHeight: '1.3', 
            color: '#18181b', 
            flex: 1, 
            textAlign: 'left',
            // Jika nama kepanjangan, akan dipotong jadi 2 baris (titik-titik)
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}>
            {product.name}
          </h4>
          
          <div className="product-price" style={{ fontWeight: 'bold', fontSize: '13px', color: '#18181b', whiteSpace: 'nowrap' }}>
            Rp {Number(product.price).toLocaleString('id-ID')}
          </div>
        </div>
        
        {/* 4. TOMBOL PESAN LEBIH PADAT */}
        <button onClick={() => handleBeliWhatsApp(product.name)} style={{ background: '#25D366', color: 'white', padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '12px', width: '100%' }}>
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
        {/* BANNER DIPERBESAR TINGGINYA JADI 400px (atau lebih sesuai selera) */}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="banner-content" style={{ width: '100%', height: '100%' }}></motion.div>
        </section>


        {/* JARAK BAWAH KATEGORI DIPERKECIL */}
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

        {/* JARAK ATAS PRODUK DIRAPATKAN (paddingTop jadi 10px) */}
        <section className="mp-products" style={{ paddingTop: '10px', paddingBottom: '60px' }}>
          <div className="section-header"><h3>LATEST DROPS</h3></div>
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