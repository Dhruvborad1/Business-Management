import { motion } from 'framer-motion'
import { FiShoppingCart, FiTruck, FiCheckCircle } from 'react-icons/fi'
import HeroSection from '../HeroSection'
import PagePlaceholder from '../PagePlaceholder'

const orderHighlights = [
  { label: 'Active Orders', value: '28', icon: FiShoppingCart, color: 'bg-blue-100 text-blue-700' },
  { label: 'In Transit', value: '12', icon: FiTruck, color: 'bg-violet-100 text-violet-700' },
  { label: 'Completed', value: '104', icon: FiCheckCircle, color: 'bg-emerald-100 text-emerald-700' },
]

const orderQuickActions = [
  { title: 'Review recent orders', description: 'Open the latest orders and update statuses.' },
  { title: 'Track shipment progress', description: 'See the current status of every delivery.' },
  { title: 'Prepare invoices', description: 'Generate order invoices for customers quickly.' },
]

function Orders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-6">
        <HeroSection />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="grid gap-6">
            <PagePlaceholder
              title="Orders"
              description="Manage order workflows, tracking status, and delivery readiness from one polished dashboard page."
            />

            <div className="grid gap-4 sm:grid-cols-3">
              {orderHighlights.map((item) => {
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

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Recent activity</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">Order pipeline highlights</h3>
                </div>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Live
                </span>
              </div>

              <ul className="mt-6 space-y-4">
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">New order received</p>
                  <p className="mt-1 text-sm text-slate-600">Order #4592 is ready for processing and shipping allocation.</p>
                </li>
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Shipment delayed</p>
                  <p className="mt-1 text-sm text-slate-600">One shipment is pending pickup from the warehouse.</p>
                </li>
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Delivery completed</p>
                  <p className="mt-1 text-sm text-slate-600">15 orders were successfully delivered today.</p>
                </li>
              </ul>
            </article>
          </section>

          <aside className="grid gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Quick actions</h3>
              <p className="mt-2 text-sm text-slate-500">Take fast action for your sales and shipments.</p>
              <div className="mt-5 space-y-4">
                {orderQuickActions.map((action) => (
                  <div key={action.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{action.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{action.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Shipment readiness</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">Delivery status summary</h3>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>On schedule</span>
                    <span className="font-semibold text-slate-900">78%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[78%] rounded-full bg-slate-700" />
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Pending pickup</span>
                    <span className="font-semibold text-slate-900">12</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}

export default Orders