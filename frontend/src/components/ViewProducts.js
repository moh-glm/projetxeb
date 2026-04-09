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
          ? <img src={imgSrc} alt={product.name}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
          : null}
        <div className="p-no-img" style={{ display: imgSrc ? 'none' : 'flex' }}>🌸</div>
      </div>
      <div className="p-body">
        <span className="p-tag">Fragrance</span>
        <h3 className="p-name">{product.name}</h3>
        <p className="p-desc">{product.description}</p>
        <div className="p-footer">
          <span className="p-price">{parseFloat(product.price).toFixed(2)} €</span>
          <button className="p-view-btn">View</button>
        </div>
      </div>
    </div>
  );
}

function ViewProducts({ setPage }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const jqRef    = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchProducts('');
    return () => {
      if (jqRef.current)    jqRef.current.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const fetchProducts = (term) => {
    setLoading(true); setError('');
    if (jqRef.current) jqRef.current.abort();
    const $ = window.$;
    jqRef.current = $.ajax({
      url:     `${API_URL}/api/products`,
      type:    'GET',
      data:    term ? { search: term } : {},
      success: (data) => { setProducts(data); setLoading(false); },
      error:   (xhr, status) => {
        if (status !== 'abort') { setError('Failed to load products.'); setLoading(false); }
      },
    });
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchProducts(val), 350);
  };

  const firstProduct = products[0];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-left">
          <p className="hero-tag">
            New Brand <span>•</span> Luxury Fragrance <span>•</span> Long Lasting
          </p>
          <h1 className="hero-title">
            Where Scent<br />Becomes<br />Legacy
          </h1>
          <p className="hero-desc">
            Introducing exceptional fragrances crafted with premium ingredients
            and guaranteed longevity. Experience the perfect blend of heritage
            and modern luxury.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => {
              document.getElementById('collection').scrollIntoView({ behavior:'smooth' });
            }}>
              Explore Collection →
            </button>
            <button className="btn-ghost" onClick={() => setPage('add')}>
              + Add Product
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-img-wrap">
            <div className="hero-img-bg" />
            {firstProduct && firstProduct.image_url ? (
              <img
                className="hero-img-main"
                src={firstProduct.image_url.startsWith('http')
                  ? firstProduct.image_url
                  : `${API_URL}${firstProduct.image_url}`}
                alt={firstProduct.name}
              />
            ) : (
              <div className="hero-img-placeholder">
                <span className="bottle-emoji">🧴</span>
                <span className="bottle-label">Signature</span>
              </div>
            )}
            <div className="hero-badge">
              <div className="badge-label">Signature Scent</div>
              <div className="badge-value">{firstProduct ? firstProduct.name : 'Royal Oud'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat">
            <span className="stat-num">24H+</span>
            <span className="stat-txt">
              <span className="stat-txt-main">Longevity</span>
              <span className="stat-txt-sub">Guarantee</span>
            </span>
          </div>
          <div className="stat">
            <span className="stat-num">Men &</span>
            <span className="stat-txt">
              <span className="stat-txt-main">Women</span>
              <span className="stat-txt-sub">All Collections</span>
            </span>
          </div>
          <div className="stat">
            <span className="stat-num">100%</span>
            <span className="stat-txt">
              <span className="stat-txt-main">Premium Quality</span>
              <span className="stat-txt-sub">Ingredients</span>
            </span>
          </div>
          <div className="stat">
            <span className="stat-num">{products.length}+</span>
            <span className="stat-txt">
              <span className="stat-txt-main">Fragrances</span>
              <span className="stat-txt-sub">In Collection</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Products grid ── */}
      <section id="collection" className="products-section">
        <div className="products-top">
          <div>
            <p className="section-eyebrow">Our Range</p>
            <h2 className="section-title">The Collection</h2>
            <div className="section-line" />
          </div>
          <div className="search-wrap">
            <span className="search-icon-sym">◎</span>
            <input
              type="text" className="search-input"
              placeholder="Search fragrances..."
              value={search} onChange={handleSearch}
            />
          </div>
        </div>

        {!loading && !error && products.length > 0 && (
          <p className="results-count">
            <b>{products.length}</b> fragrance{products.length !== 1 ? 's' : ''}
            {search && <> matching "<b>{search}</b>"</>}
          </p>
        )}

        {loading && (
          <div className="products-grid">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && error && (
          <div className="empty"><span className="empty-icon">⚠</span><p className="empty-text">{error}</p></div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="empty">
            <span className="empty-icon">🌸</span>
            <p className="empty-text">
              {search
                ? `No fragrances found for "${search}"`
                : 'The collection is empty — add your first fragrance!'}
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}

export default ViewProducts;
