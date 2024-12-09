import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const canvasRef = useRef(null)
  const [isClosing, setIsClosing] = useState(false)

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

  const searchImages = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=AIzaSyBTGl9cun7BA3biTMNTo9tT214GGOtmKlg&cx=f7391e58a685642ce&searchType=image&q=${encodeURIComponent(searchTerm)}`
      )
      const data = await response.json()
      setImages(data.items || [])
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      setSelectedImage(null)
    }, 1500) // Increased from 300ms to 500ms to match new CSS duration
  }

  return (
    <>
      <canvas ref={canvasRef} className="matrix-background" />
      <div className="app">
        <header>
          <h1>Image Search</h1>
        </header>

        <div className="card">
          <form onSubmit={searchImages} className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter search term..."
              className="search-input"
            />
            <button type="submit">Search</button>
          </form>
        </div>

        {loading && <div className="loading">Loading...</div>}

        <div className="image-grid">
          {images.map((item, index) => (
            <div 
              key={index} 
              className="image-item"
              onClick={() => handleImageClick(item)}
            >
              <img
                src={item.link}
                alt={item.title}
                loading="lazy"
              />
              <p>{item.title}</p>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div 
            className={`modal-overlay ${isClosing ? 'modal-closing' : ''}`} 
            onClick={handleClose}
          >
            <div 
              className={`modal-content ${isClosing ? 'modal-content-closing' : ''}`} 
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close" onClick={handleClose}>×</button>
              <img
                src={selectedImage.link}
                alt={selectedImage.title}
                className="modal-image"
              />
              <div className="modal-info">
                <h2>{selectedImage.title}</h2>
                <p>{selectedImage.snippet}</p>
                <div className="modal-details">
                  <p><strong>Source:</strong> {selectedImage.displayLink}</p>
                  {selectedImage.image && (
                    <p><strong>Dimensions:</strong> {selectedImage.image.width} × {selectedImage.image.height}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
