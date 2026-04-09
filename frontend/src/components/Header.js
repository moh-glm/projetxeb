import React from 'react';

function Header({ page, setPage }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-badge">✦</div>
          <div className="logo-words">
            <span className="logo-main">Maison Parfum</span>
            <span className="logo-sub">Luxury Fragrance</span>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`nav-btn ${page === 'add' ? 'active' : ''}`}
            onClick={() => setPage('add')}
          >
            Add Product
          </button>
          <button
            className={`nav-btn ${page === 'view' ? 'active' : ''}`}
            onClick={() => setPage('view')}
          >
            Collection
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
