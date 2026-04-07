
import React, { useState } from 'react'

const CROPS = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton', 'Sugarcane', 'Potato', 'Tomato', 'Onion', 'Other']
const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'Northeast', 'Northwest', 'Southeast', 'Southwest']
const SEASONS = ['Kharif', 'Rabi', 'Zaid', 'Summer', 'Winter', 'Monsoon', 'Spring', 'Autumn']

const defaultForm = {
  crop: '',
  region: '',
  season: '',
  temperature: '',
  rainfall: '',
}

export default function Form({ onSubmit, loading }) {
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.crop) e.crop = 'Crop is required'
    if (!form.region) e.region = 'Region is required'
    if (!form.season) e.season = 'Season is required'
    if (form.temperature === '') e.temperature = 'Temperature is required'
    else if (isNaN(form.temperature) || Number(form.temperature) < -50 || Number(form.temperature) > 60)
      e.temperature = 'Enter a valid temperature (−50 to 60 °C)'
    if (form.rainfall === '') e.rainfall = 'Rainfall is required'
    else if (isNaN(form.rainfall) || Number(form.rainfall) < 0)
      e.rainfall = 'Enter a valid rainfall (≥ 0 mm)'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    onSubmit({
      crop: form.crop,
      region: form.region,
      season: form.season,
      temperature: parseFloat(form.temperature),
      rainfall: parseFloat(form.rainfall),
    })
  }

  const handleReset = () => {
    setForm(defaultForm)
    setErrors({})
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <span className="form-tag">Supply Chain Model</span>
        <h2 className="form-title">Run Prediction</h2>
        <p className="form-subtitle">Enter crop and environmental parameters to get AI-driven supply chain insights.</p>
      </div>

      <div className="form-grid">
        {/* Crop */}
        <div className={`form-group ${errors.crop ? 'has-error' : ''}`}>
          <label htmlFor="crop">
            <span className="label-icon">🌱</span> Crop
          </label>
          <div className="select-wrapper">
            <select id="crop" name="crop" value={form.crop} onChange={handleChange} disabled={loading}>
              <option value="">Select crop…</option>
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="select-arrow">▾</span>
          </div>
          {errors.crop && <span className="error-msg">{errors.crop}</span>}
        </div>

        {/* Region */}
        <div className={`form-group ${errors.region ? 'has-error' : ''}`}>
          <label htmlFor="region">
            <span className="label-icon">📍</span> Region
          </label>
          <div className="select-wrapper">
            <select id="region" name="region" value={form.region} onChange={handleChange} disabled={loading}>
              <option value="">Select region…</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <span className="select-arrow">▾</span>
          </div>
          {errors.region && <span className="error-msg">{errors.region}</span>}
        </div>

        {/* Season */}
        <div className={`form-group ${errors.season ? 'has-error' : ''}`}>
          <label htmlFor="season">
            <span className="label-icon">🌦️</span> Season
          </label>
          <div className="select-wrapper">
            <select id="season" name="season" value={form.season} onChange={handleChange} disabled={loading}>
              <option value="">Select season…</option>
              {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="select-arrow">▾</span>
          </div>
          {errors.season && <span className="error-msg">{errors.season}</span>}
        </div>

        {/* Temperature */}
        <div className={`form-group ${errors.temperature ? 'has-error' : ''}`}>
          <label htmlFor="temperature">
            <span className="label-icon">🌡️</span> Temperature
          </label>
          <div className="input-wrapper">
            <input
              type="number"
              id="temperature"
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              placeholder="e.g. 28"
              step="0.1"
              disabled={loading}
            />
            <span className="input-unit">°C</span>
          </div>
          {errors.temperature && <span className="error-msg">{errors.temperature}</span>}
        </div>

        {/* Rainfall */}
        <div className={`form-group ${errors.rainfall ? 'has-error' : ''}`}>
          <label htmlFor="rainfall">
            <span className="label-icon">🌧️</span> Rainfall
          </label>
          <div className="input-wrapper">
            <input
              type="number"
              id="rainfall"
              name="rainfall"
              value={form.rainfall}
              onChange={handleChange}
              placeholder="e.g. 120"
              step="0.1"
              min="0"
              disabled={loading}
            />
            <span className="input-unit">mm</span>
          </div>
          {errors.rainfall && <span className="error-msg">{errors.rainfall}</span>}
        </div>
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