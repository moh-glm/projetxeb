import React, { useState } from 'react';
import Header from './components/Header';
import AddProduct from './components/AddProduct';
import ViewProducts from './components/ViewProducts';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('view');

  return (
    <div className="app">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {currentPage === 'add' ? (
          <AddProduct setCurrentPage={setCurrentPage} />
        ) : (
          <ViewProducts />
        )}
      </main>
      <footer className="footer">
        <p>&copy; 2026 &nbsp;✦&nbsp; Parfum Catalog &nbsp;✦&nbsp; All rights reserved</p>
      </footer>
    </div>
  );
}

export default App;
