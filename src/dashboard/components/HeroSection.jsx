import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Dashboard',
  '/orders': 'Orders',
  '/inventory': 'Inventory',
  '/customers': 'Customers',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

function HeroSection({ breadcrumbItems }) {
  const { pathname } = useLocation()
  const currentPage = pageTitles[pathname] || 'Dashboard'
  const isDashboard = pathname === '/'
  const locationItems = breadcrumbItems || (isDashboard ? ['Home'] : ['Home', currentPage])

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl"
    >
      <div className="absolute inset-0 bg-[url('https://www.weavetech.com/wp-content/uploads/2023/12/Types_of_Embroidery_Machines_and_their_Functions.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-slate-900/55" />
      <div className="relative px-5 py-14 text-center text-white sm:py-20">
        <motion.div
          className="mx-auto mb-5 flex w-fit items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {[0, 1, 2].map((item) => (
            <motion.span
              key={item}
              className="h-2 w-2 rounded-full bg-violet-100"
              animate={{ y: [0, -5, 0], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 1.15, repeat: Infinity, delay: item * 0.16, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">{currentPage}</h2>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-100 sm:text-base">
          {locationItems.map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 && <span className="text-violet-200">/</span>}
              <span className={index === locationItems.length - 1 ? 'text-violet-100' : ''}>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default HeroSection
