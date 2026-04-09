import React, { useState, useCallback } from 'react';
import ToastContainer from './Toast';

const API_URL = process.env.REACT_APP_API_URL || '';

let toastIdCounter = 0;

function AddProduct({ setPage }) {
  const [form, setForm]           = useState({ name: '', description: '', price: '', image: null });
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [preview, setPreview]     = useState(null);
  const [toasts, setToasts]       = useState([]);
  const [fileName, setFileName]   = useState('');

  const addToast = (type, message) => {
    setToasts(prev => [...prev, { id: ++toastIdCounter, type, message }]);
  };

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = 'Product name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price)              e.price       = 'Price is required';
    else if (isNaN(form.price) || parseFloat(form.price) <= 0)
                                  e.price       = 'Price must be a positive number';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('error', 'Only image files are allowed');
      return;
    }
    setForm(prev => ({ ...prev, image: file }));
    setFileName(file.name);
    setErrors(prev => ({ ...prev, image: '' }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name',        form.name.trim());
      fd.append('description', form.description.trim());
      fd.append('price',       form.price);
      if (form.image) fd.append('image', form.image);

      const res  = await fetch(`${API_URL}/api/products`, { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) {
        addToast('error', data.error || 'Failed to add product');
      } else {
        addToast('success', `"${form.name}" added to the collection!`);
        setForm({ name: '', description: '', price: '', image: null });
        setPreview(null);
        setFileName('');
        setErrors({});
        const fi = document.getElementById('img-upload');
        if (fi) fi.value = '';
      }
    } catch {
      addToast('error', 'Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="form-wrap">
        <div className="s-header">
          <p className="s-eyebrow">✦ curate your collection</p>
          <h1 className="s-title">Add a New <em>Fragrance</em></h1>
          <div className="s-line" />
        </div>

        <div className="glass-card">
          <form onSubmit={handleSubmit} noValidate>

            {/* Name */}
            <div className="f-group">
              <input
                className={`f-input${errors.name ? ' err' : ''}`}
                type="text" name="name" id="name"
                value={form.name} onChange={handleChange}
                placeholder=" "
                autoComplete="off"
              />
              <label className="f-label" htmlFor="name">Product Name *</label>
              {errors.name && <p className="f-err">{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="f-group is-textarea">
              <textarea
                className={`f-input f-textarea${errors.description ? ' err' : ''}`}
                name="description" id="description"
                value={form.description} onChange={handleChange}
                placeholder=" "
              />
              <label className="f-label" htmlFor="description">Description *</label>
              {errors.description && <p className="f-err">{errors.description}</p>}
            </div>

            {/* Price */}
            <div className="f-group">
              <input
                className={`f-input${errors.price ? ' err' : ''}`}
                type="number" name="price" id="price"
                value={form.price} onChange={handleChange}
                placeholder=" " step="0.01" min="0.01"
              />
              <label className="f-label" htmlFor="price">Price (€) *</label>
              {errors.price && <p className="f-err">{errors.price}</p>}
            </div>

            {/* Image upload */}
            <div className="upload-box">
              <input type="file" id="img-upload" accept="image/*" onChange={handleImage} />
              <div className="upload-inner">
                {preview ? (
                  <div className="img-preview">
                    <img src={preview} alt="preview" />
                  </div>
                ) : (
                  <>
                    <span className="upload-icon">⬆</span>
                    <span className="upload-text">
                      {fileName || 'Choose product image'}
                    </span>
                    <span className="upload-hint">PNG, JPG up to 5 MB — optional</span>
                  </>
                )}
                {fileName && preview && (
                  <span className="upload-text" style={{ marginTop: '0.5rem', fontSize: '0.72rem' }}>
                    {fileName}
                  </span>
                )}
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading && <span className="btn-spinner" />}
              {loading ? 'Adding to Collection...' : 'Add to Collection'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem', letterSpacing: '1px', color: 'var(--text-muted)' }}>
          <button className="link-btn" onClick={() => setPage('view')}>
            ← View all fragrances
          </button>
        </p>
      </div>
    </>
  );
}

export default AddProduct;
