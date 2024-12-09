import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Matrix characters
    const chars = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789'
    const charArray = chars.split('')
    const fontSize = 14
    const columns = canvas.width / fontSize

    // Array to track y position of each column
    const drops = Array(Math.floor(columns)).fill(1)

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Green text
      ctx.fillStyle = '#0F0'
      ctx.font = `${fontSize}px monospace`

      // Draw characters
      drops.forEach((y, i) => {
        const char = charArray[Math.floor(Math.random() * charArray.length)]
        const x = i * fontSize
        ctx.fillText(char, x, y * fontSize)

        // Reset position if drop reaches bottom or randomly
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      })
    }

    const interval = setInterval(draw, 33) // ~30fps

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="matrix-background" />
      <div className="app">
        <header>
          <h1>Evan + AI</h1>
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
            <li>Matrix Background</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
