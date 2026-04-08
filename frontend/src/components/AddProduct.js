import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || '';

function AddProduct({ setCurrentPage }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });
  const [errors, setErrors]           = useState({});
  const [successMsg, setSuccessMsg]   = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]         = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // ── Front-end validation ───────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim())
      errs.name = 'Product name is required';
    if (!form.description.trim())
      errs.description = 'Description is required';
    if (!form.price) {
      errs.price = 'Price is required';
    } else if (isNaN(form.price) || parseFloat(form.price) <= 0) {
      errs.price = 'Price must be a positive number';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Only image files are allowed' }));
      return;
    }
    setForm(prev => ({ ...prev, image: file }));
    setErrors(prev => ({ ...prev, image: '' }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name',        form.name.trim());
      formData.append('description', form.description.trim());
      formData.append('price',       form.price);
      if (form.image) formData.append('image', form.image);

      const res  = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'An error occurred while adding the product');
      } else {
        setSuccessMsg('Product added successfully!');
        setForm({ name: '', description: '', price: '', image: null });
        setImagePreview(null);
        setErrors({});
        // Reset the file input
        const fileInput = document.getElementById('image');
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      setServerError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="page-title">New <span>Perfume</span></h2>
      <div className="luxury-divider"><span>✦ add to collection ✦</span></div>

      {successMsg && (
        <div className="alert alert-success">
          <span>{successMsg}</span>
          <button className="link-btn" onClick={() => setCurrentPage('view')}>
            View all products &rarr;
          </button>
        </div>
      )}
      {serverError && (
        <div className="alert alert-error">{serverError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate className="product-form">
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">Product Name <span className="required">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
            placeholder="e.g. Chanel No. 5"
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description <span className="required">*</span></label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className={errors.description ? 'input-error' : ''}
            placeholder="Describe the fragrance, notes, occasion..."
            rows={4}
          />
          {errors.description && <span className="error-msg">{errors.description}</span>}
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="price">Price (€) <span className="required">*</span></label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            className={errors.price ? 'input-error' : ''}
            placeholder="e.g. 89.99"
            step="0.01"
            min="0.01"
          />
          {errors.price && <span className="error-msg">{errors.price}</span>}
        </div>

        {/* Image */}
        <div className="form-group">
          <label htmlFor="image">Product Image <span className="optional">(optional)</span></label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {errors.image && <span className="error-msg">{errors.image}</span>}
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
