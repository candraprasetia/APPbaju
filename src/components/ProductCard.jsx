import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductCard({ product }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const images = product.images || [];

  // ALUR 4a: Foto pertama untuk cover card
  const coverUrl = images.length > 0 
    ? `https://rc-thrift-backend-production.up.railway.app/storage/${images[0].image_path}` 
    : 'https://via.placeholder.com/250?text=No+Image';

  return (
    <>
      <div onClick={() => setIsLightboxOpen(true)} style={{ border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', background: 'white', overflow: 'hidden' }}>
        <img src={coverUrl} alt={product.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
        <div style={{ padding: '15px' }}>
          <h4 style={{ margin: '0 0 5px 0' }}>{product.name}</h4>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#10b981' }}>Rp {Number(product.price).toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* ALUR 4b: Lightbox dengan semua foto yang bisa digeser */}
      {isLightboxOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={() => setIsLightboxOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer' }}>✕</button>
          
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} spaceBetween={20} slidesPerView={1}>
              {images.map((img, idx) => (
                <SwiperSlide key={idx} style={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src={`https://rc-thrift-backend-production.up.railway.app/storage/${img.image_path}`} 
                    alt={`Slide ${idx}`} 
                    style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} 
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <h3 style={{ color: 'white', marginTop: '20px' }}>{product.name}</h3>
        </div>
      )}
    </>
  );
}