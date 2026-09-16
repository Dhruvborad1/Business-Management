import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function AnalyticsCharts({ monthlyData }) {
  const [activeMetric, setActiveMetric] = useState('both')

  const isChallansActive =
    activeMetric === 'both' || activeMetric === 'challans'

  const isQuantityActive =
    activeMetric === 'both' || activeMetric === 'quantity'

  const selectMetric = (metric) => {
    setActiveMetric((current) =>
      current === metric ? 'both' : metric
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
    >
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            Challan & Quantity Trend
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Monthly business activity overview
          </p>
        </div>

        {/* Metric Switch */}
        <div className="flex w-fit items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
          {/* Challans */}
          <button
            type="button"
            onClick={() => selectMetric('challans')}
            className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
              isChallansActive
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full transition-all ${
                isChallansActive
                  ? 'bg-blue-600 shadow-[0_0_0_3px_rgba(37,99,235,0.10)]'
                  : 'bg-slate-300'
              }`}
            />

            Challans
          </button>

          {/* Quantity */}
          <button
            type="button"
            onClick={() => selectMetric('quantity')}
            className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
              isQuantityActive
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full transition-all ${
                isQuantityActive
                  ? 'bg-teal-600 shadow-[0_0_0_3px_rgba(15,118,110,0.10)]'
                  : 'bg-slate-300'
              }`}
            />

            Quantity
          </button>
        </div>
      </div>

      {/* ================= CHART ================= */}
      <div className="h-[340px] w-full px-2 pt-3 sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyData}
            margin={{
              top: 10,
              right: 12,
              left: 0,
              bottom: 30,
            }}
          >
            {/* Gradients */}
            <defs>
              <linearGradient
                id="challanGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#2563eb"
                  stopOpacity={0.20}
                />

                <stop
                  offset="75%"
                  stopColor="#2563eb"
                  stopOpacity={0.05}
                />

                <stop
                  offset="100%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="quantityGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#0f766e"
                  stopOpacity={0.18}
                />

                <stop
                  offset="75%"
                  stopColor="#0f766e"
                  stopOpacity={0.04}
                />

                <stop
                  offset="100%"
                  stopColor="#0f766e"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid
              stroke="#e2e8f0"
              strokeDasharray="3 5"
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#64748b',
                fontSize: 11,
              }}
              dy={8}
            />

            {/* Challans Scale */}
            {isChallansActive && (
              <YAxis
                yAxisId="challans"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#2563eb',
                  fontSize: 11,
                }}
                width={38}
              />
            )}

            {/* Quantity Scale */}
            {isQuantityActive && (
              <YAxis
                yAxisId="quantity"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#0f766e',
                  fontSize: 11,
                }}
                width={45}
              />
            )}

            {/* Tooltip */}
            <Tooltip
              cursor={{
                stroke: '#94a3b8',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
              contentStyle={{
                background: 'rgba(255,255,255,0.97)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '10px 13px',
                boxShadow: '0 12px 30px rgba(15,23,42,0.10)',
              }}
              labelStyle={{
                color: '#0f172a',
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 5,
              }}
            />

            {/* Challans */}
            {isChallansActive && (
              <Area
                yAxisId="challans"
                type="monotone"
                dataKey="challans"
                name="Challans"
                stroke="#2563eb"
                strokeWidth={3}
                fill="url(#challanGradient)"
                activeDot={{
                  r: 6,
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
                animationDuration={700}
                animationEasing="ease-out"
                connectNulls
              />
            )}

            {/* Quantity */}
            {isQuantityActive && (
              <Area
                yAxisId="quantity"
                type="monotone"
                dataKey="quantity"
                name="Quantity"
                stroke="#0f766e"
                strokeWidth={3}
                fill="url(#quantityGradient)"
                activeDot={{
                  r: 6,
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
                animationDuration={850}
                animationEasing="ease-out"
                connectNulls
              />
            )}

            {/* Interactive Range / Zoom */}
            {monthlyData?.length > 1 && (
              <Brush
                dataKey="month"
                height={26}
                travellerWidth={9}
                stroke="#cbd5e1"
                fill="#f8fafc"
                startIndex={0}
                endIndex={monthlyData.length - 1}
                tickFormatter={() => ''}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  )
}

export default AnalyticsCharts
