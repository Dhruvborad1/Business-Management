import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiSettings, FiChevronDown } from 'react-icons/fi'

const pageLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Orders', to: '/orders' },
  { label: 'Inventory', to: '/inventory' },
  { label: 'Customers', to: '/customers' },
]

function DashboardHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isReportsOpen, setIsReportsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const reportsDropdownRef = useRef(null)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)
  const toggleReportsDropdown = () => setIsReportsOpen(!isReportsOpen)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!isReportsOpen) {
      return
    }

    const handlePointerDown = (event) => {
      if (reportsDropdownRef.current?.contains(event.target)) {
        return
      }

      setIsReportsOpen(false)
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsReportsOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isReportsOpen])

  const openReportView = (reportView) => {
    navigate('/reports', { state: { reportView } })
    closeSidebar()
    setIsReportsOpen(false)
  }

  return (
    <motion.header className="sticky top-0 z-50 w-full shadow-2xl" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
      <div className={`border-b border-slate-200 px-4 py-2 text-xs text-slate-600 transition-all duration-300 ${
        isScrolled ? 'bg-slate-100/75 backdrop-blur-md' : 'bg-slate-100'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>+91 98765 43210 | info@riyafashion.com</span>
          <span>Mon - Fri: 09 AM - 09 PM</span>
        </div>
      </div>

      <div className={`border-b border-slate-200 px-4 py-4 transition-all duration-300 md:px-5 ${
        isScrolled ? 'bg-white/80 shadow-md backdrop-blur-md' : 'bg-white shadow-sm'
      }`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Riya Fashion</h1>
            <button
              onClick={toggleSidebar}
              className="rounded-lg bg-slate-100 p-2 text-slate-700 transition hover:bg-violet-100 hover:text-violet-700 lg:hidden"
              aria-label="Toggle menu"
            >
              <FiMenu size={24} />
            </button>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <nav className="flex flex-wrap justify-end gap-2">
              {pageLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-violet-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-violet-100 hover:text-violet-700'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Reports Dropdown */}
            <div ref={reportsDropdownRef} className="relative">
              <button
                onClick={toggleReportsDropdown}
                className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
              >
                Reports
                <FiChevronDown size={16} className={`transition-transform ${isReportsOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isReportsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                  >
                    <button
                      onClick={() => openReportView('party')}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-violet-100 hover:text-violet-700"
                    >
                      Party Details
                    </button>
                    <button
                      onClick={() => openReportView('challan')}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-violet-100 hover:text-violet-700"
                    >
                      Challan Details
                    </button>
                    <button
                      onClick={() => openReportView('your-chalan')}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-violet-100 hover:text-violet-700"
                    >
                      Your Chalan Detail
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings Icon Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="settings-icon-btn"
              aria-label="Settings"
              onClick={() => window.location.href = '/settings'}
            >
              <FiSettings size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Menu */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-xl lg:hidden"
          >
            <div className="flex flex-col p-4">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Menu</h2>
                <button
                  onClick={closeSidebar}
                  className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <FiX size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {pageLinks.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={item.to}
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 text-base font-medium transition ${
                          isActive
                            ? 'bg-violet-600 text-white shadow'
                            : 'bg-slate-100 text-slate-700 hover:bg-violet-100 hover:text-violet-700'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}

                {/* Reports Dropdown in Sidebar */}
                <motion.div
                  ref={reportsDropdownRef}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: pageLinks.length * 0.1 }}
                >
                  <button
                    onClick={toggleReportsDropdown}
                    className="flex w-full items-center justify-between rounded-lg bg-slate-100 px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
                  >
                    <span className="flex items-center gap-2">Reports</span>
                    <FiChevronDown size={18} className={`transition-transform ${isReportsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isReportsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="ml-2 mt-1 overflow-hidden"
                    >
                      <button
                        onClick={() => openReportView('party')}
                        className="mt-1 block w-full rounded-lg bg-slate-50 px-4 py-2 text-left text-sm text-slate-700 hover:bg-violet-100 hover:text-violet-700"
                      >
                        Party Details
                      </button>
                      <button
                        onClick={() => openReportView('challan')}
                        className="mt-1 block w-full rounded-lg bg-slate-50 px-4 py-2 text-left text-sm text-slate-700 hover:bg-violet-100 hover:text-violet-700"
                      >
                        Challan Details
                      </button>
                      <button
                        onClick={() => openReportView('your-chalan')}
                        className="mt-1 block w-full rounded-lg bg-slate-50 px-4 py-2 text-left text-sm text-slate-700 hover:bg-violet-100 hover:text-violet-700"
                      >
                        Your Chalan Detail
                      </button>
                    </motion.div>
                  )}
                </motion.div>

                {/* Settings Button in Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (pageLinks.length + 1) * 0.1 }}
                >
                  <NavLink
                    to="/settings"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium transition ${
                        isActive
                          ? 'bg-violet-600 text-white shadow'
                          : 'bg-slate-100 text-slate-700 hover:bg-violet-100 hover:text-violet-700'
                      }`
                    }
                  >
                    <FiSettings size={18} />
                    Settings
                  </NavLink>
                </motion.div>
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default DashboardHeader
