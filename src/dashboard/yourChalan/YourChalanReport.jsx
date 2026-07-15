import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { formatDisplayDate } from '../utils/formatDate'
import YourChalanPreview from './YourChalanPreview'

function YourChalanReport({ yourChalans, setYourChalans }) {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(() => yourChalans[0]?.id || null)
  const [selectedPartyName, setSelectedPartyName] = useState(() => yourChalans[0]?.partyName || null)
  const [expandedPartyName, setExpandedPartyName] = useState(() => yourChalans[0]?.partyName || null)
  const [chalanToDelete, setChalanToDelete] = useState(null)

  const partyGroups = useMemo(() => {
    const grouped = yourChalans.reduce((acc, chalan) => {
      const partyName = chalan.partyName || 'Unknown party'

      if (!acc[partyName]) {
        acc[partyName] = []
      }

      acc[partyName].push(chalan)
      return acc
    }, {})

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map((partyName) => ({
        partyName,
        chalans: grouped[partyName].slice().sort((a, b) => new Date(b.chalanDate) - new Date(a.chalanDate)),
      }))
  }, [yourChalans])

  useEffect(() => {
    if (!selectedPartyName && partyGroups.length > 0) {
      setSelectedPartyName(partyGroups[0].partyName)
      setExpandedPartyName(partyGroups[0].partyName)
    }
  }, [partyGroups, selectedPartyName])

  useEffect(() => {
    if (!selectedPartyName) {
      return
    }

    const group = partyGroups.find((group) => group.partyName === selectedPartyName)

    if (!group) {
      return
    }

    if (!group.chalans.some((chalan) => chalan.id === selectedId)) {
      setSelectedId(group.chalans[0]?.id || null)
    }
  }, [partyGroups, selectedPartyName, selectedId])

  const selectedChalan = useMemo(() => {
    const byId = yourChalans.find((chalan) => chalan.id === selectedId)
    if (byId) {
      return byId
    }

    const activeGroup = partyGroups.find((group) => group.partyName === selectedPartyName)
    return activeGroup?.chalans[0] || yourChalans[0] || null
  }, [yourChalans, selectedId, partyGroups, selectedPartyName])

  const selectedPartyGroup = useMemo(
    () => partyGroups.find((group) => group.partyName === selectedPartyName) || partyGroups[0] || null,
    [partyGroups, selectedPartyName],
  )

  const handleDelete = () => {
    if (!chalanToDelete) {
      return
    }

    setYourChalans((prev) => prev.filter((chalan) => chalan.id !== chalanToDelete.id))
    setSelectedId(null)
    setChalanToDelete(null)
  }

  const handleEdit = () => {
    if (!selectedChalan) {
      return
    }

    navigate('/directory', {
      state: { openYourChalanForm: true, editYourChalanId: selectedChalan.id },
    })
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
          {partyGroups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No your chalan detail saved yet.
            </div>
          ) : (
            partyGroups.map((group) => (
              <div key={group.partyName} className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPartyName(group.partyName)
                    setSelectedId(group.chalans[0]?.id || null)
                    setExpandedPartyName((prev) => (prev === group.partyName ? null : group.partyName))
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    selectedPartyName === group.partyName
                      ? 'border-violet-200 bg-violet-50 text-violet-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-sm font-semibold">{group.partyName}</span>
                  <span className="mt-1 block text-xs">{group.chalans.length} challan{group.chalans.length > 1 ? 's' : ''}</span>
                </button>

                <AnimatePresence>
                  {expandedPartyName === group.partyName && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -8 }}
                      animate={{ height: 'auto', opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -8 }}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="space-y-2">
                        {group.chalans.map((chalan) => (
                          <button
                            key={chalan.id}
                            type="button"
                            onClick={() => setSelectedId(chalan.id)}
                            className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                              selectedChalan?.id === chalan.id
                                ? 'border-violet-200 bg-violet-50 text-violet-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-medium">Chalan No. {chalan.chalanNumber}</span>
                              <span className="text-xs text-slate-500">{formatDisplayDate(chalan.chalanDate)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Print
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <FiEdit2 size={14} />
                Edit
              </button>
              <button type="button" onClick={() => setChalanToDelete(selectedChalan)} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100">
                <FiTrash2 size={14} />
                Delete
              </button>
            </div>
          ) : null}
        </div>

        {selectedChalan ? (
          <div className="print-area">
            <YourChalanPreview chalan={selectedChalan} />
          </div>
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
