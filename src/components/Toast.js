import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      default:
        return '◆';
    }
  };

  const getToastClass = () => {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'bg-warning text-dark';
      default:
        return 'bg-info text-white';
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast show align-items-center ${getToastClass()} border-0`} 
           role="alert"
           style={{ 
             border: `2px solid ${type === 'error' ? '#ff0000' : '#00ff00'}`,
             boxShadow: `0 0 20px ${type === 'error' ? 'rgba(255,0,0,0.5)' : 'rgba(0,255,0,0.5)'}`
           }}>
        <div className="d-flex">
          <div className="toast-body" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
            <span className="me-2" style={{ fontSize: '1.2em' }}>{getIcon()}</span>
            <span style={{ textTransform: 'uppercase' }}>{message}</span>
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white me-2 m-auto" 
            onClick={onClose}
            style={{ filter: 'invert(1) hue-rotate(90deg)' }}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Toast;