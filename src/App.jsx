import { useState } from 'react'
import './App.css'

function App() {
  const [screen, setScreen] = useState('morning')

  return (
    <div className="app">
      <header className="app-header">
        <h1>ClaudeFit</h1>
        <p className="app-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </header>

      <nav className="app-nav">
        <button className={screen === 'morning' ? 'active' : ''} onClick={() => setScreen('morning')}>Morning</button>
        <button className={screen === 'evening' ? 'active' : ''} onClick={() => setScreen('evening')}>Evening</button>
        <button className={screen === 'dashboard' ? 'active' : ''} onClick={() => setScreen('dashboard')}>Dashboard</button>
        <button className={screen === 'insights' ? 'active' : ''} onClick={() => setScreen('insights')}>Insights</button>
      </nav>

      <main className="app-main">
        {screen === 'morning' && <Morning />}
        {screen === 'evening' && <div><h2>Evening wind-down</h2><p>Coming soon...</p></div>}
        {screen === 'dashboard' && <div><h2>Dashboard</h2><p>Coming soon...</p></div>}
        {screen === 'insights' && <div><h2>Insights</h2><p>Coming soon...</p></div>}
      </main>
    </div>
  )
}

function Morning() {
  const [energy, setEnergy] = useState(null)
  const [clothes, setClothes] = useState([])
  const [movement, setMovement] = useState([])
  const [pain, setPain] = useState([])
  const [painLevels, setPainLevels] = useState({})

  const toggleTag = (list, setList, val) => {
    setList(list.includes(val) ? list.filter(t => t !== val) : [...list, val])
  }

  return (
    <div>
      <h2>Morning check-in</h2>

      <div className="section">
        <p className="section-label">Energy level</p>
        <div className="scale-row">
          {[1,2,3,4,5].map(n => (
            <button key={n} className={energy === n ? 'scale-btn active' : 'scale-btn'} onClick={() => setEnergy(n)}>{n}</button>
          ))}
        </div>
      </div>

      <div className="section">
        <p className="section-label">How do your clothes feel?</p>
        <div className="tag-row">
          {['just right','slightly tight','tight','loose','bloated'].map(t => (
            <button key={t} className={clothes.includes(t) ? 'tag active' : 'tag'} onClick={() => toggleTag(clothes, setClothes, t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="section">
        <p className="section-label">How does movement feel?</p>
        <div className="tag-row">
          {['fluid','strong','heavy','light','stiff','achy'].map(t => (
            <button key={t} className={movement.includes(t) ? 'tag active' : 'tag'} onClick={() => toggleTag(movement, setMovement, t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="section">
        <p className="section-label">Any pain today?</p>
        <div className="tag-row">
          {['none','hip','back','neck','glutes','legs','general'].map(t => (
            <button key={t} className={pain.includes(t) ? 'tag active' : 'tag'}
              onClick={() => toggleTag(pain, setPain, t)}>{t}</button>
          ))}
        </div>
        {pain.filter(p => p !== 'none').map(area => (
          <div key={area} className="pain-slider">
            <span>{area}</span>
            <input type="range" min="1" max="10" defaultValue="5"
              onChange={e => setPainLevels({...painLevels, [area]: e.target.value})}/>
            <span>{painLevels[area] || 5}/10</span>
          </div>
        ))}
      </div>

      <button className="submit-btn">Save morning check-in</button>
    </div>
  )
}

export default App