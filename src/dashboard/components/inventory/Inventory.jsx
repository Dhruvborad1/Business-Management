import { motion } from 'framer-motion'
import { FiBox, FiLayers, FiBarChart2 } from 'react-icons/fi'
import HeroSection from '../HeroSection'
import PagePlaceholder from '../PagePlaceholder'

const inventoryHighlights = [
  { label: 'Products in stock', value: '1,236', icon: FiBox, color: 'bg-sky-100 text-sky-700' },
  { label: 'Low stock alerts', value: '9', icon: FiLayers, color: 'bg-amber-100 text-amber-700' },
  { label: 'Stock move today', value: '84', icon: FiBarChart2, color: 'bg-emerald-100 text-emerald-700' },
]

function Inventory() {
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
              title="Inventory"
              description="Keep stock levels under control, view product availability, and plan restocking from one attractive inventory page."
            />

            <div className="grid gap-4 sm:grid-cols-3">
              {inventoryHighlights.map((item) => {
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
              <h3 className="text-lg font-semibold text-slate-900">Inventory insights</h3>
              <p className="mt-2 text-sm text-slate-600">Quick summary of stock health and restocking priorities.</p>

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Fast-moving items</p>
                  <p className="mt-1 text-sm text-slate-600">Keep these lines replenished to avoid stockouts.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Safety stock level</p>
                  <p className="mt-1 text-sm text-slate-600">Review the products that need reorder planning.</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="grid gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Restock plan</h3>
              <p className="mt-2 text-sm text-slate-600">Fill the shelves with the most critical items first.</p>
              <ul className="mt-5 space-y-4">
                <li className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Ribbon rolls</p>
                  <p className="mt-1 text-sm text-slate-600">Only 6 units remaining. Order more this week.</p>
                </li>
                <li className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Printed cotton</p>
                  <p className="mt-1 text-sm text-slate-600">Stock levels are healthy but review monthly demand.</p>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Stock condition</h3>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Items needing inspection</p>
                  <p className="mt-2 font-semibold text-slate-900">3 shipments pending quality check</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Shelf capacity</p>
                  <p className="mt-2 font-semibold text-slate-900">72% occupied</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}

export default Inventory