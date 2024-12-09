import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>React Demo App</h1>
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </header>

      <div className="card">
        <h2>Interactive Counter</h2>
        <div className="counter">
          <button onClick={() => setCount(count - 1)}>-</button>
          <span>{count}</span>
          <button onClick={() => setCount(count + 1)}>+</button>
        </div>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>

      <div className="card">
        <h2>Features Demonstrated</h2>
        <ul>
          <li>State Management with useState</li>
          <li>Event Handling</li>
          <li>Conditional Rendering</li>
          <li>Dynamic Styling</li>
        </ul>
      </div>
    </div>
  )
}

export default App
