import React from 'react';

const Navigation = ({ user, onLoginClick, onLogoutClick, onQuizClick, onTodaysFactClick }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">
        <a className="navbar-brand terminal-glow" href="/">
          <span style={{ color: '#ff6600' }}>[</span>
          S.T.A.L.K.E.R. 
          <span style={{ color: '#ff6600' }}>]</span>
          <span className="terminal-cursor"></span>
        </a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{ borderColor: '#00ff00' }}
        >
          <span style={{ color: '#00ff00' }}>≡</span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link"
                onClick={onTodaysFactClick}
              >
                <span className="me-1">[</span>
                DAILY BRIEF
                <span className="ms-1">]</span>
              </button>
            </li>
            
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link"
                onClick={onQuizClick}
              >
                <span className="me-1">[</span>
                TRAINING MODE
                <span className="ms-1">]</span>
              </button>
            </li>
            
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    <span style={{ color: '#ff6600' }}>▶</span> 
                    STALKER: {user.username.toUpperCase()}
                  </span>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link btn btn-link"
                    onClick={onLogoutClick}
                  >
                    <span className="me-1">[</span>
                    DISCONNECT
                    <span className="ms-1">]</span>
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link"
                  onClick={onLoginClick}
                >
                  <span className="me-1">[</span>
                  ACCESS SYSTEM
                  <span className="ms-1">]</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;