import React, { useEffect, useState } from 'react';

function Toast({ id, type, message, onClose }) {
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true);
      setTimeout(() => onClose(id), 350);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const handleClose = () => {
    setHiding(true);
    setTimeout(() => onClose(id), 350);
  };

  return (
    <div className={`toast ${type === 'success' ? 'ok' : 'err'} ${hiding ? 'hiding' : ''}`}>
      <span className="toast-icon">{type === 'success' ? '✓' : '✕'}</span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={handleClose}>✕</button>
    </div>
  );
}

function ToastContainer({ toasts, onClose }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onClose={onClose} />
      ))}
    </div>
  );
}

export default ToastContainer;
