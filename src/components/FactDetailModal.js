import React from 'react';

const FactDetailModal = ({ fact, show, onHide }) => {
  if (!show || !fact) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content fact-detail-modal">
          <div className="modal-header">
            <h5 className="modal-title terminal-glow">
              <span style={{ color: '#ff6600' }}>◢◤</span> CLASSIFIED FILE <span style={{ color: '#ff6600' }}>◢◤</span>
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onHide}
              style={{ filter: 'invert(1) hue-rotate(90deg)' }}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="mb-3">
              {fact.source && (
                <span className="badge bg-primary me-2">
                  <span className="me-1">◆</span>
                  SOURCE: {fact.source}
                </span>
              )}
              {fact.language && (
                <span className="badge bg-info">
                  <span className="me-1">◆</span>
                  LANG: {fact.language.toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="mb-3" style={{ fontSize: '0.8em' }}>
              <span style={{ color: '#ff6600' }}>▶ ACCESS LEVEL: </span>
              <span style={{ color: '#00ff00' }}>AUTHORIZED</span>
              <br />
              <span style={{ color: '#ff6600' }}>▶ TIMESTAMP: </span>
              <span style={{ color: '#00ff00' }}>{new Date().toLocaleString()}</span>
              <br />
              <span style={{ color: '#ff6600' }}>▶ FILE SIZE: </span>
              <span style={{ color: '#00ff00' }}>{fact.text.length} BYTES</span>
              <br />
              <span style={{ color: '#ff6600' }}>▶ INTEGRITY: </span>
              <span style={{ color: '#00ff00' }}>100% - NO CORRUPTION DETECTED</span>
            </div>
            
            <div className="card bg-light">
              <div className="card-body">
                <pre className="lead mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'Share Tech Mono, monospace' }}>
{fact.text}
                </pre>
              </div>
            </div>
            
            {fact.source_url && (
              <div className="mt-3">
                <h6 style={{ color: '#ff6600' }}>◆ SOURCE:</h6>
                <a 
                  href={fact.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                  style={{ borderColor: '#00ff00', color: '#00ff00' }}
                >
                  <span className="me-2">▶</span>
                  ACCESS EXTERNAL LINK
                </a>
              </div>
            )}
            
            {fact.permalink && (
              <div className="mt-3">
                <h6 style={{ color: '#ff6600' }}>◆ PERMALINK:</h6>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={fact.permalink} 
                    readOnly 
                    style={{ fontFamily: 'Share Tech Mono, monospace' }}
                  />
                  <button 
                    className="btn btn-outline-secondary btn-sm" 
                    type="button"
                    style={{ borderColor: '#00ff00', color: '#00ff00' }}
                    onClick={() => {
                      navigator.clipboard.writeText(fact.permalink);
                      // Could show a toast here
                    }}
                  >
                    <span>COPY</span>
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <h6 style={{ color: '#ff6600' }}>◆ SHARE FILE:</h6>
              <div className="btn-group" role="group">
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(fact.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                  style={{ borderColor: '#00ff00', color: '#00ff00' }}
                >
                  <span>TWT</span>
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fact.permalink || window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                  style={{ borderColor: '#00ff00', color: '#00ff00' }}
                >
                  <span>FB</span>
                </a>
                <a 
                  href={`mailto:?subject=Check out this fact&body=${encodeURIComponent(fact.text)}`}
                  className="btn btn-outline-primary btn-sm"
                  style={{ borderColor: '#00ff00', color: '#00ff00' }}
                >
                  <span>MAIL</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="modal-footer" style={{ borderTop: '1px solid #00ff00' }}>
            <div className="w-100 d-flex justify-content-between align-items-center">
              <small style={{ color: '#666', fontSize: '0.7em' }}>
                SESSION: {Math.floor(Math.random() * 99999).toString().padStart(5, '0')} | 
                ZONE SECTOR: {['ALPHA', 'BETA', 'GAMMA', 'DELTA'][Math.floor(Math.random() * 4)]}-
                {Math.floor(Math.random() * 99) + 1}
              </small>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onHide}
              >
                <span className="me-2">◄</span>
                CLOSE FILE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactDetailModal;