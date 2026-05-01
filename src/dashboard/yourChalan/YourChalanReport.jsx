import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiTrash2 } from 'react-icons/fi'
import { formatDisplayDate } from '../utils/formatDate'
import YourChalanPreview from './YourChalanPreview'

function YourChalanReport({ yourChalans, setYourChalans }) {
  const [selectedId, setSelectedId] = useState(() => yourChalans[0]?.id || null)
  const [chalanToDelete, setChalanToDelete] = useState(null)

  const selectedChalan = useMemo(
    () => yourChalans.find((chalan) => chalan.id === selectedId) || yourChalans[0] || null,
    [yourChalans, selectedId],
  )

  const handleDelete = () => {
    if (!chalanToDelete) {
      return
    }

    setYourChalans((prev) => prev.filter((chalan) => chalan.id !== chalanToDelete.id))
    setSelectedId(null)
    setChalanToDelete(null)
  }

  return (
    <>
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Chalan Detail</h2>
            <p className="mt-1 text-sm text-slate-500">Saved company challans are listed here.</p>
          </div>
          <strong className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900">{yourChalans.length}</strong>
        </div>

        <div className="mt-4 space-y-2">
          {yourChalans.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No your chalan detail saved yet.
            </div>
          ) : (
            yourChalans.map((chalan) => (
              <button
                key={chalan.id}
                type="button"
                onClick={() => setSelectedId(chalan.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selectedChalan?.id === chalan.id
                    ? 'border-violet-200 bg-violet-50 text-violet-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-sm font-semibold">Chalan No. {chalan.chalanNumber}</span>
                <span className="mt-1 block text-xs">{chalan.partyName} | {formatDisplayDate(chalan.chalanDate)}</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Selected Your Chalan</h3>
            <p className="mt-1 text-sm text-slate-500">Preview matches the challan format.</p>
          </div>
          {selectedChalan ? (
            <button type="button" onClick={() => setChalanToDelete(selectedChalan)} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100">
              <FiTrash2 size={14} />
              Delete
            </button>
          ) : null}
        </div>

        {selectedChalan ? (
          <YourChalanPreview chalan={selectedChalan} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
            Select a saved your chalan to view complete detail.
          </div>
        )}
      </div>
    </section>
    <AnimatePresence>
      {chalanToDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
              <FiTrash2 size={18} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Delete Your Chalan?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete chalan <strong>{chalanToDelete.chalanNumber}</strong>? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setChalanToDelete(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}

export default YourChalanReport
