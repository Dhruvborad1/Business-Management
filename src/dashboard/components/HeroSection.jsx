// import { motion } from 'framer-motion'
// import { useLocation } from 'react-router-dom'

// const pageTitles = {
//   '/': 'Dashboard',
//   '/orders': 'Orders',
//   '/inventory': 'Inventory',
//   '/customers': 'Customers',
//   '/reports': 'Reports',
//   '/settings': 'Settings',
// }

// function HeroSection({ breadcrumbItems }) {
//   const { pathname } = useLocation()
//   const currentPage = pageTitles[pathname] || 'Dashboard'
//   const isDashboard = pathname === '/'
//   const locationItems = breadcrumbItems || (isDashboard ? ['Home'] : ['Home', currentPage])

//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="relative overflow-hidden rounded-2xl"
//     >
//       <div className="absolute inset-0 bg-[url('https://www.weavetech.com/wp-content/uploads/2023/12/Types_of_Embroidery_Machines_and_their_Functions.jpg')] bg-cover bg-center" />
//       <div className="absolute inset-0 bg-slate-900/55" />
//       <div className="relative px-5 py-14 text-center text-white sm:py-20">
//         <motion.div
//           className="mx-auto mb-5 flex w-fit items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.45, ease: 'easeOut' }}
//         >
//           {[0, 1, 2].map((item) => (
//             <motion.span
//               key={item}
//               className="h-2 w-2 rounded-full bg-violet-100"
//               animate={{ y: [0, -5, 0], opacity: [0.55, 1, 0.55] }}
//               transition={{ duration: 1.15, repeat: Infinity, delay: item * 0.16, ease: 'easeInOut' }}
//             />
//           ))}
//         </motion.div>
//         <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">{currentPage}</h2>
//         <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-100 sm:text-base">
//           {locationItems.map((item, index) => (
//             <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
//               {index > 0 && <span className="text-violet-200">/</span>}
//               <span className={index === locationItems.length - 1 ? 'text-violet-100' : ''}>{item}</span>
//             </span>
//           ))}
//         </div>
//       </div>
//     </motion.section>
//   )
// }

// export default HeroSection










import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'

const pageTitles = {
  '/': 'Dashboard',
  '/orders': 'Orders',
  '/inventory': 'Inventory',
  '/customers': 'Customers',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

/* ── Floating particle ── */
function Particle({ delay, x, y, size }) {
  return (
    <motion.span
      className="pointer-events-none absolute rounded-full bg-violet-400"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1.4, 0],
        y: [0, -40, -80],
        x: [0, (Math.random() - 0.5) * 40],
      }}
      transition={{
        duration: 2.8,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
        repeatDelay: Math.random() * 3,
      }}
    />
  )
}

/* ── Morphing orb ── */
function Orb({ className, duration, delay }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl opacity-25 ${className}`}
      animate={{
        scale: [1, 1.3, 0.9, 1.2, 1],
        x: [0, 30, -20, 10, 0],
        y: [0, -20, 30, -10, 0],
        borderRadius: ['50%', '60% 40% 55% 45%', '40% 60% 45% 55%', '55% 45% 60% 40%', '50%'],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function HeroSection({ breadcrumbItems }) {
  const { pathname } = useLocation()
  const currentPage = pageTitles[pathname] || 'Dashboard'
  const isDashboard = pathname === '/'
  const locationItems = breadcrumbItems || (isDashboard ? ['Home'] : ['Home', currentPage])

  const sectionRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-3, 3])

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0) }

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

  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 40 + Math.random() * 50,
      size: 2 + Math.random() * 3,
      delay: i * 0.22,
    }))
  ).current

  return (
    <motion.section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
      className="relative overflow-hidden rounded-2xl"
    >
      <div className="absolute inset-0 bg-[url('https://www.weavetech.com/wp-content/uploads/2023/12/Types_of_Embroidery_Machines_and_their_Functions.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-slate-900/60" />

      <Orb className="h-72 w-72 bg-violet-500 -left-16 -top-16" duration={9} delay={0} />
      <Orb className="h-56 w-56 bg-violet-400 right-8 bottom-0" duration={11} delay={2} />
      <Orb className="h-40 w-40 bg-violet-300 left-1/2 top-4" duration={7} delay={1} />

      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}

      <div className="relative px-5 py-14 text-center text-white sm:py-20">

        {/* Badge */}
        <motion.div className="mx-auto mb-5 flex w-fit items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-sm">

          {/* Coin + Ripple Rings */}
          <div className="relative flex items-center justify-center">

            {/* Ring 1 */}
            <motion.div
              className="absolute h-10 w-10 rounded-full border border-violet-400/40"
              animate={{ scale: [1, 2], opacity: [0.6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />

            {/* Ring 2 */}
            <motion.div
              className="absolute h-10 w-10 rounded-full border border-violet-400/30"
              animate={{ scale: [1, 2.4], opacity: [0.4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: 0.5, ease: 'easeOut' }}
            />

            {/* Coin */}
            <motion.div
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-violet-400/80 bg-violet-400/10 text-sm font-bold text-violet-300"
              animate={{
                rotateY: [0, 0, 90, 90, 0, 0],
                scale: [1, 1, 0.7, 0.7, 1, 1],
                opacity: [1, 1, 0.3, 0.3, 1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ₹
            </motion.div>
          </div>

          {/* Wavy dots */}
          <div className="flex items-end gap-1 h-4">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2.5 w-2.5 rounded-full bg-violet-300"
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <h2 className="text-3xl font-bold sm:text-5xl">{displayed}</h2>

        <div className="mt-3 flex justify-center">
  <motion.div
    className="h-[3px] w-24 rounded-full"
    style={{
      background: 'linear-gradient(90deg, transparent, #b680ff, transparent)',
    }}
    initial={{ width: 0, opacity: 0 }}
    animate={{ width: '200px', opacity: 1 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
  />
</div>

        {/* Breadcrumb */}
        <div className="mt-4 flex justify-center gap-2 text-sm">
          {locationItems.map((item, index) => {
            const isLast = index === locationItems.length - 1

            return (
              <span
                key={index}
                className={isLast ? 'font-bold text-[#b680ff]' : ''}
              >
                {index > 0 && '/'} {item}
              </span>
            )
          })}
        </div>

      </div>
    </motion.section>
  )
}

export default HeroSection




