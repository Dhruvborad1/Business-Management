import { motion } from 'framer-motion'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function AnalyticsCharts({ monthlyData }) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
    >
      <h2 className="text-lg font-semibold text-slate-900">Challan & Quantity Trend</h2>
      <div className="mt-3 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d8dbe5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="challans"
              stroke="#2563eb"
              strokeWidth={4}
              dot={{ r: 4, fill: '#1d4ed8' }}
              activeDot={{ r: 6 }}
              name="Challans"
            />
            <Line
              type="monotone"
              dataKey="quantity"
              stroke="#0f766e"
              strokeWidth={4}
              dot={{ r: 4, fill: '#0f766e' }}
              activeDot={{ r: 6 }}
              name="Quantity"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  )
}

export default AnalyticsCharts
