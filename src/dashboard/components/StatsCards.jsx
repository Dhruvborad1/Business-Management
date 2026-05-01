import { motion } from 'framer-motion'

function StatsCards({ metrics }) {
  const items = [
    { title: 'Total Party', value: metrics.totalParty || 0 },
    { title: 'Total Challan', value: metrics.totalOrders },
    { title: 'Total Quantity', value: metrics.totalQuantity },
    { title: 'Type Options', value: metrics.totalTypes },
  ]

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <motion.article
          key={item.title}
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 230 }}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.title}</h3>
          <strong className="mt-1 block text-xl font-semibold text-slate-900">{item.value}</strong>
        </motion.article>
      ))}
    </section>
  )
}

export default StatsCards
