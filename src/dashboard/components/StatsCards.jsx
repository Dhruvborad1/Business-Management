// import { motion } from 'framer-motion'

// function StatsCards({ metrics }) {
//   const items = [
//     { title: 'Total Party', value: metrics.totalParty || 0 },
//     { title: 'Total Challan', value: metrics.totalOrders },
//     { title: 'Total Quantity', value: metrics.totalQuantity },
//     { title: 'Type Options', value: metrics.totalTypes },
//   ]

//   return (
//     <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
//       {items.map((item) => (
//         <motion.article
//           key={item.title}
//           whileHover={{ y: -4 }}
//           transition={{ type: 'spring', stiffness: 230 }}
//           className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
//         >
//           <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.title}</h3>
//           <strong className="mt-1 block text-xl font-semibold text-slate-900">{item.value}</strong>
//         </motion.article>
//       ))}
//     </section>
//   )
// }

// export default StatsCards
import { motion } from 'framer-motion'
import { FiFileText, FiLayers, FiTag, FiUsers } from 'react-icons/fi'

function StatsCards({ metrics }) {
  const items = [
    { title: 'Total Party', value: metrics?.totalParty || 0, icon: FiUsers, accent: 'bg-blue-50 text-blue-600' },
    { title: 'Total Challan', value: metrics?.totalOrders || 0, icon: FiFileText, accent: 'bg-violet-50 text-violet-600' },
    { title: 'Total Quantity', value: metrics?.totalQuantity || 0, icon: FiLayers, accent: 'bg-emerald-50 text-emerald-600' },
    { title: 'Type Options', value: metrics?.totalTypes || 0, icon: FiTag, accent: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <motion.article
            key={item.title}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 230 }}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              {/* Left Side */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {item.title}
                </h3>

                <strong className="mt-2 block text-2xl font-semibold text-slate-900">
                  {item.value}
                </strong>
              </div>

              {/* Right Side Icon */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.accent}`}
              >
                <Icon className="h-7 w-7" />
              </div>
            </div>
          </motion.article>
        )
      })}
    </section>
  )
}

export default StatsCards