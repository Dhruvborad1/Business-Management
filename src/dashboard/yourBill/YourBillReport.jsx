import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { FiEdit2, FiTrash2, FiSearch, FiChevronDown, FiChevronRight, FiChevronUp, FiFileText } from 'react-icons/fi'
import { formatDisplayDate } from '../utils/formatDate'
import YourBillPreview from './YourBillPreview'

function YourBillReport({ billHistory = [], setBillHistory }) {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(() => billHistory[0]?.id || null)
  const [selectedPartyName, setSelectedPartyName] = useState(() => billHistory[0]?.partyName || null)
  const [expandedPartyName, setExpandedPartyName] = useState(() => billHistory[0]?.partyName || null)
  const [billToDelete, setBillToDelete] = useState(null)

  const [zoomLevel, setZoomLevel] = useState(1)
  const previewContainerRef = useRef(null)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const dragControls = useDragControls()

  const customScrollbarClass = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-violet-500 [&::-webkit-scrollbar-track]:bg-transparent [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]"

  useEffect(() => {
    const handleAutoFitScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth - 24
        const standardBillWidth = 980

        if (containerWidth < standardBillWidth) {
          const calculatedScale = Number((containerWidth / standardBillWidth).toFixed(2))
          setZoomLevel(Math.max(calculatedScale, 0.35))
        } else {
          setZoomLevel(1)
        }
      }
    }

    handleAutoFitScale()
    window.addEventListener('resize', handleAutoFitScale)
    return () => window.removeEventListener('resize', handleAutoFitScale)
  }, [selectedId])

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2.0))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.2))
  }

  const partyGroups = useMemo(() => {
    const grouped = billHistory.reduce((acc, bill) => {
      const partyName = bill.partyName || 'Unknown Party'

      if (!acc[partyName]) {
        acc[partyName] = []
      }

      acc[partyName].push(bill)
      return acc
    }, {})

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map((partyName) => ({
        partyName,
        bills: grouped[partyName].slice().sort((a, b) => new Date(b.billDate || b.createdAt) - new Date(a.billDate || a.createdAt)),
      }))
  }, [billHistory])

  const filteredPartyGroups = useMemo(() => {
    if (!searchQuery.trim()) return partyGroups

    const query = searchQuery.toLowerCase()
    return partyGroups
      .map((group) => {
        const matchesParty = group.partyName.toLowerCase().includes(query)
        const matchingBills = group.bills.filter(
          (bill) =>
            bill.billNumber?.toString().toLowerCase().includes(query) ||
            group.partyName.toLowerCase().includes(query),
        )

        if (matchesParty || matchingBills.length > 0) {
          return {
            ...group,
            bills: matchesParty ? group.bills : matchingBills,
          }
        }
        return null
      })
      .filter(Boolean)
  }, [partyGroups, searchQuery])

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

    if (!group.bills.some((bill) => bill.id === selectedId)) {
      setSelectedId(group.bills[0]?.id || null)
    }
  }, [partyGroups, selectedPartyName, selectedId])

  const selectedBill = useMemo(() => {
    const byId = billHistory.find((bill) => bill.id === selectedId)
    if (byId) {
      return byId
    }

    const activeGroup = partyGroups.find((group) => group.partyName === selectedPartyName)
    return activeGroup?.bills[0] || billHistory[0] || null
  }, [billHistory, selectedId, partyGroups, selectedPartyName])

  const handleDelete = () => {
    if (!billToDelete) {
      return
    }

    setBillHistory?.((prev) => prev.filter((bill) => bill.id !== billToDelete.id))
    setSelectedId(null)
    setBillToDelete(null)
  }

  const handleEdit = () => {
    if (!selectedBill) {
      return
    }

    navigate('/directory', {
      state: { openYourBillForm: true },
    })
  }

  const handleSelectBillMobile = (bill, partyName) => {
    setSelectedPartyName(partyName)
    setSelectedId(bill.id)
    setIsDrawerOpen(false)
  }

  const renderPartyList = (isDrawer = false) => {
    const groups = isDrawer ? filteredPartyGroups : partyGroups

    if (groups.length === 0) {
      return (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          No bill history saved yet.
        </div>
      )
    }

    return groups.map((group) => (
      <div key={group.partyName} className="space-y-2">
        <button
          type="button"
          onClick={() => {
            setSelectedPartyName(group.partyName)
            setSelectedId(group.bills[0]?.id || null)
            setExpandedPartyName((prev) => (prev === group.partyName ? null : group.partyName))
          }}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${selectedPartyName === group.partyName
            ? 'border-violet-200 bg-violet-50 text-violet-900'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
        >
          <div>
            <span className="block text-sm font-semibold">{group.partyName}</span>
            <span className="mt-1 block text-xs">
              {group.bills.length} bill{group.bills.length > 1 ? 's' : ''}
            </span>
          </div>
          {expandedPartyName === group.partyName ? (
            <FiChevronDown className="text-slate-400" size={18} />
          ) : (
            <FiChevronRight className="text-slate-400" size={18} />
          )}
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
                {group.bills.map((bill) => (
                  <button
                    key={bill.id}
                    type="button"
                    onClick={() =>
                      isDrawer
                        ? handleSelectBillMobile(bill, group.partyName)
                        : setSelectedId(bill.id)
                    }
                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${selectedBill?.id === bill.id
                      ? 'border-violet-200 bg-violet-50 text-violet-900 font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">Bill No. {bill.billNumber || '—'}</span>
                      <span className="text-xs text-slate-500">
                        {formatDisplayDate(bill.billDate || bill.createdAt)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ))
  }

  return (
    <>
      <section className="relative grid grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)] print:block">
        <div className="hidden xl:flex h-[calc(100vh-4rem)] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Bill History</h2>
              <p className="mt-1 text-sm text-slate-500">Saved bills are grouped by party for quick browsing.</p>
            </div>
            <strong className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900">
              {billHistory.length}
            </strong>
          </div>

          <div className={`mt-4 flex-1 space-y-2 overflow-y-auto pr-1 ${customScrollbarClass}`}>
            {renderPartyList(false)}
          </div>
        </div>

        <div className="flex h-[calc(100vh-4rem)] flex-col rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 shadow-sm print:h-auto print:p-0 print:border-none print:shadow-none print:bg-transparent">
          <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 print:hidden">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">Selected Bill</h3>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">Preview of the saved bill details.</p>
            </div>
            {selectedBill ? (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-700 shadow-xs transition hover:bg-slate-100 active:scale-95"
                    title="Zoom Out"
                  >
                    -
                  </button>
                  <span className="px-1 text-xs font-medium text-slate-600 min-w-[2.5rem] sm:min-w-[3rem] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white text-base font-bold text-slate-700 shadow-xs transition hover:bg-slate-100 active:scale-95"
                    title="Zoom In"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Print
                </button>

                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <FiEdit2 size={13} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setBillToDelete(selectedBill)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                >
                  <FiTrash2 size={13} />
                  Delete
                </button>
              </div>
            ) : null}
          </div>

          <div
            ref={previewContainerRef}
            className={`flex-1 overflow-auto p-2 sm:p-4 bg-slate-50/50 rounded-xl border border-slate-100 print:p-0 print:border-none print:bg-transparent print:overflow-visible ${customScrollbarClass}`}
          >
            {selectedBill ? (
              <div className="print-area min-h-full min-w-full w-max flex justify-center items-start">
                <div
                  className="transition-transform duration-150 origin-top-left sm:origin-top w-fit mx-auto"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    marginBottom: zoomLevel < 1 ? `-${(1 - zoomLevel) * 100}%` : '0px',
                  }}
                >
                  <YourBillPreview bill={selectedBill.rawBill || selectedBill} />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
                Select a saved bill to view complete detail.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 xl:hidden pointer-events-none print:hidden">
        <AnimatePresence>
          {!isDrawerOpen && (
            <motion.button
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDrawerOpen(true)}
              className="pointer-events-auto flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/90 py-2.5 pl-4 pr-5 text-slate-800 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all hover:bg-white hover:shadow-lg"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                <FiFileText size={16} />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">Bill History</span>
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-800">
                  {billHistory.length}
                </span>
              </div>

              <div className="ml-1 flex items-center gap-1 border-l border-slate-200/80 pl-3 text-violet-600">
                <span className="text-xs font-medium text-slate-500">Swipe</span>
                <FiChevronUp size={18} className="animate-bounce" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs xl:hidden"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 300) {
                  setIsDrawerOpen(false)
                }
              }}
              className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[28px] border-t border-slate-200 bg-white/95 shadow-2xl backdrop-blur-md xl:hidden h-[80vh] md:h-[65vh]"
            >
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-3 pb-2"
              >
                <div className="h-1.5 w-12 rounded-full bg-slate-300" />
              </div>

              <div className="px-5 pb-3">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <FiFileText className="text-violet-600" size={18} />
                    <h3 className="text-base font-semibold text-slate-900">Bill History</h3>
                    <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-800">
                      {billHistory.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                  >
                    Close
                  </button>
                </div>

                <div className="relative mt-2">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search party or bill..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-violet-300 focus:bg-white"
                  />
                </div>
              </div>

              <div className={`flex-1 overflow-y-auto px-5 pb-8 space-y-2 ${customScrollbarClass}`}>
                {renderPartyList(true)}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {billToDelete && (
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
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Delete Bill?</h3>
              <p className="mt-2 text-sm text-slate-600">
                Are you sure you want to delete bill <strong>{billToDelete.billNumber || 'this bill'}</strong>? This action cannot be undone.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBillToDelete(null)}
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

export default YourBillReport
