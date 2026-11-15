import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: 'cowok' });
  const [editingId, setEditingId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Antrean & Hasil Crop Multi-Foto
  const [pendingFiles, setPendingFiles] = useState([]);
  const [stagedImages, setStagedImages] = useState([]);

  // State Modal Crop
  const [cropModalSrc, setCropModalSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const API_BASE = 'https://rc-thrift-backend-production.up.railway.app';

  const fetchProducts = () => {
    axios.get(`${API_BASE}/api/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error("Gagal mengambil data:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showSuccessPopup = (message) => {
    setSuccessMsg(message);
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  // --- ALUR 1: ANTREAN MODAL CROP BERUNTUN ---
  useEffect(() => {
    if (!cropModalSrc && pendingFiles.length > 0) {
      const nextFile = pendingFiles[0];
      const reader = new FileReader();
      reader.onload = () => setCropModalSrc(reader.result?.toString() || '');
      reader.readAsDataURL(nextFile);
    }
  }, [cropModalSrc, pendingFiles]);

  const onSelectFiles = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setPendingFiles(prev => [...prev, ...filesArray]);
    }
    e.target.value = ''; // Reset input agar bisa pilih file lagi
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    // Rasio tetap 1:1 (Kotak)
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, 1, width, height),
      width,
      height
    );
    setCrop(initialCrop);

    // Hitung koordinat pixel awal agar langsung bisa disimpan tanpa wajib digeser
    setCompletedCrop({
      unit: 'px',
      x: (initialCrop.x / 100) * width,
      y: (initialCrop.y / 100) * height,
      width: (initialCrop.width / 100) * width,
      height: (initialCrop.height / 100) * height,
    });
  };

  const handleSaveCrop = () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const previewUrl = URL.createObjectURL(blob);
        setStagedImages(prev => [...prev, { blob, previewUrl }]);
      }
      closeCropModal();
    }, 'image/jpeg', 0.92);
  };

  const closeCropModal = () => {
    setCropModalSrc(null);
    setPendingFiles(prev => prev.slice(1)); // Lanjut ke foto berikutnya di antrean
    setCrop(undefined);
    setCompletedCrop(null);
  };

  const removeStagedImage = (index) => {
    setStagedImages(prev => prev.filter((_, i) => i !== index));
  };

  // --- ALUR 2: KIRIM DATA PRODUK + SEMUA FOTO CROP KE LARAVEL ---
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editingId && stagedImages.length === 0) {
      alert("Pilih dan crop minimal 1 foto produk terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('category', form.category);

    // Masukkan semua foto hasil crop ke array images[]
    stagedImages.forEach((item, idx) => {
      formData.append('images[]', item.blob, `product-${Date.now()}-${idx}.jpg`);
    });

    const request = editingId
      ? axios.post(`${API_BASE}/api/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      : axios.post(`${API_BASE}/api/products`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

    request
      .then(() => {
        handleCancelEdit();
        fetchProducts();
        showSuccessPopup(
          editingId
            ? "Mantap! Produk berhasil di-update!"
            : "Mantap! Produk & semua foto berhasil ditambahkan!"
        );
      })
      .catch(err => {
        console.error("Gagal menyimpan produk:", err);
        alert("Terjadi kesalahan saat menyimpan data.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category || 'cowok'
    });
    setStagedImages([]);
    setPendingFiles([]);
    setExistingImages(product.images || (product.image ? [{ image_path: product.image }] : []));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', price: '', category: 'cowok' });
    setStagedImages([]);
    setPendingFiles([]);
    setExistingImages([]);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      axios.delete(`${API_BASE}/api/products/${id}`).then(() => {
        fetchProducts();
        showSuccessPopup("Produk berhasil dihapus!");
      });
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f4f4f5',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      boxSizing: 'border-box',
      padding: '12px'
    }}>

      {/* POP-UP NOTIFIKASI SUKSES */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'fixed',
              top: '15px',
              right: '15px',
              left: '15px',
              maxWidth: '400px',
              margin: '0 auto',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '14px 20px',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              zIndex: 9999,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              textAlign: 'center'
            }}
          >
            <span>✅</span> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL CROP GAMBAR (MUNCUL BERUNTUN SESUAI JUMLAH FOTO DIPILIH) */}
      <AnimatePresence>
        {cropModalSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              backgroundColor: '#ffffff',
              padding: '20px',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '480px',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#18181b' }}>
                Potong Foto Produk (1:1)
              </h3>
              <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#71717a' }}>
                Antrean foto tersisa: <strong>{pendingFiles.length}</strong>
              </p>

              <div style={{ maxHeight: '55vh', overflow: 'hidden', display: 'flex', justifyContent: 'center', backgroundColor: '#f4f4f5', borderRadius: '8px', padding: '8px' }}>
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  onComplete={c => setCompletedCrop(c)}
                  aspect={1}
                >
                  <img
                    ref={imgRef}
                    src={cropModalSrc}
                    onLoad={onImageLoad}
                    alt="Crop preview"
                    style={{ maxHeight: '50vh', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </ReactCrop>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={closeCropModal}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#e4e4e7',
                    color: '#3f3f46',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Lewati Foto Ini
                </button>
                <button
                  type="button"
                  onClick={handleSaveCrop}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Simpan Potongan
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px',
        padding: '10px 0',
        maxWidth: '1200px',
        margin: '0 auto 20px auto'
      }}>
        <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', margin: 0 }}>Dashboard Admin</h2>
        <Link to="/" className="btn-logout" style={{ padding: '8px 14px', fontSize: '14px', textDecoration: 'none' }}>
          Lihat Toko
        </Link>
      </header>

      <main style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* FORM CARD */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>
            {editingId ? "Edit Produk" : "Tambah Produk Baru"}
          </h3>

          <form onSubmit={handleSubmit} className="crud-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Nama Baju (misal: Vintage Crewneck)"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <input
              type="number"
              placeholder="Harga (misal: 85000)"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '14px', boxSizing: 'border-box' }}
            />

            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e4e4e7', backgroundColor: '#fafafa', fontSize: '14px', color: '#3f3f46', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
            >
              <option value="cowok">Koleksi Cowok</option>
              <option value="cewek">Koleksi Cewek</option>
            </select>

            {/* AREA PILIH MULTI FOTO & PREVIEW HASIL CROP */}
            <div style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1.5px dashed #d4d4d8',
              backgroundColor: '#fafafa',
              boxSizing: 'border-box'
            }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#52525b', marginBottom: '10px', fontWeight: '600' }}>
                {editingId
                  ? "Tambah/Ganti foto baru (Bisa pilih banyak foto sekaligus)"
                  : "Upload foto barang (Bisa pilih banyak foto sekaligus)"}
              </label>

              <input
                type="file"
                id="fileInput"
                accept="image/*"
                multiple
                onChange={onSelectFiles}
                style={{ width: '100%', fontSize: '14px' }}
              />

              {/* Preview Foto Lama Saat Mode Edit */}
              {editingId && existingImages.length > 0 && stagedImages.length === 0 && (
                <div style={{ marginTop: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#71717a', display: 'block', marginBottom: '6px' }}>
                    Foto tersimpan saat ini:
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {existingImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={`${API_BASE}/storage/${img.image_path}`}
                        alt="Existing"
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e4e4e7' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Foto Baru yang Sudah Di-Crop */}
              {stagedImages.length > 0 && (
                <div style={{ marginTop: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                    ✓ {stagedImages.length} foto siap di-upload (Foto pertama jadi sampul):
                  </span>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {stagedImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img
                          src={img.previewUrl}
                          alt={`Cropped ${idx + 1}`}
                          style={{
                            width: '72px',
                            height: '72px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: idx === 0 ? '2px solid #10b981' : '1px solid #d4d4d8'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeStagedImage(idx)}
                          title="Hapus foto ini"
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-save"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting
                ? "Menyimpan..."
                : editingId
                  ? "Update Data"
                  : "Simpan ke Database"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-cancel"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
              >
                Batal Edit
              </button>
            )}
          </form>
        </div>

        {/* TABLE CARD */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Daftar Produk</h3>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
            <table className="crud-table" style={{ minWidth: '600px', width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f4f4f5', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Gambar</th>
                  <th style={{ padding: '10px' }}>Nama Produk</th>
                  <th style={{ padding: '10px' }}>Kategori</th>
                  <th style={{ padding: '10px' }}>Harga</th>
                  <th style={{ padding: '10px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const imagesList = p.images && p.images.length > 0 ? p.images : [];
                  const thumbPath = imagesList.length > 0 ? imagesList[0].image_path : p.image;

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                      <td style={{ padding: '10px' }}>
                        {thumbPath ? (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img
                              src={`${API_BASE}/storage/${thumbPath}`}
                              alt={p.name}
                              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', display: 'block' }}
                            />
                            {imagesList.length > 1 && (
                              <span style={{
                                position: 'absolute',
                                bottom: '-4px',
                                right: '-6px',
                                backgroundColor: '#18181b',
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                padding: '1px 5px',
                                borderRadius: '10px'
                              }}>
                                +{imagesList.length - 1}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#a1a1aa', fontSize: '12px' }}>No Image</span>
                        )}
                      </td>
                      <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{p.name}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          backgroundColor: p.category === 'cewek' ? '#fce7f3' : '#e0f2fe',
                          color: p.category === 'cewek' ? '#db2777' : '#0284c7'
                        }}>
                          {p.category === 'cewek' ? 'Cewek' : 'Cowok'}
                        </span>
                      </td>
                      <td style={{ padding: '10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                        Rp {Number(p.price).toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleEdit(p)} className="btn-edit" style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="btn-delete" style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}