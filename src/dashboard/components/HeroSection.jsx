
// import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
// import { useLocation } from 'react-router-dom'
// import { useRef, useEffect, useState } from 'react'

// const pageTitles = {
//   '/': 'Dashboard',
//   '/orders': 'Orders',
//   '/inventory': 'Inventory',
//   '/customers': 'Customers',
//   '/reports': 'Reports',
//   '/directory': 'Directory',
//   '/settings': 'Settings',
//   '/user': 'User',
// }

// /* ── Floating particle ── */
// function Particle({ delay, x, y, size }) {
//   return (
//     <motion.span
//       className="pointer-events-none absolute rounded-full bg-violet-400"
//       style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
//       initial={{ opacity: 0, scale: 0 }}
//       animate={{
//         opacity: [0, 0.8, 0],
//         scale: [0, 1.4, 0],
//         y: [0, -40, -80],
//         x: [0, (Math.random() - 0.5) * 40],
//       }}
//       transition={{
//         duration: 2.8,
//         delay,
//         repeat: Infinity,
//         ease: 'easeOut',
//         repeatDelay: Math.random() * 3,
//       }}
//     />
//   )
// }

// /* ── Morphing orb ── */
// function Orb({ className, duration, delay }) {
//   return (
//     <motion.div
//       className={`pointer-events-none absolute rounded-full blur-3xl opacity-25 ${className}`}
//       animate={{
//         scale: [1, 1.3, 0.9, 1.2, 1],
//         x: [0, 30, -20, 10, 0],
//         y: [0, -20, 30, -10, 0],
//         borderRadius: ['50%', '60% 40% 55% 45%', '40% 60% 45% 55%', '55% 45% 60% 40%', '50%'],
//       }}
//       transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
//     />
//   )
// }

// function HeroSection({ breadcrumbItems }) {
//   const { pathname } = useLocation()
//   const currentPage = pageTitles[pathname] || 'Dashboard'
//   const isDashboard = pathname === '/'
//   const locationItems = breadcrumbItems || (isDashboard ? ['Home'] : ['Home', currentPage])

//   const sectionRef = useRef(null)
//   const mouseX = useMotionValue(0)
//   const mouseY = useMotionValue(0)
//   const springX = useSpring(mouseX, { stiffness: 80, damping: 20 })
//   const springY = useSpring(mouseY, { stiffness: 80, damping: 20 })
//   const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3])
//   const rotateY = useTransform(springX, [-0.5, 0.5], [-3, 3])

//   const handleMouseMove = (e) => {
//     const rect = sectionRef.current?.getBoundingClientRect()
//     if (!rect) return
//     mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
//     mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
//   }
//   const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0) }

//   const [displayed, setDisplayed] = useState('')
//   useEffect(() => {
//     setDisplayed('')
//     let i = 0
//     const id = setInterval(() => {
//       i++
//       setDisplayed(currentPage.slice(0, i))
//       if (i === currentPage.length) clearInterval(id)
//     }, 60)
//     return () => clearInterval(id)
//   }, [currentPage])

//   const particles = useRef(
//     Array.from({ length: 18 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: 40 + Math.random() * 50,
//       size: 2 + Math.random() * 3,
//       delay: i * 0.22,
//     }))
//   ).current

//   return (
//     <motion.section
//       ref={sectionRef}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       initial={{ opacity: 0, y: 24 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
//       className="relative overflow-hidden rounded-2xl"
//     >
//       <div className="absolute inset-0 bg-[url('https://www.weavetech.com/wp-content/uploads/2023/12/Types_of_Embroidery_Machines_and_their_Functions.jpg')] bg-cover bg-center" />
//       <div className="absolute inset-0 bg-slate-900/60" />

//       <Orb className="h-72 w-72 bg-violet-500 -left-16 -top-16" duration={9} delay={0} />
//       <Orb className="h-56 w-56 bg-violet-400 right-8 bottom-0" duration={11} delay={2} />
//       <Orb className="h-40 w-40 bg-violet-300 left-1/2 top-4" duration={7} delay={1} />

//       {particles.map((p) => (
//         <Particle key={p.id} {...p} />
//       ))}

//       <div className="relative px-5 py-14 text-center text-white sm:py-20">

//         {/* Badge */}
//         <motion.div className="mx-auto mb-5 flex w-fit items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-sm">

//           {/* Coin + Ripple Rings */}
//           <div className="relative flex items-center justify-center">

//             {/* Ring 1 */}
//             <motion.div
//               className="absolute h-10 w-10 rounded-full border border-violet-400/40"
//               animate={{ scale: [1, 2], opacity: [0.6, 0] }}
//               transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
//             />

//             {/* Ring 2 */}
//             <motion.div
//               className="absolute h-10 w-10 rounded-full border border-violet-400/30"
//               animate={{ scale: [1, 2.4], opacity: [0.4, 0] }}
//               transition={{ duration: 1.6, repeat: Infinity, delay: 0.5, ease: 'easeOut' }}
//             />

//             {/* Coin */}
//             <motion.div
//               className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-violet-400/80 bg-violet-400/10 text-sm font-bold text-violet-300"
//               animate={{
//                 rotateY: [0, 0, 90, 90, 0, 0],
//                 scale: [1, 1, 0.7, 0.7, 1, 1],
//                 opacity: [1, 1, 0.3, 0.3, 1, 1],
//               }}
//               transition={{ duration: 2, repeat: Infinity }}
//             >
//               ₹
//             </motion.div>
//           </div>

//           {/* Wavy dots */}
//           <div className="flex items-end gap-1 h-4">
//             {[0, 1, 2].map((i) => (
//               <motion.span
//                 key={i}
//                 className="h-2.5 w-2.5 rounded-full bg-violet-300"
//                 animate={{
//                   y: [0, -5, 0],
//                   opacity: [0.3, 1, 0.3],
//                 }}
//                 transition={{
//                   duration: 1,
//                   repeat: Infinity,
//                   delay: i * 0.2,
//                   ease: 'easeInOut',
//                 }}
//               />
//             ))}
//           </div>
//         </motion.div>

//         {/* Title */}
//         <h2 className="text-3xl font-bold sm:text-5xl">{displayed}</h2>

//         <div className="mt-3 flex justify-center">
//           <motion.div
//             className="h-[3px] w-24 rounded-full"
//             style={{
//               background: 'linear-gradient(90deg, transparent, #b680ff, transparent)',
//             }}
//             initial={{ width: 0, opacity: 0 }}
//             animate={{ width: '200px', opacity: 1 }}
//             transition={{ duration: 0.8, ease: 'easeOut' }}
//           />
//         </div>

//         {/* Breadcrumb */}
//         <div className="mt-4 flex justify-center gap-2 text-sm">
//           {locationItems.map((item, index) => {
//             const isLast = index === locationItems.length - 1

//             return (
//               <span
//                 key={index}
//                 className={isLast ? 'font-bold text-[#b680ff]' : ''}
//               >
//                 {index > 0 && '/'} {item}
//               </span>
//             )
//           })}
//         </div>

//       </div>
//     </motion.section>
//   )
// }

// export default HeroSection








import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'

const pageTitles = {
  '/': 'Dashboard',
  '/orders': 'Orders',
  '/inventory': 'Inventory',
  '/customers': 'Customers',
  '/reports': 'Reports',
  '/directory': 'Directory',
  '/settings': 'Settings',
  '/user': 'User',
}

/* ── Interactive Vector Mesh Background ── */
function MeshBackground({ mouseX, mouseY }) {
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 })
  
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10])

  const glowX = useTransform(springX, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(springY, [-0.5, 0.5], ['0%', '100%'])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: 1000 }}>
      <motion.div
        className="absolute inset-[-50%] opacity-[0.12] origin-center"
        style={{
          rotateX,
          rotateY,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
      {/* High-damping lag ambient glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full mix-blend-screen"
        style={{
          left: glowX,
          top: glowY,
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0) 60%)',
        }}
      />
    </div>
  )
}

/* ── Kinetic Cyber-Dust ── */
function CyberDust({ mouseX, mouseY }) {
  const dustArray = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
    }))
  ).current

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dustArray.map((p) => (
        <Particle key={p.id} {...p} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  )
}

function Particle({ x, y, size, delay, mouseX, mouseY }) {
  const xOffset = useMotionValue(0)
  const yOffset = useMotionValue(0)

  const phaseX = useRef(Math.random() * Math.PI * 2).current
  const phaseY = useRef(Math.random() * Math.PI * 2).current
  const speed = useRef(0.0005 + Math.random() * 0.0005).current

  const vx = useRef(0)
  const vy = useRef(0)
  const currOx = useRef(0)
  const currOy = useRef(0)

  useAnimationFrame((time) => {
    const driftX = Math.sin(time * speed + phaseX) * 0.3
    const driftY = Math.cos(time * speed + phaseY) * 0.3

    const mX = mouseX.get() + 0.5 
    const mY = mouseY.get() + 0.5 

    const pX = (x / 100) + (currOx.current / 1500) 
    const pY = (y / 100) + (currOy.current / 1500)
    
    const dx = pX - mX
    const dy = (pY - mY) * 1.5 

    const dist = Math.sqrt(dx * dx + dy * dy)
    
    const maxDist = 0.15
    if (dist < maxDist && dist > 0.001) {
      const force = (maxDist - dist) / maxDist
      vx.current += (dx / dist) * force * 1.2
      vy.current += (dy / dist) * force * 1.2
    }

    vx.current *= 0.88
    vy.current *= 0.88

    currOx.current += driftX + vx.current
    currOy.current += driftY + vy.current

    xOffset.set(currOx.current)
    yOffset.set(currOy.current)
  })

  return (
    <motion.div
      className="absolute rounded-full bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.9)]"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        x: xOffset,
        y: yOffset
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.1, 0.7, 0.1] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay }}
    />
  )
}

/* ── Main Hero Section ── */
export default function HeroSection({ breadcrumbItems }) {
  const { pathname } = useLocation()
  const currentPage = pageTitles[pathname] || 'Dashboard'
  const isDashboard = pathname === '/'
  const locationItems = breadcrumbItems || (isDashboard ? ['Home'] : ['Home', currentPage])

  const sectionRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  
  const handleMouseLeave = () => { 
    mouseX.set(0)
    mouseY.set(0)
  }

  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(currentPage.slice(0, i))
      if (i === currentPage.length) clearInterval(id)
    }, 60)
    return () => clearInterval(id)
  }, [currentPage])

  return (
    <motion.section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-[url('https://www.weavetech.com/wp-content/uploads/2023/12/Types_of_Embroidery_Machines_and_their_Functions.jpg')] bg-cover bg-center min-h-[480px] flex items-center justify-center p-6]"
    >
      {/* ફેરફાર ૧: ઓવરલે ને વધારે ડાર્ક (bg-black/70) કર્યો જેથી પાછળનું બેકગ્રાઉન્ડ ડાર્ક લાગે */}
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />

      <MeshBackground mouseX={mouseX} mouseY={mouseY} />
      <CyberDust mouseX={mouseX} mouseY={mouseY} />

      {/* Cinematic Glass Card Frame */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        // ફેરફાર ૨: bg-white/10 હટાવીને bg-white/5 (વધુ ટ્રાન્સપરન્ટ) અને હળવું backdrop-blur-md આપ્યું
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center rounded-3xl border border-white/[0.05] bg-white/5 p-12 backdrop-blur-md shadow-2xl"
      >
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.01)] pointer-events-none" />

        {/* Premium Floating Badge */}
        <motion.div 
          className="mx-auto mb-8 flex items-center gap-4 rounded-full border border-white/10 bg-white/5 pl-2 pr-5 py-1.5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
        >
          {/* 3D Rotating Metallic Coin */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/50 bg-gradient-to-br from-amber-200 via-yellow-500 to-amber-700 shadow-[0_0_12px_rgba(251,191,36,0.4)] overflow-hidden">
            <motion.div
              className="flex h-full w-full items-center justify-center text-[15px] font-black text-amber-950"
              animate={{ rotateY: 360 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              ₹
              {/* Continuous Reflection Shine */}
              <motion.div
                className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/80 to-transparent"
                animate={{ x: ['-100%', '80%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>

          {/* ફેરફાર ૩: ટેક્સ્ટ ફોન્ટને font-extrabold કર્યો */}
          <span className="text-xs font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
            Live Business Network
          </span>

          {/* Smooth Sinusoidal Wave */}
          <div className="flex h-3.5 items-end gap-[3px] ml-1">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-sm bg-violet-400"
                animate={{ height: ['25%', '100%', '25%'] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Cinematic Title */}
        <h2 className="text-center text-5xl font-black tracking-tight sm:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400 drop-shadow-md flex items-center justify-center h-[1.3em]">
          {displayed}
          <motion.span
            className="inline-block h-[0.75em] w-[0.1em] ml-3 bg-violet-400 align-middle shadow-[0_0_15px_rgba(139,92,246,0.8)] rounded-full"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </h2>

        {/* Separator / Accent Line */}
        <div className="mt-6 mb-8 flex justify-center w-full">
          <motion.div
            className="h-[1px] w-full max-w-[180px] rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6), transparent)',
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Breadcrumb */}
        {/* ફેરફાર ૪: અહીયાં પણ ટેક્સ્ટને font-black (વધુ બોલ્ડ) અને કલરને text-slate-100 કર્યો જેથી સ્પષ્ટ વંચાય */}
        <div className="flex justify-center gap-2 text-[13px] font-black tracking-wider uppercase">
          {locationItems.map((item, index) => {
            const isLast = index === locationItems.length - 1
            return (
              <span
                key={index}
                className={isLast ? 'text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]' : 'text-slate-100'}
              >
                {index > 0 && <span className="mx-2 text-slate-400 font-bold">/</span>} 
                {item}
              </span>
            )
          })}
        </div>
      </motion.div>
    </motion.section>
  )
}
