import React, { useState } from 'react';
import Header from './components/Header';
import AddProduct from './components/AddProduct';
import ViewProducts from './components/ViewProducts';
import './App.css';

function App() {
  const [page, setPage] = useState('view');

  return (
    <div className="app">
      <Header page={page} setPage={setPage} />
      <main className="main-content">
        {page === 'add'
          ? <AddProduct setPage={setPage} />
          : <ViewProducts setPage={setPage} />
        }
      </main>
      <footer className="footer">
        &copy; 2026 &nbsp;·&nbsp; Maison Parfum &nbsp;·&nbsp; Luxury Fragrance Catalog
      </footer>
    </div>
  );
}

export default App;
