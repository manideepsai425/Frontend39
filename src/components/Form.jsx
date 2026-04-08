/**
 * Form.jsx — HarvestIQ  ·  Full Redesign
 *
 * ✅ EXACT same field names, sections, logic, and API shape as the original
 * ✅ Vibrant teal/emerald/amber palette — zero brown
 * ✅ Auto-scroll: every field focus scrolls it into comfortable view
 * ✅ Staggered entrance animations per section and field
 * ✅ Ring-pulse micro-interaction on every value change
 * ✅ Live progress bar for required fields
 * ✅ Green ✓ tick when a field is filled
 * ✅ Animated shimmer submit button + spinner
 * ✅ iPhone safe-area aware
 *
 * Drop into: src/components/Form.jsx  (no other files need to change)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { fetchOptions } from '../api'

/* ─── Crop defaults (mirrors backend) ─────────────────────── */
const CROP_DEFAULTS = {
  Brinjal:  { shelf_life_days: 5,   price_per_quintal: 10056 },
  Cabbage:  { shelf_life_days: 7,   price_per_quintal: 12229 },
  Chilli:   { shelf_life_days: 180, price_per_quintal: 12567 },
  Maize:    { shelf_life_days: 180, price_per_quintal: 12734 },
  Onion:    { shelf_life_days: 30,  price_per_quintal: 11160 },
  Potato:   { shelf_life_days: 60,  price_per_quintal: 12959 },
  Rice:     { shelf_life_days: 365, price_per_quintal: 11931 },
  Tomato:   { shelf_life_days: 5,   price_per_quintal: 10805 },
  Turmeric: { shelf_life_days: 365, price_per_quintal: 11400 },
  Wheat:    { shelf_life_days: 365, price_per_quintal: 18438 },
}

const today = new Date()

const DEFAULT_FORM = {
  crop: '', region: '', season: '',
  weather_temp: '', rainfall_mm: '', humidity_pct: '58',
  month:       String(today.getMonth() + 1),
  day_of_week: String(today.getDay()),
  is_weekend:  String(today.getDay() >= 6 ? 1 : 0),
  festival_flag: '0', holiday_flag: '0',
  price_per_quintal: '', fuel_price: '98.6',
  transport_cost: '409.6', crop_yield: '3878',
  shelf_life_days: '', market_arrival: '136.8',
  demand_lag_1: '1342', demand_lag_7: '1342',
  avg_7day_demand: '1342', avg_30day_demand: '1342',
}

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

/* Required fields tracked by progress bar */
const REQUIRED = ['crop','region','season','weather_temp','rainfall_mm','humidity_pct','price_per_quintal','shelf_life_days']

/* ══════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

.hf-root {
  --t950: #042f2e;
  --t900: #0d3d3a;
  --t800: #0f524d;
  --t700: #0f766e;
  --t600: #0d9488;
  --t500: #14b8a6;
  --t400: #2dd4bf;
  --t300: #5eead4;
  --t100: #ccfbf1;
  --t50:  #f0fdfa;
  --em:   #10b981;
  --eml:  #34d399;
  --am:   #f59e0b;
  --aml:  #fcd34d;
  --ro:   #f43f5e;
  --sk:   #0ea5e9;
  --pu:   #8b5cf6;
  --sl:   #64748b;
  --wh:   #ffffff;

  --bdr:  rgba(20,184,166,.18);
  --bdrf: rgba(20,184,166,.5);
  --rm:   16px;
  --rl:   20px;
  --rp:   999px;
  --sh-s: 0 2px 8px  rgba(15,118,110,.10);
  --sh-m: 0 4px 20px rgba(15,118,110,.14);
  --sh-l: 0 10px 40px rgba(15,118,110,.18);
  --sh-i: 0 0 0 3.5px rgba(20,184,166,.18);
  --fd:   'Fraunces', Georgia, serif;
  --fb:   'DM Sans', system-ui, sans-serif;
  --ease: cubic-bezier(.4,0,.2,1);
  --spr:  cubic-bezier(.34,1.56,.64,1);
  font-family: var(--fb);
  color: var(--t900);
}

/* Card */
.hf-card {
  background: rgba(255,255,255,.93);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(20,184,166,.13);
  border-radius: var(--rl);
  overflow: hidden;
  box-shadow: var(--sh-l);
}

/* Header */
.hf-header {
  padding: 24px 22px 22px;
  background: linear-gradient(155deg, var(--t950) 0%, var(--t800) 100%);
  position: relative;
  overflow: hidden;
}
.hf-header::before {
  content:''; position:absolute;
  top:-50px; right:-40px;
  width:200px; height:200px; border-radius:50%;
  background:radial-gradient(circle,rgba(20,184,166,.2) 0%,transparent 70%);
  pointer-events:none;
}
.hf-header::after {
  content:''; position:absolute;
  bottom:-35px; left:-25px;
  width:150px; height:150px; border-radius:50%;
  background:radial-gradient(circle,rgba(245,158,11,.1) 0%,transparent 70%);
  pointer-events:none;
}
.hf-tag {
  display:inline-flex; align-items:center; gap:6px;
  font-size:.67rem; font-weight:600; letter-spacing:.09em; text-transform:uppercase;
  color:var(--t300); background:rgba(94,234,212,.11); border:1px solid rgba(94,234,212,.22);
  padding:4px 12px; border-radius:var(--rp); margin-bottom:12px;
}
.hf-title {
  font-family:var(--fd); font-size:1.85rem; font-weight:700;
  color:var(--wh); letter-spacing:-.03em; line-height:1.12; margin-bottom:10px;
}
.hf-title em { font-style:italic; font-weight:400; color:var(--t300); }
.hf-subtitle { font-size:.82rem; color:rgba(255,255,255,.58); line-height:1.65; font-weight:300; }
.hf-req-inline {
  display:inline-flex; align-items:center;
  font-size:.63rem; font-weight:700; letter-spacing:.07em; text-transform:uppercase;
  color:var(--am); background:rgba(245,158,11,.14); border:1px solid rgba(245,158,11,.28);
  padding:2px 8px; border-radius:var(--rp); margin:0 3px; vertical-align:middle;
}
.hf-warn {
  margin-top:10px; font-size:.77rem; color:var(--aml);
  background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.2);
  border-radius:10px; padding:7px 12px;
}

/* Progress */
.hf-progress { padding:14px 22px 0; }
.hf-progress-meta {
  display:flex; justify-content:space-between;
  font-size:.71rem; font-weight:500; color:var(--sl); margin-bottom:6px;
}
.hf-progress-meta span:last-child { color:var(--t600); font-weight:600; }
.hf-progress-track { height:5px; background:rgba(20,184,166,.12); border-radius:var(--rp); overflow:hidden; }
.hf-progress-fill {
  height:100%; border-radius:var(--rp);
  background:linear-gradient(90deg,var(--t500),var(--em));
  transition:width .55s var(--spr);
  position:relative; overflow:hidden;
}
.hf-progress-fill::after {
  content:''; position:absolute; top:0; left:-60%; width:40%; height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);
  animation:hfShimBar 1.8s ease-in-out infinite;
}
@keyframes hfShimBar { from{left:-60%} to{left:120%} }

/* Body */
.hf-body { padding:0 22px 24px; }

/* Section */
.hf-section { margin-top:22px; animation:hfUp .45s var(--ease) both; }
.hf-section-head { display:flex; align-items:center; gap:9px; margin-bottom:14px; }
.hf-sec-icon {
  width:30px; height:30px; border-radius:9px;
  display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0;
}
.si-teal    { background:linear-gradient(135deg,var(--t100),rgba(20,184,166,.2)); }
.si-sky     { background:linear-gradient(135deg,rgba(14,165,233,.12),rgba(14,165,233,.22)); }
.si-amber   { background:linear-gradient(135deg,rgba(245,158,11,.12),rgba(253,211,77,.28)); }
.si-emerald { background:linear-gradient(135deg,rgba(16,185,129,.12),rgba(52,211,153,.22)); }
.si-purple  { background:linear-gradient(135deg,rgba(139,92,246,.1),rgba(139,92,246,.2)); }
.si-rose    { background:linear-gradient(135deg,rgba(244,63,94,.1),rgba(244,63,94,.2)); }
.hf-sec-lbl { font-size:.7rem; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--t700); flex:1; }
.hf-badge-req {
  font-size:.61rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
  color:var(--am); background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.24);
  padding:3px 9px; border-radius:var(--rp);
}
.hf-badge-auto {
  font-size:.61rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
  color:var(--em); background:rgba(16,185,129,.1); border:1px solid rgba(16,185,129,.22);
  padding:3px 9px; border-radius:var(--rp);
}
.hf-divider { height:1px; background:linear-gradient(90deg,rgba(20,184,166,.18),transparent); margin:4px 0 0; }

/* Field */
.hf-field { margin-bottom:13px; animation:hfUp .38s var(--ease) both; }
.hf-label {
  display:flex; align-items:center; gap:6px;
  font-size:.73rem; font-weight:600; letter-spacing:.05em; text-transform:uppercase;
  color:var(--t700); margin-bottom:6px;
}
.hf-lemoji { font-size:13px; }

/* Input/Select */
.hf-iw { position:relative; }
.hf-input, .hf-select {
  width:100%; padding:13px 16px;
  border:1.5px solid var(--bdr); border-radius:var(--rm);
  background:rgba(255,255,255,.88);
  font-family:var(--fb); font-size:.92rem; font-weight:400; color:var(--t950);
  outline:none; -webkit-appearance:none; appearance:none;
  transition:border-color .22s var(--ease), box-shadow .22s var(--ease), transform .18s var(--spr), background .22s var(--ease);
}
.hf-input::placeholder { color:#94a3b8; font-weight:300; }
.hf-input:focus, .hf-select:focus {
  border-color:var(--t500);
  box-shadow:var(--sh-i), var(--sh-s);
  transform:translateY(-1px); background:#fff;
}
.hf-input.filled, .hf-select.filled {
  border-color:rgba(16,185,129,.42); background:rgba(240,253,250,.92);
}
.hf-input.err, .hf-select.err {
  border-color:rgba(244,63,94,.5); background:rgba(255,241,242,.9);
}
.hf-input.pulse, .hf-select.pulse { animation:hfPulse .42s var(--ease); }
@keyframes hfPulse {
  0%  { box-shadow:0 0 0 0   rgba(20,184,166,.5); }
  50% { box-shadow:0 0 0 9px rgba(20,184,166,.0); }
  100%{ box-shadow:var(--sh-i); }
}
.hf-unit {
  position:absolute; right:13px; top:50%; transform:translateY(-50%);
  font-size:.77rem; font-weight:600; color:var(--t500); pointer-events:none;
  background:linear-gradient(90deg,transparent,rgba(240,253,250,.95) 28%); padding:2px 0 2px 10px;
}
.hf-sarrow {
  position:absolute; right:13px; top:50%; transform:translateY(-50%);
  color:var(--t400); font-size:11px; pointer-events:none;
}
.hf-tick {
  position:absolute; top:50%; transform:translateY(-50%) scale(0);
  color:var(--em); font-size:13px; font-weight:700;
  transition:transform .28s var(--spr);
}
.hf-tick.show { transform:translateY(-50%) scale(1); }
.hf-err-msg { font-size:.71rem; color:var(--ro); margin-top:4px; padding-left:3px; font-weight:500; animation:hfUp .2s var(--ease) both; }

/* Actions */
.hf-actions { display:flex; gap:10px; margin-top:20px; }
.hf-btn-clr {
  flex:0 0 auto; padding:14px 20px;
  border:1.5px solid var(--bdr); border-radius:var(--rm);
  background:rgba(255,255,255,.75); font-family:var(--fb);
  font-size:.9rem; font-weight:500; color:var(--sl); cursor:pointer;
  transition:background .2s var(--ease), transform .15s var(--spr), border-color .2s, color .2s;
}
.hf-btn-clr:hover:not(:disabled) { background:var(--t50); border-color:var(--bdrf); color:var(--t700); }
.hf-btn-clr:active:not(:disabled) { transform:scale(.96); }
.hf-btn-clr:disabled { opacity:.45; cursor:not-allowed; }

.hf-btn-sub {
  flex:1; padding:14px 20px; border:none; border-radius:var(--rm);
  background:linear-gradient(135deg,var(--t700) 0%,var(--t500) 55%,var(--em) 100%);
  background-size:200% 100%;
  font-family:var(--fb); font-size:.95rem; font-weight:600; color:#fff; cursor:pointer;
  display:flex; align-items:center; justify-content:center; gap:9px;
  position:relative; overflow:hidden;
  box-shadow:0 4px 18px rgba(15,118,110,.38);
  transition:transform .2s var(--spr), box-shadow .2s var(--ease), background-position .4s var(--ease);
}
.hf-btn-sub:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(15,118,110,.46); background-position:100% 0; }
.hf-btn-sub:active:not(:disabled) { transform:scale(.97); }
.hf-btn-sub:disabled { opacity:.55; cursor:not-allowed; }
.hf-btn-sub::before {
  content:''; position:absolute; top:0; left:-70%; width:50%; height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent);
  animation:hfShimBtn 2.4s ease-in-out infinite;
}
@keyframes hfShimBtn { from{left:-70%} to{left:120%} }
.hf-spinner {
  width:17px; height:17px; border:2.5px solid rgba(255,255,255,.3);
  border-top-color:#fff; border-radius:50%; animation:hfSpin .7s linear infinite;
}
@keyframes hfSpin { to{transform:rotate(360deg)} }

/* Keyframes & delays */
@keyframes hfUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
.d1{animation-delay:.06s} .d2{animation-delay:.12s} .d3{animation-delay:.18s}
.d4{animation-delay:.24s} .d5{animation-delay:.30s} .d6{animation-delay:.36s}
.d7{animation-delay:.42s} .d8{animation-delay:.48s}
`

/* ══════════════════════════════════════════════════════════
   AUTO-SCROLL helper
══════════════════════════════════════════════════════════ */
function scrollToField(el) {
  if (!el) return
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight
  if (rect.top > vh * 0.52 || rect.bottom > vh * 0.9) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

/* ══════════════════════════════════════════════════════════
   Primitive: NumInput
══════════════════════════════════════════════════════════ */
function NumInput({ name, value, onChange, placeholder, unit, disabled, hasError }) {
  const [pulse, setPulse] = useState(false)
  const isFilled = value !== '' && value !== undefined

  const handleChange = (e) => {
    onChange(e)
    setPulse(true)
    setTimeout(() => setPulse(false), 450)
  }

  const cls = ['hf-input', isFilled && !hasError ? 'filled' : '', hasError ? 'err' : '', pulse ? 'pulse' : ''].filter(Boolean).join(' ')
  const unitRight = unit ? '58px' : '14px'
  const tickRight = unit ? '50px' : '13px'

  return (
    <div className="hf-iw">
      <input
        type="number" name={name} id={name} value={value}
        onChange={handleChange}
        onFocus={e => scrollToField(e.currentTarget.closest('.hf-field') || e.currentTarget)}
        placeholder={placeholder} disabled={disabled} step="any"
        className={cls} style={{ paddingRight: unitRight }}
      />
      {unit && <span className="hf-unit">{unit}</span>}
      {isFilled && !hasError && <span className="hf-tick show" style={{ right: tickRight }}>✓</span>}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   Primitive: SelInput
══════════════════════════════════════════════════════════ */
function SelInput({ name, value, onChange, disabled, hasError, children }) {
  const [pulse, setPulse] = useState(false)
  const isFilled = value !== '' && value !== undefined && value !== null

  const handleChange = (e) => {
    onChange(e)
    setPulse(true)
    setTimeout(() => setPulse(false), 450)
  }

  const cls = ['hf-select', isFilled && !hasError ? 'filled' : '', hasError ? 'err' : '', pulse ? 'pulse' : ''].filter(Boolean).join(' ')

  return (
    <div className="hf-iw">
      <select
        name={name} id={name} value={value}
        onChange={handleChange}
        onFocus={e => scrollToField(e.currentTarget.closest('.hf-field') || e.currentTarget)}
        disabled={disabled} className={cls} style={{ paddingRight: '40px' }}
      >
        {children}
      </select>
      <span className="hf-sarrow">▾</span>
      {isFilled && !hasError && <span className="hf-tick show" style={{ right: '34px' }}>✓</span>}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function Form({ onSubmit, loading }) {
  const [form, setForm]       = useState(DEFAULT_FORM)
  const [errors, setErrors]   = useState({})
  const [options, setOptions] = useState({ crops: [], regions: [], seasons: [] })
  const [optErr, setOptErr]   = useState(false)

  /* Fetch API options */
  useEffect(() => {
    fetchOptions()
      .then(r => setOptions(r.data))
      .catch(() => {
        setOptErr(true)
        setOptions({
          crops:   ['Brinjal','Cabbage','Chilli','Maize','Onion','Potato','Rice','Tomato','Turmeric','Wheat'],
          regions: ['Andhra Pradesh','Karnataka','Maharashtra','Tamil Nadu','Telangana'],
          seasons: ['Kharif','Rabi','Summer'],
        })
      })
  }, [])

  /* Auto-fill from crop */
  useEffect(() => {
    if (form.crop && CROP_DEFAULTS[form.crop]) {
      const d = CROP_DEFAULTS[form.crop]
      setForm(f => ({ ...f, shelf_life_days: String(d.shelf_life_days), price_per_quintal: String(d.price_per_quintal) }))
    }
  }, [form.crop])

  /* Auto-derive weekend */
  useEffect(() => {
    const dow = parseInt(form.day_of_week)
    if (!isNaN(dow)) setForm(f => ({ ...f, is_weekend: String(dow >= 5 ? 1 : 0) }))
  }, [form.day_of_week])

  /* Progress */
  const filled = REQUIRED.filter(k => form[k] !== '' && form[k] !== undefined).length
  const progress = Math.round((filled / REQUIRED.length) * 100)

  /* Change handler */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(err => ({ ...err, [name]: '' }))
  }, [errors])

  /* Validate */
  const validate = () => {
    const e = {}
    if (!form.crop)        e.crop        = 'Required'
    if (!form.region)      e.region      = 'Required'
    if (!form.season)      e.season      = 'Required'
    if (form.weather_temp === '' || isNaN(form.weather_temp)) e.weather_temp = 'Required (°C)'
    if (form.rainfall_mm  === '' || isNaN(form.rainfall_mm))  e.rainfall_mm  = 'Required (mm)'
    if (form.humidity_pct === '' || isNaN(form.humidity_pct)) e.humidity_pct = 'Required (%)'
    if (form.price_per_quintal === '' || isNaN(form.price_per_quintal)) e.price_per_quintal = 'Required'
    if (form.shelf_life_days   === '' || isNaN(form.shelf_life_days))   e.shelf_life_days   = 'Required'
    return e
  }

  /* Submit */
  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      const el = document.getElementById(Object.keys(errs)[0])
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const num = (v, fb = 0) => v === '' ? fb : parseFloat(v)
    const int = (v, fb = 0) => v === '' ? fb : parseInt(v)
    onSubmit({
      crop: form.crop, region: form.region, season: form.season,
      weather_temp:      num(form.weather_temp),
      rainfall_mm:       num(form.rainfall_mm),
      humidity_pct:      num(form.humidity_pct, 58),
      month:             int(form.month, today.getMonth() + 1),
      day_of_week:       int(form.day_of_week, today.getDay()),
      is_weekend:        int(form.is_weekend, 0),
      festival_flag:     int(form.festival_flag, 0),
      holiday_flag:      int(form.holiday_flag, 0),
      price_per_quintal: num(form.price_per_quintal, 12000),
      fuel_price:        num(form.fuel_price, 98.6),
      transport_cost:    num(form.transport_cost, 409.6),
      crop_yield:        int(form.crop_yield, 3878),
      shelf_life_days:   int(form.shelf_life_days, 30),
      market_arrival:    num(form.market_arrival, 136.8),
      demand_lag_1:      num(form.demand_lag_1, 1342),
      demand_lag_7:      num(form.demand_lag_7, 1342),
      avg_7day_demand:   num(form.avg_7day_demand, 1342),
      avg_30day_demand:  num(form.avg_30day_demand, 1342),
    })
  }

  const handleReset = () => { setForm(DEFAULT_FORM); setErrors({}) }

  /* ── Field shorthand builders ── */
  const NF = ({ name, label, emoji, unit, placeholder, delay = '' }) => (
    <div className={`hf-field ${delay}`}>
      <label className="hf-label" htmlFor={name}>
        <span className="hf-lemoji">{emoji}</span>{label}
      </label>
      <NumInput name={name} value={form[name]} onChange={handleChange}
        placeholder={placeholder} unit={unit} disabled={loading} hasError={!!errors[name]} />
      {errors[name] && <p className="hf-err-msg">⚠ {errors[name]}</p>}
    </div>
  )

  const SF = ({ name, label, emoji, opts, delay = '', children }) => (
    <div className={`hf-field ${delay}`}>
      <label className="hf-label" htmlFor={name}>
        <span className="hf-lemoji">{emoji}</span>{label}
      </label>
      <SelInput name={name} value={form[name]} onChange={handleChange}
        disabled={loading} hasError={!!errors[name]}>
        {opts
          ? <>{<option value="">Select…</option>}{opts.map(o => <option key={o} value={o}>{o}</option>)}</>
          : children}
      </SelInput>
      {errors[name] && <p className="hf-err-msg">⚠ {errors[name]}</p>}
    </div>
  )

  /* ═══════════════════════════ RENDER ═══════════════════════════ */
  return (
    <div className="hf-root">
      <style>{CSS}</style>

      <form className="hf-card" onSubmit={handleSubmit} noValidate>

        {/* ── Header ── */}
        <div className="hf-header">
          <div className="hf-tag">🌿 Supply Chain Model</div>
          <h2 className="hf-title">Run <em>Prediction</em></h2>
          <p className="hf-subtitle">
            Fields marked <span className="hf-req-inline">★ required</span> must be filled.
            All others are pre-filled with real dataset averages.
          </p>
          {optErr && <p className="hf-warn">⚠️ Backend offline — using built-in crop defaults.</p>}
        </div>

        {/* ── Progress ── */}
        <div className="hf-progress">
          <div className="hf-progress-meta">
            <span>
              {progress < 100
                ? `${REQUIRED.length - filled} required field${REQUIRED.length - filled !== 1 ? 's' : ''} left`
                : '🎉 All required fields complete!'}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="hf-progress-track">
            <div className="hf-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── Body ── */}
        <div className="hf-body">

          {/* ══ 1. Crop Information ══ */}
          <div className="hf-section d1">
            <div className="hf-section-head">
              <div className="hf-sec-icon si-teal">🌾</div>
              <span className="hf-sec-lbl">Crop Information</span>
              <span className="hf-badge-req">★ Required</span>
            </div>
            <SF name="crop"   label="Crop"   emoji="🌱" opts={options.crops}   delay="d1" />
            <SF name="region" label="Region" emoji="📍" opts={options.regions} delay="d2" />
            <SF name="season" label="Season" emoji="🌦️" opts={options.seasons} delay="d3" />
          </div>

          <div className="hf-divider" />

          {/* ══ 2. Weather Conditions ══ */}
          <div className="hf-section d2">
            <div className="hf-section-head">
              <div className="hf-sec-icon si-sky">🌡️</div>
              <span className="hf-sec-lbl">Weather Conditions</span>
              <span className="hf-badge-req">★ Required</span>
            </div>
            <NF name="weather_temp" label="Temperature" emoji="🌡️" unit="°C" placeholder="e.g. 32" delay="d1" />
            <NF name="rainfall_mm"  label="Rainfall"    emoji="🌧️" unit="mm" placeholder="e.g. 57" delay="d2" />
            <NF name="humidity_pct" label="Humidity"    emoji="💧" unit="%"  placeholder="e.g. 58" delay="d3" />
          </div>

          <div className="hf-divider" />

          {/* ══ 3. Date Context ══ */}
          <div className="hf-section d3">
            <div className="hf-section-head">
              <div className="hf-sec-icon si-amber">📅</div>
              <span className="hf-sec-lbl">Date Context</span>
              <span className="hf-badge-auto">Auto-filled</span>
            </div>
            <SF name="month" label="Month" emoji="📆" delay="d1">
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </SF>
            <SF name="day_of_week" label="Day of Week" emoji="📅" delay="d2">
              {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </SF>
            <SF name="is_weekend" label="Weekend?" emoji="🗓️" delay="d3">
              <option value="0">No (Weekday)</option>
              <option value="1">Yes (Weekend)</option>
            </SF>
          </div>

          <div className="hf-divider" />

          {/* ══ 4. Market & Logistics ══ */}
          <div className="hf-section d4">
            <div className="hf-section-head">
              <div className="hf-sec-icon si-emerald">📦</div>
              <span className="hf-sec-lbl">Market &amp; Logistics</span>
              <span className="hf-badge-auto">Auto-filled from crop</span>
            </div>
            <NF name="price_per_quintal" label="Price / Quintal" emoji="💰" unit="₹"    placeholder="e.g. 12000" delay="d1" />
            <NF name="market_arrival"    label="Market Arrival"  emoji="🚚" unit="tons" placeholder="e.g. 136"   delay="d2" />
            <NF name="crop_yield"        label="Crop Yield"      emoji="🌿" unit="kg"   placeholder="e.g. 3878"  delay="d3" />
            <NF name="shelf_life_days"   label="Shelf Life"      emoji="📦" unit="days" placeholder="e.g. 30"    delay="d4" />
            <NF name="transport_cost"    label="Transport Cost"  emoji="🛻" unit="₹"    placeholder="e.g. 409"   delay="d5" />
            <NF name="fuel_price"        label="Fuel Price"      emoji="⛽" unit="₹/L"  placeholder="e.g. 98"    delay="d6" />
          </div>

          <div className="hf-divider" />

          {/* ══ 5. Event Flags ══ */}
          <div className="hf-section d5">
            <div className="hf-section-head">
              <div className="hf-sec-icon si-purple">🎌</div>
              <span className="hf-sec-lbl">Event Flags</span>
              <span className="hf-badge-auto">Auto-filled</span>
            </div>
            <SF name="festival_flag" label="Festival Day?" emoji="🪔" delay="d1">
              <option value="0">No</option>
              <option value="1">Yes</option>
            </SF>
            <SF name="holiday_flag" label="Public Holiday?" emoji="🏖️" delay="d2">
              <option value="0">No</option>
              <option value="1">Yes</option>
            </SF>
          </div>

          <div className="hf-divider" />

          {/* ══ 6. Demand History ══ */}
          <div className="hf-section d6">
            <div className="hf-section-head">
              <div className="hf-sec-icon si-rose">📊</div>
              <span className="hf-sec-lbl">Demand History</span>
              <span className="hf-badge-auto">Auto-filled</span>
            </div>
            <NF name="demand_lag_1"     label="Yesterday's Demand" emoji="📉" unit="units" placeholder="e.g. 1342" delay="d1" />
            <NF name="demand_lag_7"     label="7-Day Lag Demand"   emoji="📅" unit="units" placeholder="e.g. 1342" delay="d2" />
            <NF name="avg_7day_demand"  label="7-Day Avg Demand"   emoji="📈" unit="units" placeholder="e.g. 1342" delay="d3" />
            <NF name="avg_30day_demand" label="30-Day Avg Demand"  emoji="📊" unit="units" placeholder="e.g. 1342" delay="d4" />
          </div>

          {/* ══ Actions ══ */}
          <div className="hf-actions">
            <button type="button" className="hf-btn-clr" onClick={handleReset} disabled={loading}>
              Clear
            </button>
            <button type="submit" className="hf-btn-sub" disabled={loading}>
              {loading
                ? <><div className="hf-spinner" /> Analysing…</>
                : <><span>Run Analysis</span><span>→</span></>
              }
            </button>
          </div>

        </div>{/* /hf-body */}
      </form>
    </div>
  )
}
