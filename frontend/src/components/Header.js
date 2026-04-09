import React from 'react';

function Header({ page, setPage }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => setPage('view')}>
          <span className="logo-main">Maison Parfum</span>
          <span className="logo-sub">Where Scent Becomes Legacy</span>
        </div>
        <nav className="nav">
          <button
            className={`nav-btn ${page === 'view' ? 'active' : ''}`}
            onClick={() => setPage('view')}
          >
            Collection
          </button>
          <button
            className={`nav-btn ${page === 'add' ? 'active' : ''}`}
            onClick={() => setPage('add')}
          >
            Add Product
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
