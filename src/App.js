import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './components/Navigation';
import FactsList from './components/FactsList';
import LoginModal from './components/LoginModal';
import FactDetailModal from './components/FactDetailModal';
import Quiz from './components/Quiz';
import Toast from './components/Toast';

function App() {
  // State management
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedFact, setSelectedFact] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch facts from API
  const fetchFacts = async () => {
    setLoading(true);
    try {
      // Fetch multiple facts
      const promises = Array(6).fill(null).map(() => 
        axios.get('/api/facts/random')
      );
      const responses = await Promise.all(promises);
      const newFacts = responses.map((res, index) => ({
        ...res.data,
        uniqueId: Date.now() + index
      }));
      setFacts(newFacts);
      showToast('DATA LOADED SUCCESSFULLY', 'success');
    } catch (error) {
      console.error('Error fetching facts:', error);
      showToast('CONNECTION ERROR. RETRY LATER.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch today's fact
  const fetchTodaysFact = async () => {
    try {
      const response = await axios.get('/api/facts/today');
      setSelectedFact(response.data);
    } catch (error) {
      console.error('Error fetching today\'s fact:', error);
      showToast('DAILY BRIEF ACCESS FAILED', 'error');
    }
  };

  // Initial load
  useEffect(() => {
    fetchFacts();
  }, []);

  // Auto-refresh functionality (AJAX)
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchFacts();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Handle login
  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      if (response.data.success) {
        setUser(response.data.user);
        setShowLogin(false);
        showToast(`ACCESS GRANTED. WELCOME, ${response.data.user.username.toUpperCase()}`, 'success');
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    showToast('DISCONNECTED FROM SYSTEM', 'success');
  };

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  return (
    <div className="min-vh-100">
      <Navigation 
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
        onQuizClick={() => setShowQuiz(true)}
        onTodaysFactClick={fetchTodaysFact}
      />
      
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col">
            <h1 className="text-white text-center mb-4 fade-in terminal-glow">
              <span className="radiation-symbol">☢</span> A.N.O.M.A.L.Y. DATABASE <span className="radiation-symbol">☢</span>
              <br />
              <small style={{ fontSize: '0.5em', letterSpacing: '3px' }}>
                [CLASSIFIED INFORMATION SYSTEM v2.033]
              </small>
            </h1>
            
            <div className="d-flex justify-content-center gap-3 mb-4">
              <button 
                className="btn btn-light"
                onClick={fetchFacts}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner me-2"></span>
                    LOADING...
                  </>
                ) : (
                  <>
                    <span className="me-2">▶</span>
                    REFRESH DATA
                  </>
                )}
              </button>
              
              <div className="form-check form-switch d-flex align-items-center">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <label className="form-check-label text-white ms-2" htmlFor="autoRefresh">
                  AUTO-SCAN (30s)
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {showQuiz ? (
          <Quiz 
            facts={facts} 
            onClose={() => setShowQuiz(false)}
            user={user}
          />
        ) : (
          <FactsList 
            facts={facts}
            loading={loading}
            onFactClick={setSelectedFact}
          />
        )}
      </div>
      
      {/* Modals */}
      <LoginModal 
        show={showLogin}
        onHide={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
      
      <FactDetailModal 
        fact={selectedFact}
        show={!!selectedFact}
        onHide={() => setSelectedFact(null)}
      />
      
      {/* Toast notification */}
      {toast.show && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
}

export default App;