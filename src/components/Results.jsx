/**
 * Results.jsx — HarvestIQ
 * Drop this file into src/components/Results.jsx
 *
 * Displays AI prediction results: demand forecast, supply gap, spoilage risk,
 * and a recommendations section. Matches the App.jsx green/cream palette.
 */

import React from 'react'

const CSS = `
.results-root {
  font-family: var(--font-body, 'DM Sans', system-ui, sans-serif);
  color: var(--text-primary, #1a2e20);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ── Metric cards ── */
.res-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.res-metric {
  background: rgba(255,255,255,0.85);
  border: 1px solid rgba(45,106,79,0.13);
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: resSlideUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
}
.res-metric:nth-child(1) { animation-delay: 0.05s; }
.res-metric:nth-child(2) { animation-delay: 0.10s; }
.res-metric:nth-child(3) { animation-delay: 0.15s; }
.res-metric:nth-child(4) { animation-delay: 0.20s; }
@keyframes resSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.res-metric-icon {
  font-size: 20px;
  margin-bottom: 4px;
}
.res-metric-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted, #6b8575);
}
.res-metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--green-deep, #1a3a2a);
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.res-metric-unit {
  font-size: 0.72rem;
  font-weight: 400;
  color: var(--text-muted, #6b8575);
  margin-left: 2px;
}
.res-metric-sub {
  font-size: 0.72rem;
  color: var(--text-muted, #6b8575);
  font-weight: 300;
  margin-top: 2px;
}

/* ── Risk badge ── */
.risk-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-top: 4px;
}
.risk-low    { background: rgba(16,185,129,0.13); color: #065f46; border: 1px solid rgba(16,185,129,0.3); }
.risk-medium { background: rgba(233,160,59,0.13); color: #92400e; border: 1px solid rgba(233,160,59,0.3); }
.risk-high   { background: rgba(224,92,92,0.13);  color: #991b1b; border: 1px solid rgba(224,92,92,0.3); }

/* ── Supply gap bar ── */
.res-gap-bar-wrap {
  margin-top: 6px;
}
.res-gap-bar-track {
  height: 6px;
  background: rgba(45,106,79,0.1);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 4px;
}
.res-gap-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.8s cubic-bezier(0.34,1.56,0.64,1);
}
.fill-surplus { background: linear-gradient(90deg, #40916c, #74c69d); }
.fill-deficit { background: linear-gradient(90deg, #e05c5c, #f87171); }

/* ── Recommendations ── */
.res-recs {
  background: rgba(116,198,157,0.08);
  border: 1px solid rgba(64,145,108,0.15);
  border-radius: 16px;
  padding: 14px 16px;
  animation: resSlideUp 0.4s 0.25s cubic-bezier(0.4,0,0.2,1) both;
}
.res-recs-title {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--green-mid, #2d6a4f);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.res-rec-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--text-primary, #1a2e20);
  line-height: 1.5;
  padding: 5px 0;
  border-bottom: 1px solid rgba(64,145,108,0.08);
  font-weight: 300;
}
.res-rec-item:last-child { border-bottom: none; }
.res-rec-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--green-bright, #40916c);
  flex-shrink: 0;
  margin-top: 6px;
}

/* ── Input summary ── */
.res-inputs {
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(45,106,79,0.1);
  border-radius: 14px;
  padding: 12px 14px;
  animation: resSlideUp 0.4s 0.3s cubic-bezier(0.4,0,0.2,1) both;
}
.res-inputs-title {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted, #6b8575);
  margin-bottom: 8px;
}
.res-inputs-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.res-chip {
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--green-deep, #1a3a2a);
  background: rgba(116,198,157,0.15);
  border: 1px solid rgba(64,145,108,0.18);
  padding: 3px 10px;
  border-radius: 999px;
}
`

/* ── Helpers ── */
function riskClass(risk) {
  if (!risk) return 'risk-medium'
  const r = risk.toString().toLowerCase()
  if (r === 'low')    return 'risk-low'
  if (r === 'high')   return 'risk-high'
  return 'risk-medium'
}

function riskEmoji(risk) {
  if (!risk) return '🟡'
  const r = risk.toString().toLowerCase()
  if (r === 'low')  return '🟢'
  if (r === 'high') return '🔴'
  return '🟡'
}

function fmt(val, decimals = 0) {
  if (val === undefined || val === null || val === '') return '—'
  const n = parseFloat(val)
  if (isNaN(n)) return val
  return n.toLocaleString('en-IN', { maximumFractionDigits: decimals })
}

export default function Results({ data, inputParams }) {
  if (!data) return null

  const demand        = data.predicted_demand       ?? data.demand        ?? null
  const supplyGap     = data.supply_gap              ?? data.supplyGap     ?? null
  const spoilageRisk  = data.spoilage_risk           ?? data.spoilageRisk  ?? null
  const recommendations = data.recommendations      ?? []
  const confidence    = data.confidence_score        ?? data.confidence    ?? null

  // Compute gap bar width (cap at 100%)
  const gapAbs        = Math.abs(parseFloat(supplyGap) || 0)
  const demandVal     = Math.abs(parseFloat(demand) || 1)
  const gapPct        = Math.min((gapAbs / demandVal) * 100, 100)
  const isSurplus     = parseFloat(supplyGap) >= 0

  return (
    <>
      <style>{CSS}</style>
      <div className="results-root">

        {/* ── Key metrics grid ── */}
        <div className="res-grid">

          {/* Demand */}
          <div className="res-metric">
            <span className="res-metric-icon">📦</span>
            <span className="res-metric-label">Est. Demand</span>
            <span className="res-metric-value">
              {fmt(demand)}
              <span className="res-metric-unit">MT</span>
            </span>
            <span className="res-metric-sub">Predicted market need</span>
          </div>

          {/* Supply Gap */}
          <div className="res-metric">
            <span className="res-metric-icon">{isSurplus ? '📈' : '📉'}</span>
            <span className="res-metric-label">Supply Gap</span>
            <span className="res-metric-value" style={{ color: isSurplus ? '#065f46' : '#991b1b' }}>
              {supplyGap !== null ? (isSurplus ? '+' : '') : ''}{fmt(supplyGap)}
              <span className="res-metric-unit">MT</span>
            </span>
            <div className="res-gap-bar-wrap">
              <div className="res-gap-bar-track">
                <div
                  className={`res-gap-bar-fill ${isSurplus ? 'fill-surplus' : 'fill-deficit'}`}
                  style={{ width: `${gapPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Spoilage Risk */}
          <div className="res-metric">
            <span className="res-metric-icon">⚠️</span>
            <span className="res-metric-label">Spoilage Risk</span>
            <div className={`risk-badge ${riskClass(spoilageRisk)}`}>
              {riskEmoji(spoilageRisk)} {spoilageRisk ?? 'N/A'}
            </div>
            <span className="res-metric-sub">Environmental risk</span>
          </div>

          {/* Confidence */}
          <div className="res-metric">
            <span className="res-metric-icon">🎯</span>
            <span className="res-metric-label">Confidence</span>
            <span className="res-metric-value">
              {confidence !== null ? `${fmt(parseFloat(confidence) * (parseFloat(confidence) <= 1 ? 100 : 1), 1)}` : '—'}
              {confidence !== null && <span className="res-metric-unit">%</span>}
            </span>
            <span className="res-metric-sub">Model confidence score</span>
          </div>

        </div>

        {/* ── Recommendations ── */}
        {recommendations.length > 0 && (
          <div className="res-recs">
            <div className="res-recs-title">💡 Recommendations</div>
            {recommendations.map((rec, i) => (
              <div key={i} className="res-rec-item">
                <div className="res-rec-dot" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Input summary chips ── */}
        {inputParams && (
          <div className="res-inputs">
            <div className="res-inputs-title">Inputs used</div>
            <div className="res-inputs-chips">
              {inputParams.crop        && <span className="res-chip">🌱 {inputParams.crop}</span>}
              {inputParams.region      && <span className="res-chip">📍 {inputParams.region}</span>}
              {inputParams.season      && <span className="res-chip">🌤️ {inputParams.season}</span>}
              {inputParams.temperature !== '' && <span className="res-chip">🌡️ {inputParams.temperature}°C</span>}
              {inputParams.rainfall    !== '' && <span className="res-chip">🌧️ {inputParams.rainfall}mm</span>}
              {inputParams.transport_mode && <span className="res-chip">🚛 {inputParams.transport_mode}</span>}
              {inputParams.cold_chain_available && <span className="res-chip">❄️ Cold Chain</span>}
              {inputParams.govt_support         && <span className="res-chip">🏛️ Govt Support</span>}
            </div>
          </div>
        )}

      </div>
    </>
  )
}
