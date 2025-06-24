import React, { useState } from 'react';

const LoginModal = ({ show, onHide, onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Input validation
  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    const result = await onLogin(formData);
    setLoading(false);
    
    if (!result.success) {
      setErrors({ general: result.error });
    } else {
      // Reset form on success
      setFormData({ username: '', password: '' });
      setErrors({});
    }
  };

  // Handle input change with XSS prevention
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Remove potentially dangerous characters
    const sanitizedValue = value.replace(/[<>]/g, '');
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content login-card">
          <div className="modal-header border-0">
            <h5 className="modal-title terminal-glow">
              <span style={{ color: '#ff6600' }}>[</span>
              AUTHENTICATION REQUIRED
              <span style={{ color: '#ff6600' }}>]</span>
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onHide}
              disabled={loading}
              style={{ filter: 'invert(1) hue-rotate(90deg)' }}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  <span className="me-2">⚠</span>
                  ERROR: {errors.general}
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="username" className="form-label">STALKER ID:</label>
                <div className="input-group">
                  <span className="input-group-text">
                    ▶
                  </span>
                  <input 
                    type="text" 
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="ENTER_ID"
                    maxLength="20"
                    disabled={loading}
                    style={{ fontFamily: 'Share Tech Mono, monospace' }}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">ACCESS CODE:</label>
                <div className="input-group">
                  <span className="input-group-text">
                    ▶
                  </span>
                  <input 
                    type="password" 
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="ENTER_CODE"
                    maxLength="50"
                    disabled={loading}
                    style={{ fontFamily: 'Share Tech Mono, monospace' }}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
              </div>
              
              <div className="form-text terminal-glow" style={{ fontSize: '0.8em' }}>
                <span className="me-1">◆</span>
                DEMO MODE: USE ANY ID + CODE (6+ CHARS)
              </div>
            </div>
            
            <div className="modal-footer border-0">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onHide}
                disabled={loading}
              >
                [CANCEL]
              </button>
              <button 
                type="submit" 
                className="btn btn-gradient"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    <span className="me-2">▶</span>
                    CONNECT
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;