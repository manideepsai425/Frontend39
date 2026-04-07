import React from 'react'

function getRiskLevel(spoilageRisk) {
  if (spoilageRisk === undefined || spoilageRisk === null) return null
  const val = typeof spoilageRisk === 'string' ? spoilageRisk.toLowerCase() : ''
  if (typeof spoilageRisk === 'number') {
    if (spoilageRisk >= 70) return { level: 'high',   label: 'High Risk',   color: 'risk-high' }
    if (spoilageRisk >= 40) return { level: 'medium', label: 'Medium Risk', color: 'risk-medium' }
    return { level: 'low', label: 'Low Risk', color: 'risk-low' }
  }
  if (val.includes('high'))                         return { level: 'high',   label: 'High Risk',   color: 'risk-high' }
  if (val.includes('medium') || val.includes('moderate')) return { level: 'medium', label: 'Medium Risk', color: 'risk-medium' }
  if (val.includes('low'))                          return { level: 'low',    label: 'Low Risk',    color: 'risk-low' }
  return { level: 'unknown', label: String(spoilageRisk), color: 'risk-low' }
}

function getGapSentiment(gap) {
  if (gap === undefined || gap === null) return null
  const val = typeof gap === 'number' ? gap : parseFloat(gap)
  if (isNaN(val)) return { label: String(gap), color: 'gap-neutral', icon: '↔' }
  if (val > 0)  return { label: `+${val.toLocaleString()}`, color: 'gap-surplus', icon: '▲', note: 'Surplus' }
  if (val < 0)  return { label: val.toLocaleString(),       color: 'gap-deficit', icon: '▼', note: 'Deficit' }
  return { label: '0', color: 'gap-neutral', icon: '↔', note: 'Balanced' }
}

function formatValue(val, unit = '') {
  if (val === undefined || val === null) return '—'
  if (typeof val === 'number') return `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}${unit}`
  return String(val)
}

export default function Results({ data, error, inputParams }) {
  if (error) {
    return (
      <div className="results-area">
        <div className="error-card">
          <span className="error-icon">⚠️</span>
          <div>
            <p className="error-title">Prediction Failed</p>
            <p className="error-body">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  // ✅ Correct field names matching backend PredictionResponse schema
  const demand  = data.predicted_demand
  const gapVal  = data.predicted_supply_gap
  const riskRaw = data.spoilage_risk_label        // "HIGH RISK" or "LOW RISK"
  const riskPct = data.spoilage_risk_probability  // e.g. 73.42 (already %)
  const alert   = data.alert

  const risk = getRiskLevel(riskPct ?? riskRaw)
  const gap  = getGapSentiment(gapVal)

  return (
    <div className="results-area">
      <div className="results-header">
        <span className="results-tag">AI Prediction Results</span>
        {inputParams && (
          <p className="results-meta">
            {inputParams.crop} · {inputParams.region} · {inputParams.season} ·{' '}
            {inputParams.weather_temp}°C · {inputParams.rainfall_mm}mm
          </p>
        )}
      </div>

      {/* Alert banner */}
      {alert && (
        <div className="alert-banner">
          {alert}
        </div>
      )}

      <div className="results-grid">
        {/* Predicted Demand */}
        <div className="result-card demand-card">
          <div className="card-icon-wrap">
            <span className="card-icon">📦</span>
          </div>
          <div className="card-content">
            <p className="card-label">Predicted Demand</p>
            <p className="card-value">{formatValue(demand, ' units')}</p>
            <p className="card-desc">Estimated market demand for the selected crop and conditions.</p>
          </div>
          <div className="card-bar">
            <div className="card-bar-fill demand-bar" style={{ width: '70%' }} />
          </div>
        </div>

        {/* Supply-Demand Gap */}
        <div className={`result-card gap-card ${gap?.color || ''}`}>
          <div className="card-icon-wrap">
            <span className="card-icon">⚖️</span>
          </div>
          <div className="card-content">
            <p className="card-label">Supply–Demand Gap</p>
            <p className="card-value gap-value">
              {gap ? (
                <>
                  <span className="gap-icon">{gap.icon}</span>
                  {gap.label}
                </>
              ) : '—'}
            </p>
            {gap?.note && <p className="card-badge">{gap.note}</p>}
            <p className="card-desc">Difference between projected supply and predicted demand.</p>
          </div>
        </div>

        {/* Spoilage Risk */}
        <div className={`result-card risk-card ${risk?.color || ''}`}>
          <div className="card-icon-wrap">
            <span className="card-icon">
              {risk?.level === 'high' ? '🔴' : risk?.level === 'medium' ? '🟡' : '🟢'}
            </span>
          </div>
          <div className="card-content">
            <p className="card-label">Spoilage Risk</p>
            <p className="card-value">{risk ? risk.label : riskRaw}</p>
            {riskPct !== undefined && (
              <p className="card-badge">{riskPct.toFixed(1)}% probability</p>
            )}
            <p className="card-desc">Likelihood of crop spoilage based on environmental factors.</p>
          </div>
          {risk?.level && (
            <div className="risk-indicator">
              <div className={`risk-dot ${risk.level}`} />
              <div className={`risk-dot ${risk.level === 'medium' || risk.level === 'high' ? risk.level : ''}`} />
              <div className={`risk-dot ${risk.level === 'high' ? risk.level : ''}`} />
            </div>
          )}
        </div>
      </div>

      {/* Full API response */}
      <details className="raw-response">
        <summary>View full API response</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  )
}