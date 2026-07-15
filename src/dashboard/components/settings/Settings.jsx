import { motion } from 'framer-motion'
import { FiBell, FiDatabase, FiLock, FiSliders } from 'react-icons/fi'
import HeroSection from '../HeroSection'

const settingSections = [
  {
    icon: FiSliders,
    title: 'Business Preferences',
    description: 'Manage default business options, quantity behavior, and dashboard display preferences.',
  },
  {
    icon: FiBell,
    title: 'Notifications',
    description: 'Control reminders for challans, reports, inventory updates, and daily activity.',
  },
  {
    icon: FiLock,
    title: 'Security',
    description: 'Review access, account protection, and sensitive business data controls.',
  },
  {
    icon: FiDatabase,
    title: 'Data Management',
    description: 'Prepare exports, backups, and cleanup options for saved business records.',
  },
]

function Settings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-4">
        <HeroSection />

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {settingSections.map((item) => {
            const Icon = item.icon

            return (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </div>
    </motion.div>
  )
}

export default Settings
