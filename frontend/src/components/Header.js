import React from 'react';

function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">&#127808;</span>
          <span className="logo-text">Parfum Catalog</span>
        </div>
        <nav className="nav">
          <button
            className={`nav-btn ${currentPage === 'add' ? 'active' : ''}`}
            onClick={() => setCurrentPage('add')}
          >
            Add a product
          </button>
          <button
            className={`nav-btn ${currentPage === 'view' ? 'active' : ''}`}
            onClick={() => setCurrentPage('view')}
          >
            View all products
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
