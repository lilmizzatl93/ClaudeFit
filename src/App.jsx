import { useState, useRef, useEffect } from 'react'
import { supabase } from './supabase'
import './App.css'

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

const TrashIcon = ({ onClick }) => (
  <span onClick={onClick} className="trash-icon" title="Remove">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor"/>
      <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="5" y="8" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </span>
)

function Dropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find(o => o === value)

  return (
    <div className="dropdown-wrap" ref={ref}>
      <button
        className={`dropdown-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}>
        <span className={selected ? 'dropdown-value' : 'dropdown-placeholder'}>
          {selected || placeholder}
        </span>
        <svg className={`dropdown-chevron ${open ? 'flipped' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="dropdown-menu">
          {options.map(opt => (
            <button
              key={opt}
              className={`dropdown-option ${value === opt ? 'selected' : ''}`}
              onClick={() => { onChange(opt); setOpen(false) }}>
              {opt}
              {value === opt && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function App() {
  const [screen, setScreen] = useState('checkin')
  return (
    <div className="app">
      <header className="app-header">
        <h1>ClaudeFit</h1>
        <p className="app-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </header>
      <nav className="app-nav">
        <button className={screen === 'checkin' ? 'active' : ''} onClick={() => setScreen('checkin')}>Check-In</button>
        <button className={screen === 'dashboard' ? 'active' : ''} onClick={() => setScreen('dashboard')}>Dashboard</button>
      </nav>
      <main className="app-main">
        {screen === 'checkin' && <CheckIn />}
        {screen === 'dashboard' && <div><h2>Dashboard</h2><p>Coming soon...</p></div>}
      </main>
    </div>
  )
}

function CheckIn() {
  const timeOfDay = getTimeOfDay()
  const title = timeOfDay === 'morning' ? 'Morning Check-In' : timeOfDay === 'afternoon' ? 'Afternoon Check-In' : 'Evening Check-In'
  return (
    <div>
      <h2>{title}</h2>
      <MorningForm />
    </div>
  )
}

const clothesProbes = {
  'bloated': [
    "Bloating hits different — your body's clearly processing something. Stress, food, hormones, all of it counts. What's your gut saying?",
    "Bloat is your body being loud about something. What do you think it's reacting to today?",
    "That full, uncomfortable feeling is real data. Anything feel off lately — sleep, food, stress?"
  ],
  'slightly tight': [
    "Tight can mean a hundred things — water, inflammation, a hard week. What's your read on it?",
    "Feeling a little snug? Your body's probably holding onto something. What's been going on?",
    "That slight tightness is worth paying attention to. What do you think's behind it today?"
  ],
  'tight': [
    "When things feel tight, your body's usually trying to tell you something. What's it saying to you?",
    "Tight is uncomfortable and valid. What do you think your body's holding onto right now?",
    "That tightness is real — not a judgment, just a signal. What's your body dealing with lately?"
  ]
}

const moveProbes = {
  'difficult': [
    "Difficult days are real and they matter. What do you think your body's asking for right now?",
    "When movement feels hard, that's important info. What's going on under the surface today?",
    "Your body's working through something. What feels like it might be behind the resistance?"
  ],
  'heavy': [
    "Heavy is such a specific feeling — like you're carrying more than just your body. What's weighing on you?",
    "That heaviness is worth sitting with. Physical, mental, or both?",
    "When everything feels heavy, it's usually more than one thing. What's your body holding today?"
  ],
  'stiff': [
    "Stiffness usually means your recovery needs some love. How's your sleep been lately?",
    "Stiff usually shows up when the body hasn't had enough time to reset. What's recovery looked like?",
    "That stiffness is your body asking for something — rest, movement, hydration? What feels right?"
  ],
  'achy': [
    "Achiness is your body being honest with you. What do you think it's reacting to?",
    "Aches are data, not a verdict. What feels like it might be driving it today?",
    "Your body's talking — what do you think it's trying to say right now?"
  ]
}

function getRandomProbe(probeMap, val) {
  const options = probeMap[val]
  if (!options) return null
  return options[Math.floor(Math.random() * options.length)]
}

function getPainColor(val) {
  const v = parseInt(val)
  if (v <= 4) return `hsl(${45 + (v - 1) * 5}, 100%, 50%)`
  if (v === 5) return '#EF9F27'
  return `hsl(${Math.max(0, 25 - (v - 5) * 5)}, 100%, 45%)`
}

function MorningForm() {
  const [energy, setEnergy] = useState(null)
  const [clothes, setClothes] = useState('')
  const [movement, setMovement] = useState('')
  const [pain, setPain] = useState([])
  const [painLevels, setPainLevels] = useState({})
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [otherPainInput, setOtherPainInput] = useState('')
  const [customPain, setCustomPain] = useState(localStorage.getItem('customPainArea') || '')
  const [clothesProbe, setClothesProbe] = useState('')
  const [moveProbe, setMoveProbe] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  const positiveClothes = ['loose', 'just right']
  const positiveMoves = ['fluid', 'easy']
  const negativeMoves = ['difficult', 'heavy', 'stiff', 'achy']

  const selectClothes = (val) => {
    setClothes(val)
    if (!val) { setClothesProbe(''); return }
    if (positiveClothes.includes(val)) {
      setShowConfetti(true)
      setClothesProbe('')
      setTimeout(() => setShowConfetti(false), 2500)
    } else {
      setClothesProbe(getRandomProbe(clothesProbes, val) || "Tell me more — what's going on in your body today?")
    }
  }

  const selectMove = (val) => {
    setMovement(val)
    if (!val) { setMoveProbe(''); return }
    if (positiveMoves.includes(val)) {
      setShowConfetti(true)
      setMoveProbe('')
      setTimeout(() => setShowConfetti(false), 2500)
    } else if (negativeMoves.includes(val)) {
      setMoveProbe(getRandomProbe(moveProbes, val) || "Tell me more — what's going on today?")
    } else {
      setMoveProbe('')
    }
  }

  const togglePain = (val) => {
    if (val === 'none') {
      setPain(['none'])
      setShowOtherInput(false)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2500)
      return
    }
    setPain(prev => {
      const filtered = prev.filter(p => p !== 'none')
      return filtered.includes(val)
        ? filtered.filter(t => t !== val)
        : [...filtered, val]
    })
  }

  const saveOtherPain = () => {
    if (otherPainInput.trim()) {
      const area = otherPainInput.trim()
      localStorage.setItem('customPainArea', area)
      setCustomPain(area)
      setPain(prev => [...prev.filter(p => p !== 'none'), area])
      setPainLevels(prev => ({...prev, [area]: 5}))
      setShowOtherInput(false)
      setOtherPainInput('')
    }
  }

  const removeCustomPain = () => {
    localStorage.removeItem('customPainArea')
    setCustomPain('')
    setPain(prev => prev.filter(p => p !== customPain))
    setPainLevels(prev => {
      const n = {...prev}
      delete n[customPain]
      return n
    })
  }

  const activePainAreas = pain.filter(p => p !== 'none')
const handleSave = async () => {
  const { error } = await supabase.from('checkins').insert([{
    time_of_day: getTimeOfDay(),
    energy,
    clothes,
    movement,
    pain_areas: activePainAreas,
    pain_levels: painLevels,
    clothes_probe: clothesProbe,
    move_probe: moveProbe,
    created_at: new Date().toISOString()
  }])
  if (error) {
    alert('Something went wrong saving. Try again!')
    console.error(error)
  } else {
    alert('Check-in saved!')
  }
}
  return (
    <div className="form-body">
      {showConfetti && <Confetti />}

      <div className="section">
        <p className="section-label">Energy Level</p>
        <div className="scale-row">
          {[[1,'drained'],[2,''],[3,'good'],[4,''],[5,'super']].map(([n, label]) => (
            <button key={n} className={energy === n ? 'scale-btn active' : 'scale-btn'} onClick={() => setEnergy(n)}>
              {n}{label ? <span className="scale-label">{label}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <p className="section-label">How Do You Feel In Your Clothes?</p>
        <Dropdown
          value={clothes}
          onChange={selectClothes}
          options={['loose','just right','bloated','slightly tight','tight']}
          placeholder="Select"
        />
        <div className="probe-wrap">
          {clothesProbe && (
            <div className="probe-message">
              <p>{clothesProbe}</p>
              <textarea placeholder="Take your time..." rows={3} />
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <p className="section-label">How Does Movement Feel?</p>
        <Dropdown
          value={movement}
          onChange={selectMove}
          options={['fluid','easy','difficult','heavy','stiff','achy']}
          placeholder="Select"
        />
        <div className="probe-wrap">
          {moveProbe && (
            <div className="probe-message">
              <p>{moveProbe}</p>
              <textarea placeholder="Take your time..." rows={3} />
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <p className="section-label">Any Pain Today?</p>

        <div className="tag-row" style={{marginBottom: '8px'}}>
          {['none','hip','back','neck'].map(t => (
            <button key={t} className={pain.includes(t) ? 'tag active' : 'tag'}
              onClick={() => togglePain(t)}>{t}</button>
          ))}
        </div>

        <div className="tag-row" style={{marginBottom: '8px'}}>
          {['glutes','legs','general'].map(t => (
            <button key={t} className={pain.includes(t) ? 'tag active' : 'tag'}
              onClick={() => togglePain(t)}>{t}</button>
          ))}
        </div>

        {customPain && (
          <div className="tag-row" style={{marginBottom: '8px'}}>
            <button
              className={pain.includes(customPain) ? 'tag active' : 'tag'}
              onClick={() => togglePain(customPain)}>
              {customPain}
              <TrashIcon onClick={e => { e.stopPropagation(); removeCustomPain() }} />
            </button>
          </div>
        )}

        {activePainAreas.map(area => (
          <div key={area} className="pain-slider">
            <span className="pain-area">{area}</span>
            <input
              type="range" min="1" max="10" defaultValue="5"
              style={{accentColor: getPainColor(painLevels[area] || 5)}}
              onChange={e => setPainLevels({...painLevels, [area]: e.target.value})}
            />
            <span className="pain-num" style={{color: getPainColor(painLevels[area] || 5)}}>
              {String(painLevels[area] || 5).padStart(2, '\u00A0')}/10
            </span>
          </div>
        ))}

        {!customPain && (
          <div className="tag-row" style={{marginTop: '8px'}}>
            <button
              className={showOtherInput ? 'tag active' : 'tag'}
              onClick={() => setShowOtherInput(!showOtherInput)}>
              other
            </button>
          </div>
        )}

        {showOtherInput && (
          <div className="other-pain-input">
            <input
              type="text"
              placeholder="Where's the pain?"
              value={otherPainInput}
              onChange={e => setOtherPainInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveOtherPain()}
            />
            <button onClick={saveOtherPain}>Add</button>
          </div>
        )}
      </div>

      <button className="submit-btn" onClick={handleSave}>Save Check-In</button>
    </div>
  )
}

function Confetti() {
  const pieces = Array.from({length: 30}, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    color: ['#1D9E75','#EF9F27','#378ADD','#E24B4A','#9B59B6'][Math.floor(Math.random() * 5)]
  }))
  return (
    <div className="confetti-wrap" aria-hidden="true">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{left: `${p.left}%`, animationDelay: `${p.delay}s`, background: p.color}} />
      ))}
    </div>
  )
}

export default App