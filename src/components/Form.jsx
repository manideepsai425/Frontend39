import React, { useState, useEffect } from 'react'
import { getOptions } from '../api'

// ─── Fallback options if /options endpoint fails ───────────────────────────
const FALLBACK_CROPS   = ['Rice','Potato','Turmeric','Tomato','Brinjal','Cabbage','Onion','Chilli','Maize','Wheat']
const FALLBACK_REGIONS = ['Andhra Pradesh','Telangana','Maharashtra','Tamil Nadu','Karnataka']
const FALLBACK_SEASONS = ['Summer','Kharif','Rabi']

const defaultForm = {
  // Categoricals
  crop:   '',
  region: '',
  season: '',
  // Date-derived
  month:       '',
  day_of_week: '',
  is_weekend:  '0',
  // Weather
  weather_temp: '',
  rainfall_mm:  '',
  humidity_pct: '',
  // Flags
  festival_flag: '0',
  holiday_flag:  '0',
  // Economics
  price_per_quintal: '',
  fuel_price:        '',
  transport_cost:    '',
  crop_yield:        '',
  // Product
  shelf_life_days: '',
  market_arrival:  '',
  // Lag features
  demand_lag_1:    '',
  demand_lag_7:    '',
  avg_7day_demand:  '',
  avg_30day_demand: '',
}

export default function Form({ onSubmit, loading }) {
  const [form,    setForm]    = useState(defaultForm)
  const [errors,  setErrors]  = useState({})
  const [options, setOptions] = useState({
    crops:   FALLBACK_CROPS,
    regions: FALLBACK_REGIONS,
    seasons: FALLBACK_SEASONS,
  })

  // Fetch live options from backend on mount
  useEffect(() => {
    getOptions()
      .then(res => {
        if (res.data?.crops && res.data?.regions && res.data?.seasons) {
          setOptions(res.data)
        }
      })
      .catch(() => {
        // Silently fall back to hardcoded values
      })
  }, [])

  // Auto-derive is_weekend from day_of_week
  useEffect(() => {
    const d = parseInt(form.day_of_week)
    if (!isNaN(d)) {
      setForm(f => ({ ...f, is_weekend: (d === 5 || d === 6) ? '1' : '0' }))
    }
  }, [form.day_of_week])

  const validate = () => {
    const e = {}
    const req = (key, label) => {
      if (form[key] === '' || form[key] === null || form[key] === undefined)
        e[key] = `${label} is required`
    }
    const num = (key, label, min, max) => {
      const v = Number(form[key])
      if (form[key] === '') { e[key] = `${label} is required`; return }
      if (isNaN(v) || v < min || v > max)
        e[key] = `${label} must be between ${min} and ${max}`
    }

    req('crop',   'Crop')
    req('region', 'Region')
    req('season', 'Season')

    num('month',       'Month',         1,  12)
    num('day_of_week', 'Day of week',   0,   6)
    num('weather_temp','Temperature', -10,  50)
    num('rainfall_mm', 'Rainfall',      0, 500)
    num('humidity_pct','Humidity',      0, 100)
    num('price_per_quintal', 'Price per quintal', 100, 100000)
    num('fuel_price',        'Fuel price',          50,  500)
    num('transport_cost',    'Transport cost',       50, 5000)
    num('crop_yield',        'Crop yield',          100, 10000)
    num('shelf_life_days',   'Shelf life',            1,  365)
    num('market_arrival',    'Market arrival',        0, 10000)
    num('demand_lag_1',      'Demand lag 1',          0, 10000)
    num('demand_lag_7',      'Demand lag 7',          0, 10000)
    num('avg_7day_demand',   '7-day avg demand',      0, 10000)
    num('avg_30day_demand',  '30-day avg demand',     0, 10000)
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(err => ({ ...err, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    onSubmit({
      crop:   form.crop,
      region: form.region,
      season: form.season,

      month:       parseInt(form.month),
      day_of_week: parseInt(form.day_of_week),
      is_weekend:  parseInt(form.is_weekend),

      weather_temp: parseFloat(form.weather_temp),
      rainfall_mm:  parseFloat(form.rainfall_mm),
      humidity_pct: parseFloat(form.humidity_pct),

      festival_flag: parseInt(form.festival_flag),
      holiday_flag:  parseInt(form.holiday_flag),

      price_per_quintal: parseFloat(form.price_per_quintal),
      fuel_price:        parseFloat(form.fuel_price),
      transport_cost:    parseFloat(form.transport_cost),
      crop_yield:        parseInt(form.crop_yield),

      shelf_life_days: parseInt(form.shelf_life_days),
      market_arrival:  parseFloat(form.market_arrival),

      demand_lag_1:    parseFloat(form.demand_lag_1),
      demand_lag_7:    parseFloat(form.demand_lag_7),
      avg_7day_demand:  parseFloat(form.avg_7day_demand),
      avg_30day_demand: parseFloat(form.avg_30day_demand),
    })
  }

  const handleReset = () => { setForm(defaultForm); setErrors({}) }

  const field = (key, label, icon, placeholder, type = 'number', extraProps = {}) => (
    <div className={`form-group ${errors[key] ? 'has-error' : ''}`}>
      <label htmlFor={key}>
        <span className="label-icon">{icon}</span> {label}
      </label>
      <div className="input-wrapper">
        <input
          type={type}
          id={key}
          name={key}
          value={form[key]}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={loading}
          {...extraProps}
        />
      </div>
      {errors[key] && <span className="error-msg">{errors[key]}</span>}
    </div>
  )

  const select = (key, label, icon, optionsList) => (
    <div className={`form-group ${errors[key] ? 'has-error' : ''}`}>
      <label htmlFor={key}>
        <span className="label-icon">{icon}</span> {label}
      </label>
      <div className="select-wrapper">
        <select id={key} name={key} value={form[key]} onChange={handleChange} disabled={loading}>
          <option value="">Select {label.toLowerCase()}…</option>
          {optionsList.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="select-arrow">▾</span>
      </div>
      {errors[key] && <span className="error-msg">{errors[key]}</span>}
    </div>
  )

  const toggle = (key, label, icon) => (
    <div className="form-group">
      <label htmlFor={key}>
        <span className="label-icon">{icon}</span> {label}
      </label>
      <div className="select-wrapper">
        <select id={key} name={key} value={form[key]} onChange={handleChange} disabled={loading}>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
        <span className="select-arrow">▾</span>
      </div>
    </div>
  )

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <span className="form-tag">Supply Chain Model</span>
        <h2 className="form-title">Run Prediction</h2>
        <p className="form-subtitle">Enter crop and environmental parameters to get AI-driven supply chain insights.</p>
      </div>

      {/* ── Section 1: Crop Info ── */}
      <p className="form-section-label">🌱 Crop Info</p>
      <div className="form-grid">
        {select('crop',   'Crop',   '🌾', options.crops)}
        {select('region', 'Region', '📍', options.regions)}
        {select('season', 'Season', '🌦️', options.seasons)}
      </div>

      {/* ── Section 2: Date ── */}
      <p className="form-section-label">📅 Date</p>
      <div className="form-grid">
        {field('month',       'Month',       '🗓️', 'e.g. 8',  'number', { min:1, max:12 })}
        {field('day_of_week', 'Day of Week', '📆', '0=Mon … 6=Sun', 'number', { min:0, max:6 })}
        {toggle('is_weekend', 'Is Weekend', '🛌')}
      </div>

      {/* ── Section 3: Weather ── */}
      <p className="form-section-label">☁️ Weather</p>
      <div className="form-grid">
        {field('weather_temp', 'Temperature (°C)', '🌡️', 'e.g. 32')}
        {field('rainfall_mm',  'Rainfall (mm)',    '🌧️', 'e.g. 45')}
        {field('humidity_pct', 'Humidity (%)',     '💧', 'e.g. 68')}
      </div>

      {/* ── Section 4: Flags ── */}
      <p className="form-section-label">🚩 Flags</p>
      <div className="form-grid">
        {toggle('festival_flag', 'Festival Day', '🎉')}
        {toggle('holiday_flag',  'Holiday',      '🏖️')}
      </div>

      {/* ── Section 5: Economics ── */}
      <p className="form-section-label">💰 Economics</p>
      <div className="form-grid">
        {field('price_per_quintal', 'Price / Quintal (₹)', '💵', 'e.g. 12000')}
        {field('fuel_price',        'Fuel Price (₹/L)',    '⛽', 'e.g. 100')}
        {field('transport_cost',    'Transport Cost (₹)',  '🚚', 'e.g. 400')}
        {field('crop_yield',        'Crop Yield (kg/ha)',  '🌿', 'e.g. 2500')}
      </div>

      {/* ── Section 6: Supply ── */}
      <p className="form-section-label">📦 Supply</p>
      <div className="form-grid">
        {field('shelf_life_days', 'Shelf Life (days)',      '🗃️', 'e.g. 30')}
        {field('market_arrival',  'Market Arrival (units)', '🏪', 'e.g. 500')}
      </div>

      {/* ── Section 7: Demand History ── */}
      <p className="form-section-label">📊 Demand History</p>
      <div className="form-grid">
        {field('demand_lag_1',    'Demand Yesterday',     '📉', 'e.g. 1200')}
        {field('demand_lag_7',    'Demand 7 Days Ago',    '📉', 'e.g. 1100')}
        {field('avg_7day_demand', '7-Day Avg Demand',     '📈', 'e.g. 1150')}
        {field('avg_30day_demand','30-Day Avg Demand',    '📈', 'e.g. 1080')}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-reset" onClick={handleReset} disabled={loading}>
          Clear
        </button>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <span className="btn-loading">
              <span className="spinner" />
              Analysing…
            </span>
          ) : (
            <>
              <span>Run Analysis</span>
              <span className="btn-arrow">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}