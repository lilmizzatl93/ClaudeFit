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
        {screen === 'morning' && <div><h2>Morning check-in</h2><p>Coming soon...</p></div>}
        {screen === 'evening' && <div><h2>Evening wind-down</h2><p>Coming soon...</p></div>}
        {screen === 'dashboard' && <div><h2>Dashboard</h2><p>Coming soon...</p></div>}
        {screen === 'insights' && <div><h2>Insights</h2><p>Coming soon...</p></div>}
      </main>
    </div>
  )
}

export default App