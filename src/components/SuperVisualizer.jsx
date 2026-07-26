import React, { useRef, useEffect } from 'react'

export default function SuperVisualizer({ simulation, isPlaying, speed }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []
    
    // Resize canvas
    const resize = () => {
      const parent = canvas.parentElement
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Init particles based on simulation type
    const initParticles = () => {
      particles = []
      if (simulation === 'weather') {
        for (let i = 0; i < 2000; i++) {
          particles.push({
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * Math.max(canvas.width, canvas.height),
            speed: (Math.random() * 0.02 + 0.005),
            size: Math.random() * 2 + 0.5,
            color: `hsla(${200 + Math.random() * 40}, 100%, 70%, Math.random())`
          })
        }
      } else if (simulation === 'earthquake') {
        for (let i = 0; i < 50; i++) {
          particles.push({
            radius: (i * 15) % Math.max(canvas.width, canvas.height),
            speed: 1,
            life: Math.random() * 100
          })
        }
      } else if (simulation === 'dna') {
        for (let i = 0; i < 300; i++) {
          particles.push({
            yOffset: (i / 300) * canvas.height,
            angleOffset: (i / 300) * Math.PI * 4,
            speed: 0.02
          })
        }
      } else if (simulation === 'rocket') {
        for (let i = 0; i < 500; i++) {
          particles.push({
            x: canvas.width * 0.1,
            y: canvas.height * 0.9,
            vx: Math.random() * -2,
            vy: Math.random() * 2,
            life: Math.random() * 50,
            maxLife: 50
          })
        }
      }
    }

    initParticles()

    let time = 0
    const draw = () => {
      if (!isPlaying) {
        animationFrameId = requestAnimationFrame(draw)
        return
      }
      
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)' // tailwind slate-900 with trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      time += speed

      if (simulation === 'weather') {
        particles.forEach(p => {
          p.angle += p.speed * speed
          p.radius -= 0.5 * speed
          if (p.radius < 5) p.radius = Math.max(canvas.width, canvas.height)
          
          const x = cx + Math.cos(p.angle) * p.radius
          const y = cy + Math.sin(p.angle) * p.radius
          
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(x, y, p.size, 0, Math.PI * 2)
          ctx.fill()
        })
      } else if (simulation === 'earthquake') {
        ctx.fillStyle = 'rgba(15, 23, 42, 1)' // clear full for earthquake
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
        for(let i=0; i<canvas.width; i+=20) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
        for(let i=0; i<canvas.height; i+=20) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width,i); ctx.stroke(); }

        particles.forEach(p => {
          p.radius += p.speed * speed * 2
          if (p.radius > Math.max(canvas.width, canvas.height)) p.radius = 0
          
          ctx.beginPath()
          ctx.arc(cx, cy, p.radius, 0, Math.PI * 2)
          ctx.strokeStyle = `hsla(0, 100%, 50%, ${1 - p.radius / 300})`
          ctx.lineWidth = 2
          ctx.stroke()
          
          // Noise line for seismograph effect
          ctx.beginPath()
          ctx.moveTo(0, canvas.height - 30)
          for(let x=0; x<canvas.width; x+=5) {
            let y = canvas.height - 30 + (Math.random() - 0.5) * (p.radius % 20) * speed
            ctx.lineTo(x, y)
          }
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'
          ctx.stroke()
        })
      } else if (simulation === 'dna') {
        ctx.fillStyle = 'rgba(15, 23, 42, 1)' 
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        const amplitude = canvas.width * 0.2
        particles.forEach((p, i) => {
          const currentAngle = p.angleOffset + time * p.speed
          
          // Strand 1
          const x1 = cx + Math.sin(currentAngle) * amplitude
          // Strand 2
          const x2 = cx + Math.sin(currentAngle + Math.PI) * amplitude
          
          const y = (p.yOffset + time * speed * 50) % canvas.height
          
          // Connectors
          if (i % 10 === 0) {
             ctx.beginPath()
             ctx.moveTo(x1, y)
             ctx.lineTo(x2, y)
             ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)'
             ctx.lineWidth = 1
             ctx.stroke()
          }

          ctx.fillStyle = 'rgba(34, 211, 238, 0.8)'
          ctx.beginPath()
          ctx.arc(x1, y, Math.sin(currentAngle) > 0 ? 3 : 1.5, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.fillStyle = 'rgba(167, 139, 250, 0.8)'
          ctx.beginPath()
          ctx.arc(x2, y, Math.sin(currentAngle + Math.PI) > 0 ? 3 : 1.5, 0, Math.PI * 2)
          ctx.fill()
        })
      } else if (simulation === 'rocket') {
        // Rocket trajectory
        ctx.fillStyle = 'rgba(15, 23, 42, 0.3)' 
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw earth
        ctx.beginPath()
        ctx.arc(cx, canvas.height + canvas.height*2, canvas.height*2.2, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)'
        ctx.stroke()
        
        // Draw orbital path
        ctx.beginPath()
        ctx.moveTo(canvas.width*0.1, canvas.height*0.9)
        ctx.quadraticCurveTo(cx, canvas.height*0.1, canvas.width*0.9, canvas.height*0.2)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([])
        
        // Rocket position
        const rocketT = (time * 0.002) % 1
        const rX = canvas.width*0.1 * Math.pow(1-rocketT, 2) + cx * 2 * (1-rocketT) * rocketT + canvas.width*0.9 * Math.pow(rocketT, 2)
        const rY = canvas.height*0.9 * Math.pow(1-rocketT, 2) + canvas.height*0.1 * 2 * (1-rocketT) * rocketT + canvas.height*0.2 * Math.pow(rocketT, 2)
        
        // Engine particles
        particles.forEach(p => {
          if (p.life <= 0) {
            p.x = rX
            p.y = rY
            p.vx = (Math.random() - 0.5) * 4
            p.vy = Math.random() * 4 + 2
            p.life = p.maxLife
          }
          p.x += p.vx * speed
          p.y += p.vy * speed
          p.life -= speed
          
          ctx.fillStyle = `rgba(251, 146, 60, ${p.life / p.maxLife})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, (p.life / p.maxLife) * 4, 0, Math.PI * 2)
          ctx.fill()
        })
        
        // Draw rocket dot
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(rX, rY, 4, 0, Math.PI*2)
        ctx.fill()
        
        // Add data overlay text simulating calculations
        ctx.fillStyle = '#22d3ee'
        ctx.font = '10px monospace'
        ctx.fillText(`ALT: ${(rocketT * 400).toFixed(1)}km`, rX + 15, rY - 15)
        ctx.fillText(`VEL: ${(rocketT * 27000).toFixed(0)}km/h`, rX + 15, rY - 5)
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [simulation, isPlaying, speed])

  return (
    <div className="w-full aspect-square md:aspect-[4/3] relative overflow-hidden bg-slate-900 rounded-xl mb-4 border border-slate-700 shadow-inner">
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
       {/* CRT Scanline Overlay */}
       <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-50"></div>
    </div>
  )
}
