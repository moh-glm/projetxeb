import React, { useState } from 'react';
import Header from './components/Header';
import AddProduct from './components/AddProduct';
import ViewProducts from './components/ViewProducts';
import './App.css';

function App() {
  const [page, setPage] = useState('view');

  return (
    <div className="app">
      {/* Animated silk background */}
      <div className="bg-silk">
        <div className="silk-fabric" />
        <div className="silk-sheen" />
        <div className="silk-sheen silk-sheen-2" />
        <div className="silk-fold silk-fold-1" />
        <div className="silk-fold silk-fold-2" />
        <div className="silk-fold silk-fold-3" />
        <div className="silk-gold-glow" />
        <div className="sparkles" />
      </div>

      <Header page={page} setPage={setPage} />

      <main className="main-content">
        {page === 'add'
          ? <AddProduct setPage={setPage} />
          : <ViewProducts />
        }
      </main>

      <footer className="footer">
        &copy; 2026 &nbsp;✦&nbsp; Maison Parfum &nbsp;✦&nbsp; Luxury Fragrance Catalog
      </footer>
    </div>
  );
}

export default App;
