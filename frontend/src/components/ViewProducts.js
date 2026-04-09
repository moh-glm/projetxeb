import React, { useState, useEffect, useRef } from 'react';
import SkeletonCard from './SkeletonCard';

const API_URL = process.env.REACT_APP_API_URL || '';

function ProductCard({ product }) {
  const imgSrc = product.image_url
    ? (product.image_url.startsWith('http') ? product.image_url : `${API_URL}${product.image_url}`)
    : null;

  return (
    <div className="p-card">
      <div className="p-img">
        {imgSrc
          ? <img src={imgSrc} alt={product.name} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
          : null
        }
        <div className="p-no-img" style={{ display: imgSrc ? 'none' : 'flex' }}>🌸</div>
        <div className="p-img-overlay" />
      </div>
      <div className="p-body">
        <span className="p-tag">✦ Fragrance</span>
        <h3 className="p-name">{product.name}</h3>
        <p className="p-desc">{product.description}</p>
        <div className="p-footer">
          <span className="p-price">{parseFloat(product.price).toFixed(2)} €</span>
          <button className="p-view-btn">Discover</button>
        </div>
      </div>
    </div>
  );
}

function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const jqRef   = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchProducts('');
    return () => {
      if (jqRef.current)    jqRef.current.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const fetchProducts = (term) => {
    setLoading(true);
    setError('');
    if (jqRef.current) jqRef.current.abort();

    const $ = window.$;
    jqRef.current = $.ajax({
      url:     `${API_URL}/api/products`,
      type:    'GET',
      data:    term ? { search: term } : {},
      success: (data) => { setProducts(data); setLoading(false); },
      error:   (xhr, status) => {
        if (status !== 'abort') {
          setError('Failed to load products. Please check the server.');
          setLoading(false);
        }
      },
    });
  };

  // Debounced search — fires 350ms after user stops typing
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchProducts(val), 350);
  };

  return (
    <div className="view-wrap">
      <div className="view-top">
        <div className="s-header" style={{ marginBottom: 0 }}>
          <p className="s-eyebrow">✦ explore our range</p>
          <h1 className="s-title">The <em>Collection</em></h1>
          <div className="s-line" />
        </div>

        <div className="search-wrap">
          <span className="search-icon-sym">◎</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search fragrances..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {!loading && !error && products.length > 0 && (
        <p className="results-count">
          <span>{products.length}</span> fragrance{products.length !== 1 ? 's' : ''}
          {search && <> matching "<span>{search}</span>"</>}
        </p>
      )}

      {loading && (
        <div className="products-grid">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && error && (
        <div className="loader"><span>⚠</span> {error}</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="empty">
          <span className="empty-icon">🌸</span>
          <p className="empty-text">
            {search ? `No fragrances found for "${search}"` : 'The collection is empty. Add your first fragrance!'}
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default ViewProducts;
