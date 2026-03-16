import { useState, useEffect, useCallback } from 'react'

/* ───────────────── DATA ───────────────── */

const AI_TEAM = [
  { name: 'Claude', color: '#00E5FF' },
  { name: 'ChatGPT', color: '#74AA9C' },
  { name: 'Gemini', color: '#8B5CF6' },
  { name: 'Grok', color: '#EF4444' },
  { name: 'Manus', color: '#F59E0B' },
]

const BUSINESSES = [
  { name: 'AI Voice Agency', color: '#00E5FF' },
  { name: 'ResumeReady', color: '#d4a853' },
  { name: 'AI100X', color: '#00FF88' },
  { name: 'Master Prompt Playbook', color: '#F59E0B' },
  { name: 'SeeBlinds', color: '#7EB8DA' },
]

const SECTIONS = [
  'Executive Snapshot',
  'Decisions Locked',
  'Offers & Pricing',
  'Copy & Messaging',
  'Technical Architecture',
  'Design Direction',
  'Open Loops',
  'Next Best Moves',
  'Truth Guardrails',
]

const SECTION_ICONS = {
  'Executive Snapshot': '📊',
  'Decisions Locked': '🔒',
  'Offers & Pricing': '💰',
  'Copy & Messaging': '✍️',
  'Technical Architecture': '⚙️',
  'Design Direction': '🎨',
  'Open Loops': '🔄',
  'Next Best Moves': '🎯',
  'Truth Guardrails': '🛡️',
}

/* ───────────────── STORAGE ───────────────── */

function loadData() {
  try {
    const raw = localStorage.getItem('ferrari-os-data')
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveData(data) {
  localStorage.setItem('ferrari-os-data', JSON.stringify(data))
}

function getKey(biz, section) {
  return `${biz}::${section}`
}

/* ───────────────── EXPORT ───────────────── */

function exportMarkdown(bizName, data) {
  let md = `# ${bizName}\n\n_Exported from Ferrari OS Command Center — ${new Date().toLocaleString()}_\n\n`
  SECTIONS.forEach(s => {
    const val = data[getKey(bizName, s)] || ''
    md += `## ${s}\n\n${val || '_No content yet._'}\n\n---\n\n`
  })
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${bizName.replace(/\s+/g, '-').toLowerCase()}-ferrari-os.md`
  a.click()
  URL.revokeObjectURL(url)
}

/* ───────────────── STYLES ───────────────── */

const S = {
  app: (glowColor) => ({
    minHeight: '100vh',
    background: '#0A0A0B',
    position: 'relative',
    overflow: 'hidden',
  }),
  ambientGlow: (color) => ({
    position: 'fixed',
    top: '-200px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '900px',
    height: '600px',
    borderRadius: '50%',
    background: `radial-gradient(ellipse, ${color}12 0%, ${color}06 40%, transparent 70%)`,
    pointerEvents: 'none',
    zIndex: 0,
    transition: 'background 0.8s ease',
  }),
  ambientBottom: (color) => ({
    position: 'fixed',
    bottom: '-300px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '1200px',
    height: '500px',
    borderRadius: '50%',
    background: `radial-gradient(ellipse, ${color}08 0%, transparent 60%)`,
    pointerEvents: 'none',
    zIndex: 0,
    transition: 'background 0.8s ease',
  }),
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px 40px',
  },

  /* Top Bar */
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 0',
    borderBottom: '1px solid #1a1a24',
    flexWrap: 'wrap',
    gap: '12px',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '16px',
    flexWrap: 'wrap',
  },
  logo: {
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 900,
    fontSize: '28px',
    background: 'linear-gradient(135deg, #00E5FF, #00FF88)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '3px',
  },
  commandCenter: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '4px',
    color: '#555',
    textTransform: 'uppercase',
  },
  topRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  userName: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '2px',
    color: '#888',
  },
  clock: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    fontWeight: 500,
    color: '#00E5FF',
    letterSpacing: '1px',
  },

  /* AI Team Bar */
  aiBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '14px 0',
    borderBottom: '1px solid #1a1a24',
    overflowX: 'auto',
    flexWrap: 'wrap',
  },
  aiBarLabel: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '9px',
    fontWeight: 600,
    letterSpacing: '3px',
    color: '#444',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  aiChip: (color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '20px',
    background: `${color}10`,
    border: `1px solid ${color}30`,
    whiteSpace: 'nowrap',
  }),
  aiDot: (color) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 8px ${color}80`,
    animation: 'pulse 2s ease-in-out infinite',
  }),
  aiName: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    fontWeight: 500,
    color: '#ccc',
  },

  /* Stats Row */
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    padding: '16px 0',
  },
  statCard: {
    background: '#111118',
    borderRadius: '10px',
    padding: '16px 20px',
    border: '1px solid #1e1e2a',
  },
  statLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: 500,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  statValue: (color) => ({
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '26px',
    fontWeight: 700,
    color: color || '#fff',
  }),

  /* Business Tabs */
  tabsRow: {
    display: 'flex',
    gap: '6px',
    padding: '8px 0 20px',
    overflowX: 'auto',
    flexWrap: 'wrap',
  },
  tab: (color, active) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: 600,
    padding: '10px 20px',
    borderRadius: '8px',
    border: active ? `1px solid ${color}` : '1px solid #1e1e2a',
    background: active ? `${color}18` : '#111118',
    color: active ? color : '#888',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    whiteSpace: 'nowrap',
    outline: 'none',
  }),

  /* Section Grid */
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '16px',
    animation: 'fadeIn 0.3s ease',
  },
  sectionCard: (color, editing) => ({
    background: '#111118',
    borderRadius: '12px',
    border: editing ? `1px solid ${color}60` : '1px solid #1e1e2a',
    padding: '20px',
    cursor: editing ? 'default' : 'pointer',
    transition: 'all 0.25s ease',
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
  }),
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  sectionTitle: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '1.5px',
    color: '#aaa',
    textTransform: 'uppercase',
  },
  sectionIcon: {
    fontSize: '18px',
  },
  sectionContent: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#999',
    lineHeight: 1.7,
    flex: 1,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  emptyHint: (color) => ({
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: `${color}60`,
    fontStyle: 'italic',
  }),
  textarea: (color) => ({
    width: '100%',
    flex: 1,
    minHeight: '100px',
    background: '#0d0d12',
    border: `1px solid ${color}30`,
    borderRadius: '6px',
    padding: '12px',
    color: '#ddd',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    lineHeight: 1.7,
    resize: 'vertical',
    outline: 'none',
  }),
  btnRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
    justifyContent: 'flex-end',
  },
  btnSave: (color) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    padding: '6px 16px',
    borderRadius: '6px',
    border: 'none',
    background: color,
    color: '#0A0A0B',
    cursor: 'pointer',
  }),
  btnCancel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    padding: '6px 16px',
    borderRadius: '6px',
    border: '1px solid #333',
    background: 'transparent',
    color: '#888',
    cursor: 'pointer',
  },

  /* Export Button */
  exportBtn: (color) => ({
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '2px',
    padding: '12px 28px',
    borderRadius: '8px',
    border: `1px solid ${color}50`,
    background: `${color}12`,
    color: color,
    cursor: 'pointer',
    marginTop: '24px',
    transition: 'all 0.25s ease',
  }),

  /* Footer */
  footer: {
    textAlign: 'center',
    padding: '40px 0 24px',
    borderTop: '1px solid #1a1a24',
    marginTop: '40px',
  },
  footerText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    fontWeight: 400,
    color: '#333',
    letterSpacing: '2px',
  },
}

/* ───────────────── COMPONENTS ───────────────── */

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span style={S.clock}>
      {time.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

function SectionCard({ biz, section, color, data, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const key = getKey(biz, section)
  const value = data[key] || ''

  const handleClick = () => {
    if (!editing) {
      setDraft(value)
      setEditing(true)
    }
  }

  const handleSave = () => {
    onSave(key, draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setEditing(false)
  }

  return (
    <div
      style={S.sectionCard(color, editing)}
      onClick={handleClick}
      onMouseOver={(e) => {
        if (!editing) e.currentTarget.style.borderColor = `${color}40`
      }}
      onMouseOut={(e) => {
        if (!editing) e.currentTarget.style.borderColor = '#1e1e2a'
      }}
    >
      <div style={S.sectionHeader}>
        <span style={S.sectionTitle}>{section}</span>
        <span style={S.sectionIcon}>{SECTION_ICONS[section]}</span>
      </div>
      {editing ? (
        <>
          <textarea
            style={S.textarea(color)}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            placeholder={`Enter ${section.toLowerCase()} content...`}
          />
          <div style={S.btnRow}>
            <button style={S.btnCancel} onClick={(e) => { e.stopPropagation(); handleCancel() }}>
              Cancel
            </button>
            <button style={S.btnSave(color)} onClick={(e) => { e.stopPropagation(); handleSave() }}>
              Save
            </button>
          </div>
        </>
      ) : (
        <div style={S.sectionContent}>
          {value ? value : (
            <span style={S.emptyHint(color)}>Click to add content...</span>
          )}
        </div>
      )}
    </div>
  )
}

/* ───────────────── APP ───────────────── */

export default function App() {
  const [activeTab, setActiveTab] = useState(0)
  const [data, setData] = useState(loadData)

  const handleSave = useCallback((key, value) => {
    setData(prev => {
      const next = { ...prev, [key]: value }
      saveData(next)
      return next
    })
  }, [])

  const biz = BUSINESSES[activeTab]

  return (
    <div style={S.app(biz.color)}>
      {/* Ambient glow */}
      <div style={S.ambientGlow(biz.color)} />
      <div style={S.ambientBottom(biz.color)} />

      <div style={S.content}>
        {/* Top Bar */}
        <div style={S.topBar}>
          <div style={S.logoGroup}>
            <span style={S.logo}>FERRARI OS</span>
            <span style={S.commandCenter}>COMMAND CENTER</span>
          </div>
          <div style={S.topRight}>
            <span style={S.userName}>SHANE HANDEL</span>
            <LiveClock />
          </div>
        </div>

        {/* AI Team Bar */}
        <div style={S.aiBar}>
          <span style={S.aiBarLabel}>AI Team</span>
          {AI_TEAM.map(ai => (
            <div key={ai.name} style={S.aiChip(ai.color)}>
              <div style={S.aiDot(ai.color)} />
              <span style={S.aiName}>{ai.name}</span>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div style={S.statsRow}>
          <div style={S.statCard}>
            <div style={S.statLabel}>Businesses</div>
            <div style={S.statValue()}>{BUSINESSES.length}</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statLabel}>AIs Active</div>
            <div style={S.statValue('#00E5FF')}>{AI_TEAM.length}</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statLabel}>Notion Pages</div>
            <div style={S.statValue('#8B5CF6')}>58+</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statLabel}>Current Tab</div>
            <div style={{ ...S.statValue(biz.color), fontSize: '16px' }}>{biz.name}</div>
          </div>
        </div>

        {/* Business Tabs */}
        <div style={S.tabsRow}>
          {BUSINESSES.map((b, i) => (
            <button
              key={b.name}
              style={S.tab(b.color, i === activeTab)}
              onClick={() => setActiveTab(i)}
              onMouseOver={(e) => {
                if (i !== activeTab) e.currentTarget.style.borderColor = `${b.color}60`
              }}
              onMouseOut={(e) => {
                if (i !== activeTab) e.currentTarget.style.borderColor = '#1e1e2a'
              }}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Section Grid */}
        <div style={S.sectionGrid} key={activeTab}>
          {SECTIONS.map(section => (
            <SectionCard
              key={section}
              biz={biz.name}
              section={section}
              color={biz.color}
              data={data}
              onSave={handleSave}
            />
          ))}
        </div>

        {/* Export Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            style={S.exportBtn(biz.color)}
            onClick={() => exportMarkdown(biz.name, data)}
            onMouseOver={(e) => {
              e.currentTarget.style.background = `${biz.color}25`
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = `${biz.color}12`
            }}
          >
            EXPORT {biz.name.toUpperCase()} — MARKDOWN
          </button>
        </div>

        {/* Footer */}
        <div style={S.footer}>
          <span style={S.footerText}>
            FERRARI OS v2026.3 — BUILT BY CLAUDE + SHANE HANDEL
          </span>
        </div>
      </div>
    </div>
  )
}
