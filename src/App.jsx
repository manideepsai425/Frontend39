import React, { useState, useRef, useEffect } from 'react'
import Form from './components/Form'
import Results from './components/Results'
import { predictSupplyChain } from './api'

/* ─────────────────────────────────────────────
   Injected styles — drop into index.css if preferred
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;1,300;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green-deep:   #1a3a2a;
    --green-mid:    #2d6a4f;
    --green-bright: #40916c;
    --green-soft:   #74c69d;
    --green-pale:   #b7e4c7;
    --cream:        #fdf8f0;
    --cream-dark:   #f5ede0;
    --amber:        #e9a03b;
    --amber-light:  #ffd166;
    --red-soft:     #e05c5c;
    --text-primary: #1a2e20;
    --text-muted:   #6b8575;
    --white:        #ffffff;
    --card-bg:      rgba(255,255,255,0.72);
    --card-border:  rgba(45,106,79,0.12);
    --shadow-sm:    0 2px 12px rgba(26,58,42,0.08);
    --shadow-md:    0 8px 32px rgba(26,58,42,0.13);
    --shadow-lg:    0 20px 60px rgba(26,58,42,0.18);
    --radius-sm:    14px;
    --radius-md:    22px;
    --radius-lg:    32px;
    --radius-pill:  999px;
    --font-display: 'Fraunces', Georgia, serif;
    --font-body:    'DM Sans', system-ui, sans-serif;
    --transition:   all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  html { scroll-behavior: smooth; -webkit-tap-highlight-color: transparent; }

  body {
    font-family: var(--font-body);
    background: var(--cream);
    color: var(--text-primary);
    min-height: 100dvh;
    overscroll-behavior: none;
  }

  /* ── App shell ── */
  .app-root {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Background ── */
  .bg-mesh {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 15% 10%,  rgba(116,198,157,0.22) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 85% 90%,  rgba(233,160,59,0.14)  0%, transparent 55%),
      radial-gradient(ellipse 50% 70% at 50% 50%,  rgba(64,145,108,0.07)  0%, transparent 70%),
      var(--cream);
  }
  .bg-grain {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
  }

  /* ── Header ── */
  .app-header {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 0 20px;
    height: 62px;
    display: flex;
    align-items: center;
    background: rgba(253,248,240,0.82);
    backdrop-filter: blur(20px) saturate(1.6);
    -webkit-backdrop-filter: blur(20px) saturate(1.6);
    border-bottom: 1px solid rgba(45,106,79,0.10);
    animation: slideDown 0.5s cubic-bezier(0.4,0,0.2,1) both;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .header-inner {
    width: 100%;
    max-width: 820px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
  }
  .logo-icon-wrap {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--green-mid), var(--green-bright));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    box-shadow: 0 3px 10px rgba(45,106,79,0.35);
  }
  .logo-text {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--green-deep);
    letter-spacing: -0.02em;
  }
  .nav-pill {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--green-bright);
    background: rgba(64,145,108,0.1);
    padding: 5px 12px;
    border-radius: var(--radius-pill);
    border: 1px solid rgba(64,145,108,0.2);
  }

  /* ── Hero ── */
  .hero {
    position: relative;
    z-index: 2;
    padding: 52px 24px 36px;
    text-align: center;
    animation: fadeUp 0.6s 0.1s cubic-bezier(0.4,0,0.2,1) both;
  }
  /* FIX: Added missing .hero-inner styles */
  .hero-inner {
    max-width: 560px;
    margin: 0 auto;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--amber);
    background: rgba(233,160,59,0.12);
    padding: 5px 14px;
    border-radius: var(--radius-pill);
    border: 1px solid rgba(233,160,59,0.28);
    margin-bottom: 18px;
  }
  .hero-eyebrow::before { content: '✦'; font-size: 0.6rem; }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 8vw, 3.4rem);
    font-weight: 500;
    line-height: 1.12;
    color: var(--green-deep);
    letter-spacing: -0.03em;
    margin-bottom: 16px;
  }
  .hero-title em {
    font-style: italic;
    color: var(--green-bright);
    font-weight: 300;
  }
  .hero-desc {
    font-size: 0.95rem;
    line-height: 1.65;
    color: var(--text-muted);
    max-width: 480px;
    margin: 0 auto;
    font-weight: 300;
  }

  /* ── Main grid ── */
  .main-content {
    position: relative;
    z-index: 2;
    flex: 1;
    padding: 0 16px 32px;
  }
  .content-grid {
    max-width: 820px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  @media (min-width: 760px) {
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: start;
    }
  }

  /* ── Cards ── */
  .card {
    background: var(--card-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--card-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    transition: var(--transition);
    animation: fadeUp 0.55s 0.2s cubic-bezier(0.4,0,0.2,1) both;
  }
  .card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
  .card-header {
    padding: 20px 22px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .card-header-icon {
    width: 34px; height: 34px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }
  .icon-green { background: rgba(64,145,108,0.14); }
  .icon-amber { background: rgba(233,160,59,0.14); }
  .card-header-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .card-body { padding: 0 22px 22px; }

  /* ── Empty state ── */
  .empty-state {
    padding: 36px 22px;
    text-align: center;
    animation: fadeUp 0.5s 0.3s cubic-bezier(0.4,0,0.2,1) both;
  }
  .empty-icon-wrap {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, rgba(116,198,157,0.2), rgba(64,145,108,0.15));
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    margin: 0 auto 16px;
    border: 1px solid rgba(64,145,108,0.15);
  }
  .empty-title {
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 500;
    color: var(--green-deep);
    margin-bottom: 8px;
  }
  .empty-desc {
    font-size: 0.87rem;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 22px;
  }
  .empty-hints {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: left;
  }
  .empty-hints li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.84rem;
    color: var(--text-muted);
    background: rgba(116,198,157,0.1);
    border: 1px solid rgba(116,198,157,0.2);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
  }

  /* ── Loading state ── */
  .loading-state {
    padding: 44px 22px;
    text-align: center;
    animation: fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
  }
  .loading-animation {
    position: relative;
    width: 72px; height: 72px;
    margin: 0 auto 20px;
  }
  .pulse-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2.5px solid var(--green-soft);
    animation: pulse 1.6s ease-in-out infinite;
  }
  .pulse-ring:nth-child(2) { animation-delay: 0.5s; }
  .pulse-ring:nth-child(3) { animation-delay: 1s; }
  @keyframes pulse {
    0%   { transform: scale(0.6); opacity: 1; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  .loading-icon {
    position: absolute;
    inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    animation: sway 2.4s ease-in-out infinite;
  }
  @keyframes sway {
    0%, 100% { transform: rotate(-6deg) scale(1); }
    50%       { transform: rotate(6deg)  scale(1.08); }
  }
  .loading-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--green-deep);
    margin-bottom: 6px;
  }
  .loading-desc {
    font-size: 0.83rem;
    color: var(--text-muted);
  }
  .loading-dots { display: inline-flex; gap: 4px; margin-top: 14px; }
  .loading-dots span {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--green-soft);
    animation: dotBounce 1.2s ease-in-out infinite;
  }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dotBounce {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
    40%           { transform: scale(1.2); opacity: 1; }
  }

  /* ── Results wrapper ── */
  .results-wrapper {
    animation: revealUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
  }
  @keyframes revealUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Scroll indicator ── */
  .scroll-hint {
    display: flex;
    align-items: center;
    gap: 7px;
    justify-content: center;
    margin-top: 10px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--green-bright);
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.4s ease, transform 0.4s ease;
  }
  .scroll-hint.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .scroll-hint svg {
    animation: bounce 1.5s ease-in-out infinite;
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(4px); }
  }

  /* ── Error banner ── */
  .error-banner {
    background: rgba(224,92,92,0.08);
    border: 1px solid rgba(224,92,92,0.22);
    border-radius: var(--radius-md);
    padding: 16px 18px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    animation: fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
    margin-top: 4px;
  }
  .error-icon {
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .error-text {
    font-size: 0.85rem;
    color: #b53939;
    line-height: 1.55;
  }

  /* ── Footer ── */
  .app-footer {
    position: relative;
    z-index: 2;
    padding: 18px 24px;
    text-align: center;
    border-top: 1px solid rgba(45,106,79,0.08);
  }
  .app-footer p {
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }
  .footer-dot {
    display: inline-block;
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--green-pale);
    vertical-align: middle;
    margin: 0 6px;
  }

  /* ── Safe area for iPhone ── */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .app-footer { padding-bottom: calc(18px + env(safe-area-inset-bottom)); }
    .app-header  { padding-top: env(safe-area-inset-top); }
  }
`

export default function App() {
  const [loading, setLoading]     = useState(false)
  const [results, setResults]     = useState(null)
  const [error, setError]         = useState(null)
  const [lastInput, setLastInput] = useState(null)
  const [showScrollHint, setShowScrollHint] = useState(false)

  const resultsRef = useRef(null)

  /* Auto-scroll to results when they arrive */
  useEffect(() => {
    if ((results || error) && resultsRef.current) {
      const isMobile = window.innerWidth < 760
      if (isMobile) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setShowScrollHint(false)
      } else {
        const rect = resultsRef.current.getBoundingClientRect()
        if (rect.top > window.innerHeight * 0.75) {
          setShowScrollHint(true)
          setTimeout(() => setShowScrollHint(false), 4000)
        }
      }
    }
  }, [results, error])

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    setResults(null)
    setLastInput(formData)
    setShowScrollHint(false)

    if (window.innerWidth < 760 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
    }

    try {
      const res = await predictSupplyChain(formData)
      setResults(res.data)
    } catch (err) {
      if (err.response) {
        const detail = err.response.data?.detail || err.response.data?.message || JSON.stringify(err.response.data)
        setError(`Server error ${err.response.status}: ${detail}`)
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The server may be waking up (cold start). Please try again in a moment.')
      } else if (err.request) {
        setError('No response from server. Please check your connection or try again later.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const hasContent = results || error || loading

  return (
    <>
      <style>{styles}</style>

      <div className="app-root">
        <div className="bg-mesh" />
        <div className="bg-grain" />

        {/* ── Header ── */}
        <header className="app-header">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-icon-wrap">🌾</div>
              <span className="logo-text">HarvestIQ</span>
            </div>
            <nav>
              <span className="nav-pill">Supply Chain AI</span>
            </nav>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-inner">
            <p className="hero-eyebrow">Powered by AI</p>
            <h1 className="hero-title">
              Predict. Analyse.<br />
              <em>Optimise.</em>
            </h1>
            <p className="hero-desc">
              Enter your crop parameters and get real-time predictions on demand,
              supply gaps, and spoilage risk — smarter distribution decisions, instantly.
            </p>
          </div>
        </section>

        {/* ── Main ── */}
        <main className="main-content">
          <div className="content-grid">

            {/* Form card */}
            <div className="form-column">
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon icon-green">📋</div>
                  <span className="card-header-label">Crop Parameters</span>
                </div>
                <div className="card-body">
                  <Form onSubmit={handleSubmit} loading={loading} />
                </div>
              </div>
            </div>

            {/* Results card */}
            <div className="results-column" ref={resultsRef}>
              <div className="card" style={{ minHeight: 280 }}>
                {/* Empty state */}
                {!hasContent && (
                  <div className="empty-state">
                    <div className="empty-icon-wrap">🔍</div>
                    <p className="empty-title">No results yet</p>
                    <p className="empty-desc">
                      Fill in the form and tap <strong>Run Analysis</strong> to see AI predictions.
                    </p>
                    <ul className="empty-hints">
                      <li>📦 <span><strong>Demand</strong> — estimated market need</span></li>
                      <li>⚖️ <span><strong>Supply Gap</strong> — surplus or deficit</span></li>
                      <li>🔴 <span><strong>Spoilage Risk</strong> — environmental risk level</span></li>
                    </ul>
                  </div>
                )}

                {/* Loading */}
                {loading && (
                  <div className="loading-state">
                    <div className="loading-animation">
                      <div className="pulse-ring" />
                      <div className="pulse-ring" />
                      <div className="pulse-ring" />
                      <span className="loading-icon">🌾</span>
                    </div>
                    <p className="loading-title">Analysing supply chain…</p>
                    <p className="loading-desc">Running AI model on your parameters</p>
                    <div className="loading-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && !loading && (
                  <div style={{ padding: '18px 22px' }}>
                    <div className="card-header" style={{ padding: 0, marginBottom: 14 }}>
                      <div className="card-header-icon icon-amber">⚠️</div>
                      <span className="card-header-label">Error</span>
                    </div>
                    <div className="error-banner">
                      <span className="error-icon">🚨</span>
                      <p className="error-text">{error}</p>
                    </div>
                  </div>
                )}

                {/* Results */}
                {results && !loading && (
                  <div className="results-wrapper">
                    <div className="card-header">
                      <div className="card-header-icon icon-green">✅</div>
                      <span className="card-header-label">Analysis Results</span>
                    </div>
                    <div className="card-body">
                      <Results data={results} error={null} inputParams={lastInput} />
                    </div>
                  </div>
                )}
              </div>

              {/* Scroll hint (desktop only) */}
              <div className={`scroll-hint ${showScrollHint ? 'visible' : ''}`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Scroll to see results
              </div>
            </div>

          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="app-footer">
          <p>
            HarvestIQ
            <span className="footer-dot" />
            Food Supply Chain AI
            <span className="footer-dot" />
            FastAPI + React
          </p>
        </footer>
      </div>
    </>
  )
}
