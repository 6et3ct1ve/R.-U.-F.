import React from 'react';

const FactsList = ({ facts, loading, onFactClick }) => {
  if (loading && facts.length === 0) {
    return (
      <div className="text-center text-white py-5">
        <div className="terminal-glow">
          <pre style={{ color: '#00ff00', fontSize: '1.2em' }}>
{`ACCESSING ANOMALY DATABASE...
[████████████████████] 100%
DECRYPTING FILES...
PLEASE WAIT...`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {facts.map((fact, index) => (
        <div key={fact.uniqueId || fact.id} className="col-md-6 col-lg-4 fade-in">
          <div className="card fact-card h-100">
            <div className="card-body d-flex flex-column">
              <div className="mb-3">
                <span className="badge bg-primary rounded-pill">
                  FILE #{String(index + 1).padStart(3, '0')}
                </span>
                {fact.source && (
                  <span className="badge bg-secondary rounded-pill ms-2">
                    {fact.source}
                  </span>
                )}
              </div>
              
              <div className="mb-2" style={{ fontSize: '0.8em', color: '#ff6600' }}>
                <span>▶ CLASSIFICATION: </span>
                <span style={{ color: '#00ff00' }}>LEVEL-{Math.floor(Math.random() * 5) + 1}</span>
              </div>
              
              <p className="card-text flex-grow-1 terminal-text" style={{ fontSize: '0.9em' }}>
                {fact.text.length > 150 
                  ? `${fact.text.substring(0, 150)}...` 
                  : fact.text
                }
              </p>
              
              <div className="mt-2 mb-3" style={{ fontSize: '0.7em', color: '#666' }}>
                <span>TIMESTAMP: </span>
                <span className="terminal-glow">{new Date().toISOString().split('T')[0]}</span>
              </div>
              
              <div className="mt-auto">
                <button 
                  className="btn btn-gradient btn-sm w-100"
                  onClick={() => onFactClick(fact)}
                >
                  <span>▶ ACCESS FILE</span>
                </button>
              </div>
            </div>
            
            {fact.permalink && (
              <div className="card-footer bg-transparent" style={{ borderTop: '1px solid #00ff00' }}>
                <small style={{ color: '#00ff00' }}>
                  <span className="me-1">◆</span>
                  <a 
                    href={fact.permalink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    EXTERNAL LINK
                  </a>
                </small>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {facts.length === 0 && !loading && (
        <div className="col-12 text-center text-white">
          <pre className="terminal-glow" style={{ fontSize: '1.5em' }}>
{`NO DATA AVAILABLE
SYSTEM ERROR 404
PRESS [REFRESH] TO RETRY`}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FactsList;