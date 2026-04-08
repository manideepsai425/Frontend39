/**
 * Form.jsx — HarvestIQ  ·  Redesigned
 *
 * Drop this file into src/components/Form.jsx
 * No other files need to change.
 *
 * Features
 * ─────────
 * • Vibrant teal / emerald / amber palette — zero brown
 * • Auto-scroll: every input/select focuses → scrolls that field into view
 * • Staggered entrance animations for each section
 * • Animated floating-label inputs & selects
 * • Micro-interaction on every field change (ring pulse)
 * • Progress bar that fills as you complete required fields
 * • Lively submit button with shimmer + spinner
 * • Fully mobile-first (iPhone safe-area aware)
 */

import React, { useState, useRef, useCallback, useEffect } from 'react'

/* ─────────────────────────────────────────────────────────────
   Inline CSS  (move to Form.css or index.css if you prefer)
───────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --teal-900: #0d3d3a;
  --teal-700: #0f766e;
  --teal-500: #14b8a6;
  --teal-300: #5eead4;
  --teal-100: #ccfbf1;
  --emerald:  #10b981;
  --amber:    #f59e0b;
  --amber-lt: #fde68a;
  --rose:     #f43f5e;
  --sky:      #0ea5e9;
  --purple:   #8b5cf6;
  --white:    #ffffff;
  --off-white:#f0fdf9;
  --muted:    #64748b;
  --border:   rgba(20,184,166,0.18);
  --card:     rgba(255,255,255,0.88);
  --radius:   18px;
  --radius-sm:12px;
  --pill:     999px;
  --font-d:   'Fraunces', Georgia, serif;
  --font-b:   'DM Sans', system-ui, sans-serif;
  --shadow:   0 4px 24px rgba(15,118,110,0.13);
  --shadow-lg:0 12px 48px rgba(15,118,110,0.18);
  --ease:     cubic-bezier(.4,0,.2,1);
  --spring:   cubic-bezier(.34,1.56,.64,1);
}

/* Reset */
*, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }

/* ── Form wrapper ── */
.hiq-form {
  font-family: var(--font-b);
  color: var(--teal-900);
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Form head ── */
.hiq-head {
  padding: 6px 0 22px;
  animation: hiqFadeUp .5s .05s var(--ease) both;
}
.hiq-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: .68rem;
  font-weight: 600;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--teal-700);
  background: var(--teal-100);
  border: 1px solid rgba(20,184,166,.3);
  padding: 4px 12px;
  border-radius: var(--pill);
  margin-bottom: 14px;
}
.hiq-title {
  font-family: var(--font-d);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--teal-900);
  letter-spacing: -.03em;
  line-height: 1.15;
  margin-bottom: 10px;
}
.hiq-title em { font-style: italic; color: var(--teal-500); font-weight: 400; }
.hiq-subtitle {
  font-size: .84rem;
  color: var(--muted);
  line-height: 1.6;
  font-weight: 300;
}
.hiq-req-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: .67rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--amber);
  background: rgba(245,158,11,.12);
  border: 1px solid rgba(245,158,11,.28);
  padding: 2px 8px;
  border-radius: var(--pill);
  vertical-align: middle;
  margin: 0 3px;
}

/* ── Progress bar ── */
.hiq-progress-wrap {
  margin-bottom: 20px;
  animation: hiqFadeUp .5s .1s var(--ease) both;
}
.hiq-progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: .72rem;
  font-weight: 500;
  color: var(--muted);
  margin-bottom: 7px;
}
.hiq-progress-label span:last-child { color: var(--teal-500); font-weight: 600; }
.hiq-progress-track {
  height: 6px;
  background: rgba(20,184,166,.12);
  border-radius: var(--pill);
  overflow: hidden;
}
.hiq-progress-fill {
  height: 100%;
  border-radius: var(--pill);
  background: linear-gradient(90deg, var(--teal-500), var(--emerald));
  transition: width .5s var(--spring);
  position: relative;
  overflow: hidden;
}
.hiq-progress-fill::after {
  content: '';
  position: absolute;
  top: 0; left: -60%; width: 40%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
  animation: shimmerBar 1.8s ease-in-out infinite;
}
@keyframes shimmerBar {
  from { left: -60%; }
  to   { left: 120%; }
}

/* ── Section ── */
.hiq-section {
  margin-bottom: 24px;
  opacity: 0;
  animation: hiqFadeUp .5s var(--ease) forwards;
}
.hiq-section-head {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 14px;
}
.hiq-section-icon {
  width: 32px; height: 32px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
}
.si-teal   { background: linear-gradient(135deg, var(--teal-100), rgba(20,184,166,.2)); }
.si-amber  { background: linear-gradient(135deg, rgba(245,158,11,.12), rgba(253,230,138,.3)); }
.si-emerald{ background: linear-gradient(135deg, rgba(16,185,129,.12), rgba(16,185,129,.22)); }
.si-sky    { background: linear-gradient(135deg, rgba(14,165,233,.1), rgba(14,165,233,.2)); }
.si-purple { background: linear-gradient(135deg, rgba(139,92,246,.1), rgba(139,92,246,.2)); }
.si-rose   { background: linear-gradient(135deg, rgba(244,63,94,.1), rgba(244,63,94,.2)); }
.hiq-section-label {
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--teal-700);
  flex: 1;
}
.hiq-required-tag {
  font-size: .62rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--amber);
  background: rgba(245,158,11,.1);
  border: 1px solid rgba(245,158,11,.25);
  padding: 3px 9px;
  border-radius: var(--pill);
}
.hiq-divider {
  height: 1px;
  background: linear-gradient(90deg, var(--teal-100), transparent);
  margin-bottom: 20px;
}

/* ── Field ── */
.hiq-field {
  margin-bottom: 14px;
  animation: hiqFadeUp .4s var(--ease) both;
}
.hiq-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: .76rem;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--teal-700);
  margin-bottom: 7px;
}
.hiq-label-emoji { font-size: 14px; }

/* ── Input / Select ── */
.hiq-input-wrap { position: relative; }
.hiq-input,
.hiq-select {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  background: rgba(255,255,255,.9);
  font-family: var(--font-b);
  font-size: .95rem;
  font-weight: 400;
  color: var(--teal-900);
  outline: none;
  transition: border-color .25s var(--ease),
              box-shadow   .25s var(--ease),
              transform    .2s  var(--spring);
  -webkit-appearance: none;
  appearance: none;
}
.hiq-input::placeholder { color: #94a3b8; font-weight: 300; }
.hiq-input:focus,
.hiq-select:focus {
  border-color: var(--teal-500);
  box-shadow: 0 0 0 3.5px rgba(20,184,166,.18), var(--shadow);
  transform: translateY(-1px);
  background: #fff;
}
.hiq-input.filled,
.hiq-select.filled {
  border-color: rgba(16,185,129,.45);
  background: rgba(240,253,249,.9);
}
/* ring-pulse on change */
.hiq-input.just-changed,
.hiq-select.just-changed {
  animation: ringPulse .4s var(--ease);
}
@keyframes ringPulse {
  0%  { box-shadow: 0 0 0 0   rgba(20,184,166,.45); }
  50% { box-shadow: 0 0 0 8px rgba(20,184,166,.0);  }
  100%{ box-shadow: 0 0 0 3.5px rgba(20,184,166,.18); }
}

/* suffix unit */
.hiq-unit {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: .8rem;
  font-weight: 600;
  color: var(--teal-500);
  pointer-events: none;
  background: rgba(240,253,249,.9);
  padding: 2px 6px;
  border-radius: 6px;
}
.hiq-select-arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--teal-500);
  font-size: 10px;
}

/* helper text */
.hiq-helper {
  font-size: .72rem;
  color: var(--muted);
  margin-top: 5px;
  padding-left: 4px;
  font-weight: 300;
}

/* filled tick */
.hiq-tick {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%) scale(0);
  color: var(--emerald);
  font-size: 15px;
  transition: transform .3s var(--spring);
}
.hiq-tick.show { transform: translateY(-50%) scale(1); }

/* ── Checkbox row ── */
.hiq-checkbox-row {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px 16px;
  background: rgba(255,255,255,.85);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: border-color .25s var(--ease), background .25s var(--ease);
  margin-bottom: 14px;
  user-select: none;
}
.hiq-checkbox-row:active { transform: scale(.98); }
.hiq-checkbox-row.checked {
  border-color: rgba(16,185,129,.5);
  background: rgba(240,253,249,.92);
}
.hiq-checkbox-box {
  width: 22px; height: 22px;
  border-radius: 7px;
  border: 2px solid var(--border);
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background .2s var(--ease), border-color .2s var(--ease);
}
.hiq-checkbox-row.checked .hiq-checkbox-box {
  background: var(--emerald);
  border-color: var(--emerald);
}
.hiq-checkbox-check {
  color: #fff;
  font-size: 13px;
  transform: scale(0);
  transition: transform .25s var(--spring);
}
.hiq-checkbox-row.checked .hiq-checkbox-check { transform: scale(1); }
.hiq-checkbox-label {
  flex: 1;
  font-size: .88rem;
  font-weight: 500;
  color: var(--teal-900);
}
.hiq-checkbox-sub {
  font-size: .74rem;
  color: var(--muted);
  font-weight: 300;
  display: block;
  margin-top: 2px;
}

/* ── Submit button ── */
.hiq-submit-wrap { margin-top: 6px; animation: hiqFadeUp .5s .5s var(--ease) both; }
.hiq-submit {
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: var(--radius);
  background: linear-gradient(135deg, var(--teal-700), var(--teal-500) 60%, var(--emerald));
  background-size: 200% 100%;
  color: #fff;
  font-family: var(--font-b);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: .02em;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform .2s var(--spring), box-shadow .2s var(--ease), background-position .4s var(--ease);
  box-shadow: 0 4px 20px rgba(15,118,110,.35);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.hiq-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(15,118,110,.42);
  background-position: 100% 0;
}
.hiq-submit:active:not(:disabled) { transform: scale(.97); }
.hiq-submit:disabled {
  opacity: .62;
  cursor: not-allowed;
}
.hiq-submit::before {
  content: '';
  position: absolute;
  top: 0; left: -70%; width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
  animation: shimmerBtn 2.2s ease-in-out infinite;
}
@keyframes shimmerBtn {
  from { left: -70%; }
  to   { left: 120%; }
}
.hiq-spinner {
  width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Animations ── */
@keyframes hiqFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Stagger helpers ── */
.delay-1 { animation-delay: .12s; }
.delay-2 { animation-delay: .20s; }
.delay-3 { animation-delay: .28s; }
.delay-4 { animation-delay: .36s; }
.delay-5 { animation-delay: .44s; }
.delay-6 { animation-delay: .52s; }
`

/* ─────────────────────────────────────────────────────────────
   Constants — all field definitions in one place
───────────────────────────────────────────────────────────── */
const CROPS   = ['Tomato','Onion','Potato','Chilli','Rice','Wheat','Maize','Soybean','Sugarcane','Cotton','Banana','Mango']
const REGIONS = ['Andhra Pradesh','Telangana','Tamil Nadu','Karnataka','Maharashtra','Gujarat','Punjab','Haryana','Uttar Pradesh','Madhya Pradesh','Rajasthan','West Bengal','Bihar']
const SEASONS = ['Kharif','Rabi','Zaid','Summer','Winter','Monsoon']
const TRANSPORT = ['Road','Rail','Air','Sea','Multi-modal']
const STORAGE   = ['Cold Storage','Warehouse','Silo','Open Yard']

const REQUIRED_FIELDS = ['crop','region','season','temperature','rainfall']

/* ─────────────────────────────────────────────────────────────
   Small reusable primitives
───────────────────────────────────────────────────────────── */
function Select({ id, value, onChange, onFocus, options, placeholder = 'Select…', fieldRef }) {
  const [pulse, setPulse] = useState(false)
  const isFilled = value !== ''

  const handleChange = (e) => {
    onChange(e)
    setPulse(true)
    setTimeout(() => setPulse(false), 450)
  }

  return (
    <div className="hiq-input-wrap">
      <select
        id={id}
        ref={fieldRef}
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        className={`hiq-select${isFilled ? ' filled' : ''}${pulse ? ' just-changed' : ''}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="hiq-select-arrow">▾</span>
      {isFilled && <span className="hiq-tick show">✓</span>}
    </div>
  )
}

function NumberInput({ id, value, onChange, onFocus, placeholder, unit, min, max, step = 1, fieldRef }) {
  const [pulse, setPulse] = useState(false)
  const isFilled = value !== ''

  const handleChange = (e) => {
    onChange(e)
    setPulse(true)
    setTimeout(() => setPulse(false), 450)
  }

  return (
    <div className="hiq-input-wrap">
      <input
        id={id}
        ref={fieldRef}
        type="number"
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        placeholder={placeholder}
        min={min} max={max} step={step}
        className={`hiq-input${isFilled ? ' filled' : ''}${pulse ? ' just-changed' : ''}`}
        style={{ paddingRight: unit ? '64px' : '16px' }}
      />
      {unit && <span className="hiq-unit">{unit}</span>}
      {isFilled && <span className="hiq-tick show" style={{ right: unit ? '52px' : '14px' }}>✓</span>}
    </div>
  )
}

function CheckboxRow({ checked, onChange, label, sub, emoji }) {
  return (
    <div
      className={`hiq-checkbox-row${checked ? ' checked' : ''}`}
      onClick={() => onChange(!checked)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={e => e.key === ' ' && onChange(!checked)}
    >
      <div className="hiq-checkbox-box">
        <span className="hiq-checkbox-check">✓</span>
      </div>
      <div style={{ flex: 1 }}>
        <span className="hiq-checkbox-label">
          {emoji && <span style={{ marginRight: 6 }}>{emoji}</span>}
          {label}
        </span>
        {sub && <span className="hiq-checkbox-sub">{sub}</span>}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   AUTO-SCROLL helper
   Called whenever a field gains focus → scrolls it to
   a comfortable position (~20 % from top on mobile).
───────────────────────────────────────────────────────────── */
function scrollFieldIntoView(ref) {
  if (!ref?.current) return
  const el = ref.current
  const rect = el.getBoundingClientRect()
  const viewH = window.innerHeight
  // Only scroll if the element is below 70 % of viewport
  if (rect.top > viewH * 0.55 || rect.bottom > viewH * 0.88) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

/* ─────────────────────────────────────────────────────────────
   Main Form component
───────────────────────────────────────────────────────────── */
export default function Form({ onSubmit, loading }) {
  /* ── state ── */
  const [form, setForm] = useState({
    crop: '', region: '', season: '',
    temperature: '', rainfall: '', humidity: '',
    production_quantity: '', market_price: '',
    transport_mode: '', storage_type: '',
    cold_chain_available: false,
    govt_support: false,
  })

  /* ── per-field refs for auto-scroll ── */
  const refs = {
    crop:                useRef(null),
    region:              useRef(null),
    season:              useRef(null),
    temperature:         useRef(null),
    rainfall:            useRef(null),
    humidity:            useRef(null),
    production_quantity: useRef(null),
    market_price:        useRef(null),
    transport_mode:      useRef(null),
    storage_type:        useRef(null),
  }

  /* ── progress ── */
  const filledRequired = REQUIRED_FIELDS.filter(k => form[k] !== '' && form[k] !== false).length
  const progress = Math.round((filledRequired / REQUIRED_FIELDS.length) * 100)

  /* ── handlers ── */
  const set = useCallback((key, val) => setForm(f => ({ ...f, [key]: val })), [])

  const makeFocus = (key) => () => scrollFieldIntoView(refs[key])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <>
      <style>{CSS}</style>

      <form className="hiq-form" onSubmit={handleSubmit} noValidate>

        {/* ── Head ── */}
        <div className="hiq-head">
          <div className="hiq-badge">🌿 Supply Chain Model</div>
          <h2 className="hiq-title">Run <em>Prediction</em></h2>
          <p className="hiq-subtitle">
            Fields marked <span className="hiq-req-tag">★ Required</span> must be filled.
            All others are pre-filled with real dataset averages.
          </p>
        </div>

        {/* ── Progress bar ── */}
        <div className="hiq-progress-wrap">
          <div className="hiq-progress-label">
            <span>
              {progress < 100
                ? `${REQUIRED_FIELDS.length - filledRequired} required field${REQUIRED_FIELDS.length - filledRequired !== 1 ? 's' : ''} left`
                : '🎉 All required fields complete!'}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="hiq-progress-track">
            <div className="hiq-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 1 — Crop Information
        ══════════════════════════════════════ */}
        <div className="hiq-section delay-1">
          <div className="hiq-section-head">
            <div className="hiq-section-icon si-teal">🌾</div>
            <span className="hiq-section-label">Crop Information</span>
            <span className="hiq-required-tag">★ Required</span>
          </div>

          {/* Crop */}
          <div className="hiq-field delay-1">
            <label className="hiq-label" htmlFor="crop">
              <span className="hiq-label-emoji">🌱</span> Crop
            </label>
            <Select
              id="crop"
              fieldRef={refs.crop}
              value={form.crop}
              onChange={e => set('crop', e.target.value)}
              onFocus={makeFocus('crop')}
              options={CROPS}
              placeholder="Choose a crop…"
            />
          </div>

          {/* Region */}
          <div className="hiq-field delay-2">
            <label className="hiq-label" htmlFor="region">
              <span className="hiq-label-emoji">📍</span> Region
            </label>
            <Select
              id="region"
              fieldRef={refs.region}
              value={form.region}
              onChange={e => set('region', e.target.value)}
              onFocus={makeFocus('region')}
              options={REGIONS}
              placeholder="Select a region…"
            />
          </div>

          {/* Season */}
          <div className="hiq-field delay-3">
            <label className="hiq-label" htmlFor="season">
              <span className="hiq-label-emoji">🌤️</span> Season
            </label>
            <Select
              id="season"
              fieldRef={refs.season}
              value={form.season}
              onChange={e => set('season', e.target.value)}
              onFocus={makeFocus('season')}
              options={SEASONS}
              placeholder="Pick a season…"
            />
          </div>
        </div>

        <div className="hiq-divider" />

        {/* ══════════════════════════════════════
            SECTION 2 — Weather Conditions
        ══════════════════════════════════════ */}
        <div className="hiq-section delay-2">
          <div className="hiq-section-head">
            <div className="hiq-section-icon si-sky">🌡️</div>
            <span className="hiq-section-label">Weather Conditions</span>
            <span className="hiq-required-tag">★ Required</span>
          </div>

          {/* Temperature */}
          <div className="hiq-field delay-1">
            <label className="hiq-label" htmlFor="temperature">
              <span className="hiq-label-emoji">🌡️</span> Temperature
            </label>
            <NumberInput
              id="temperature"
              fieldRef={refs.temperature}
              value={form.temperature}
              onChange={e => set('temperature', e.target.value)}
              onFocus={makeFocus('temperature')}
              placeholder="e.g. 28"
              unit="°C"
              min={-10} max={55}
            />
            <p className="hiq-helper">Avg. ambient temperature during harvest period</p>
          </div>

          {/* Rainfall */}
          <div className="hiq-field delay-2">
            <label className="hiq-label" htmlFor="rainfall">
              <span className="hiq-label-emoji">🌧️</span> Rainfall
            </label>
            <NumberInput
              id="rainfall"
              fieldRef={refs.rainfall}
              value={form.rainfall}
              onChange={e => set('rainfall', e.target.value)}
              onFocus={makeFocus('rainfall')}
              placeholder="e.g. 120"
              unit="mm"
              min={0} max={3000}
            />
            <p className="hiq-helper">Monthly average rainfall in millimetres</p>
          </div>

          {/* Humidity */}
          <div className="hiq-field delay-3">
            <label className="hiq-label" htmlFor="humidity">
              <span className="hiq-label-emoji">💧</span> Humidity
              <span style={{ marginLeft: 6, fontSize: '.65rem', color: 'var(--muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>optional</span>
            </label>
            <NumberInput
              id="humidity"
              fieldRef={refs.humidity}
              value={form.humidity}
              onChange={e => set('humidity', e.target.value)}
              onFocus={makeFocus('humidity')}
              placeholder="e.g. 65"
              unit="%"
              min={0} max={100}
            />
          </div>
        </div>

        <div className="hiq-divider" />

        {/* ══════════════════════════════════════
            SECTION 3 — Production & Market
        ══════════════════════════════════════ */}
        <div className="hiq-section delay-3">
          <div className="hiq-section-head">
            <div className="hiq-section-icon si-emerald">📦</div>
            <span className="hiq-section-label">Production &amp; Market</span>
          </div>

          {/* Production Quantity */}
          <div className="hiq-field delay-1">
            <label className="hiq-label" htmlFor="production_quantity">
              <span className="hiq-label-emoji">⚖️</span> Production Quantity
            </label>
            <NumberInput
              id="production_quantity"
              fieldRef={refs.production_quantity}
              value={form.production_quantity}
              onChange={e => set('production_quantity', e.target.value)}
              onFocus={makeFocus('production_quantity')}
              placeholder="e.g. 5000"
              unit="MT"
              min={0}
            />
            <p className="hiq-helper">Total expected output in metric tonnes</p>
          </div>

          {/* Market Price */}
          <div className="hiq-field delay-2">
            <label className="hiq-label" htmlFor="market_price">
              <span className="hiq-label-emoji">💰</span> Market Price
            </label>
            <NumberInput
              id="market_price"
              fieldRef={refs.market_price}
              value={form.market_price}
              onChange={e => set('market_price', e.target.value)}
              onFocus={makeFocus('market_price')}
              placeholder="e.g. 2400"
              unit="₹/qt"
              min={0}
            />
            <p className="hiq-helper">Current mandi price per quintal</p>
          </div>
        </div>

        <div className="hiq-divider" />

        {/* ══════════════════════════════════════
            SECTION 4 — Logistics
        ══════════════════════════════════════ */}
        <div className="hiq-section delay-4">
          <div className="hiq-section-head">
            <div className="hiq-section-icon si-purple">🚚</div>
            <span className="hiq-section-label">Logistics</span>
          </div>

          {/* Transport Mode */}
          <div className="hiq-field delay-1">
            <label className="hiq-label" htmlFor="transport_mode">
              <span className="hiq-label-emoji">🚛</span> Transport Mode
            </label>
            <Select
              id="transport_mode"
              fieldRef={refs.transport_mode}
              value={form.transport_mode}
              onChange={e => set('transport_mode', e.target.value)}
              onFocus={makeFocus('transport_mode')}
              options={TRANSPORT}
              placeholder="Select transport…"
            />
          </div>

          {/* Storage Type */}
          <div className="hiq-field delay-2">
            <label className="hiq-label" htmlFor="storage_type">
              <span className="hiq-label-emoji">🏭</span> Storage Type
            </label>
            <Select
              id="storage_type"
              fieldRef={refs.storage_type}
              value={form.storage_type}
              onChange={e => set('storage_type', e.target.value)}
              onFocus={makeFocus('storage_type')}
              options={STORAGE}
              placeholder="Select storage…"
            />
          </div>

          {/* Cold Chain */}
          <CheckboxRow
            checked={form.cold_chain_available}
            onChange={v => set('cold_chain_available', v)}
            emoji="❄️"
            label="Cold Chain Available"
            sub="Refrigerated transport & storage throughout"
          />

          {/* Govt Support */}
          <CheckboxRow
            checked={form.govt_support}
            onChange={v => set('govt_support', v)}
            emoji="🏛️"
            label="Government Support"
            sub="Subsidy, MSP, or scheme coverage"
          />
        </div>

        {/* ── Submit ── */}
        <div className="hiq-submit-wrap">
          <button
            type="submit"
            className="hiq-submit"
            disabled={loading || filledRequired < REQUIRED_FIELDS.length}
            title={filledRequired < REQUIRED_FIELDS.length ? 'Please fill all required fields' : ''}
          >
            {loading ? (
              <>
                <div className="hiq-spinner" />
                Analysing…
              </>
            ) : (
              <>
                {progress === 100 ? '🚀' : '🔍'} Run Analysis
              </>
            )}
          </button>
          {filledRequired < REQUIRED_FIELDS.length && (
            <p style={{ textAlign: 'center', fontSize: '.73rem', color: 'var(--muted)', marginTop: 9, fontWeight: 300 }}>
              {REQUIRED_FIELDS.length - filledRequired} more required field{REQUIRED_FIELDS.length - filledRequired !== 1 ? 's' : ''} needed
            </p>
          )}
        </div>

      </form>
    </>
  )
}
