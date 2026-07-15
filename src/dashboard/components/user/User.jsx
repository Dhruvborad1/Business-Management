import { motion } from 'framer-motion'
import { FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'
import HeroSection from '../HeroSection'

const profileItems = [
  { icon: FiUser, label: 'Name', value: 'Riya Fashion Admin' },
  { icon: FiPhone, label: 'Mobile', value: '+91 98765 43210' },
  { icon: FiMail, label: 'Email', value: 'info@riyafashion.com' },
  { icon: FiMapPin, label: 'Location', value: 'Surat, Gujarat' },
]

function User() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-4">
        <HeroSection />

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">User Profile</h2>
              <p className="mt-1 text-sm text-slate-500">Account and contact details for this business workspace.</p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              Active
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {profileItems.map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-violet-700 shadow-sm">
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">{item.label}</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{item.value}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </motion.div>
  )
}

export default User
