import React, { useState, useEffect, useRef } from 'react';

const API_URL = process.env.REACT_APP_API_URL || '';

function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const jqXhrRef = useRef(null);

  // Initial load
  useEffect(() => {
    fetchProducts('');
    // Cleanup on unmount
    return () => {
      if (jqXhrRef.current) jqXhrRef.current.abort();
    };
  }, []);

  // Use jQuery AJAX (as required by the project spec)
  const fetchProducts = (search) => {
    setLoading(true);
    setError('');

    // Abort any pending request
    if (jqXhrRef.current) jqXhrRef.current.abort();

    const $ = window.$;
    const params = search ? { search } : {};

    jqXhrRef.current = $.ajax({
      url:     `${API_URL}/api/products`,
      type:    'GET',
      data:    params,
      success: (data) => {
        setProducts(data);
        setLoading(false);
      },
      error: (xhr, status) => {
        if (status !== 'abort') {
          setError('Failed to load products. Please try again.');
          setLoading(false);
        }
      },
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchProducts(value);
  };

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_URL}${imageUrl}`;
  };

  return (
    <div className="view-container">
      {/* Header + search bar */}
      <div className="view-header">
        <h2 className="page-title">The <span>Collection</span></h2>
        <div className="search-wrapper">
          <span className="search-icon-left">&#128269;</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading products...</span>
        </div>
      )}
      {!loading && error && (
        <div className="alert alert-error">{error}</div>
      )}
      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">&#127808;</span>
          <p>
            {searchTerm
              ? `No products found for "${searchTerm}"`
              : 'No products yet. Be the first to add a perfume!'}
          </p>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="card-image">
                {product.image_url ? (
                  <img
                    src={getImageSrc(product.image_url)}
                    alt={product.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="no-image"
                  style={{ display: product.image_url ? 'none' : 'flex' }}
                >
                  <span>&#127808;</span>
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">{product.name}</h3>
                <p className="card-description">{product.description}</p>
                <p className="card-price">
                  {parseFloat(product.price).toFixed(2)}&nbsp;€
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewProducts;
