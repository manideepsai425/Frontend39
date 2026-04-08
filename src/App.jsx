import React, { useState, useEffect, useRef } from 'react';
import Form from './components/Form';
import Results from './components/Results';
import { predictSupplyChain } from './api';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [lastInput, setLastInput] = useState(null);

  const resultsRef = useRef(null);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if ((results || error) && !loading && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 300); // Small delay for better UX after loading finishes
    }
  }, [results, error, loading]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setLastInput(formData);

    try {
      const res = await predictSupplyChain(formData);
      setResults(res.data);
    } catch (err) {
      if (err.response) {
        const detail = err.response.data?.detail || 
                      err.response.data?.message || 
                      JSON.stringify(err.response.data);
        setError(`Server error ${err.response.status}: ${detail}`);
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The server may be waking up (cold start). Please try again.');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      {/* Background Elements */}
      <div className="bg-grain" />
      <div className="bg-circle bg-circle-1" />
      <div className="bg-circle bg-circle-2" />

      {/* Header - iPhone App Style */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🌾</span>
            <span className="logo-text">HarvestIQ</span>
          </div>
          <div className="nav-pill">AI Supply Chain Intelligence</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">POWERED BY AI • REAL-TIME INSIGHTS</p>
          <h1 className="hero-title">
            Predict.<br />
            Analyse.<br />
            <span className="highlight">Optimise.</span>
          </h1>
          <p className="hero-desc">
            Enter crop &amp; market parameters to get instant predictions on demand, 
            supply gaps, and spoilage risk.
          </p>
        </div>
      </section>

      {/* Main Content - Card-like Container */}
      <main className="main-content">
        <div className="content-container">
          <div className="form-column">
            <Form onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Results Section with Ref for Auto-scroll */}
          <div ref={resultsRef} className="results-column">
            {!results && !error && !loading && (
              <div className="empty-state">
                <div className="empty-icon">🌱</div>
                <p className="empty-title">Ready for Analysis</p>
                <p className="empty-desc">
                  Fill the form on the left and tap <strong>Run Analysis</strong><br />
                  to unlock powerful AI predictions.
                </p>
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <div className="loading-animation">
                  <div className="pulse-ring" />
                  <span className="loading-icon">🌾</span>
                </div>
                <p className="loading-title">Analysing Your Supply Chain</p>
                <p className="loading-desc">AI model is processing your data...</p>
              </div>
            )}

            <Results 
              data={results} 
              error={error} 
              inputParams={lastInput} 
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>HarvestIQ — Intelligent Food Supply Chain AI</p>
        <p className="footer-tech">Built with FastAPI + React • Designed for Farmers &amp; Distributors</p>
      </footer>
    </div>
  );
}