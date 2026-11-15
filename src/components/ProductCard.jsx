import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const API_BASE = 'https://rc-thrift-backend-production.up.railway.app';

export default function ProductCard({ product, index = 0, onBuy }) {
  const [open, setOpen] = useState(false);

  // Fallback ke kolom lama "image" untuk produk sebelum fitur multi-foto
  const paths = product.images?.length
    ? product.images.map((i) => i.image_path)
    : product.image
    ? [product.image]
    : [];
  const urls = paths.map((p) => `${API_BASE}/storage/${p}`);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
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
          onClick={() => urls.length && setOpen(true)}
          style={{
            backgroundImage: urls[0] ? `url(${urls[0]})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            aspectRatio: '1 / 1',
            backgroundColor: '#f3f4f6',
            cursor: urls.length ? 'zoom-in' : 'default',
            position: 'relative',
          }}
        >
          {urls.length > 1 && (
            <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 11, fontWeight: 'bold', padding: '2px 8px', borderRadius: 12 }}>
              1/{urls.length}
            </span>
          )}
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', padding: '12px', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
            <h4 className="product-name" style={{ margin: 0, fontSize: '13px', lineHeight: '1.3', color: '#18181b', flex: 1, textAlign: 'left', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.name}
            </h4>
            <div className="product-price" style={{ fontWeight: 'bold', fontSize: '13px', color: '#18181b', whiteSpace: 'nowrap' }}>
              Rp {Number(product.price).toLocaleString('id-ID')}
            </div>
          </div>
          <button onClick={() => onBuy && onBuy(product.name)} style={{ background: '#25D366', color: 'white', padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '12px', width: '100%' }}>
            <MessageCircle size={14} /> Pesan
          </button>
        </div>
      </motion.div>

      {open &&
        createPortal(
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '16px', boxSizing: 'border-box' }}
          >
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            >
              <X size={20} />
            </button>

            <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 560 }}>
              <Swiper modules={[Navigation, Pagination, Keyboard]} navigation pagination={{ clickable: true }} keyboard spaceBetween={20} slidesPerView={1}>
                {urls.map((u, i) => (
                  <SwiperSlide key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={u} alt={`${product.name} ${i + 1}`} style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 8 }} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div onClick={(e) => e.stopPropagation()} style={{ color: '#fff', marginTop: 24, textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>{product.name}</h3>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Rp {Number(product.price).toLocaleString('id-ID')}</p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}