import { motion } from 'framer-motion'
import { FiUsers, FiHeart, FiMessageSquare } from 'react-icons/fi'
import HeroSection from '../HeroSection'
import PagePlaceholder from '../PagePlaceholder'

const customerHighlights = [
  { label: 'Total customers', value: '462', icon: FiUsers, color: 'bg-fuchsia-100 text-fuchsia-700' },
  { label: 'Repeat visits', value: '184', icon: FiHeart, color: 'bg-rose-100 text-rose-700' },
  { label: 'Messages waiting', value: '8', icon: FiMessageSquare, color: 'bg-cyan-100 text-cyan-700' },
]

function Customers() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-6">
        <HeroSection />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <PagePlaceholder
              title="Customers"
              description="Review customer profiles, loyalty activity, and communication at a glance with this polished customer dashboard."
            />

            <div className="grid gap-4 sm:grid-cols-3">
              {customerHighlights.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${item.color}`}>
                      <Icon size={20} />
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-500">{item.label}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
                  </div>
                )
              })}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Customer spotlight</h3>
              <p className="mt-2 text-sm text-slate-600">Focus on high-value clients and priority relationships.</p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Loyalty rewards</p>
                  <p className="mt-1 text-sm text-slate-600">24 customers are eligible for loyalty incentives this month.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Recent feedback</p>
                  <p className="mt-1 text-sm text-slate-600">Customer messages are being reviewed faster than last quarter.</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="grid gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Top customers</h3>
              <ul className="mt-5 space-y-3">
                <li className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Sita Enterprises</p>
                  <p className="mt-1 text-sm text-slate-600">High-value buyer with recurring weekly orders.</p>
                </li>
                <li className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Rohit Traders</p>
                  <p className="mt-1 text-sm text-slate-600">Growing account with steady inventory demand.</p>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Engagement status</h3>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">New customer onboarding</p>
                  <p className="mt-1 text-sm text-slate-600">3 customers are in onboarding this week.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Follow-up schedule</p>
                  <p className="mt-1 text-sm text-slate-600">Complete the customer check-in for premium accounts.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}

export default Customers