import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import HeroSection from './HeroSection'
import PartyList from '../settings/PartyList'
import { formatDisplayDate } from '../utils/formatDate'
import YourChalanReport from '../yourChalan/YourChalanReport'

const reportTabs = [
  { id: 'party', label: 'Party Details' },
  { id: 'challan', label: 'Challan Details' },
  { id: 'your-chalan', label: 'Your Chalan Detail' },
]

const createEditableChallan = (challan) => ({
  challanNumber: challan.challanNumber || '',
  quantityType: challan.quantityType || '',
  totalQuantity: challan.totalQuantity || '',
  challanDate: challan.challanDate || '',
})

function Reports({ parties, setParties, challans, setChallans, yourChalans, setYourChalans }) {
  const location = useLocation()
  const navigate = useNavigate()
  const initialTab = reportTabs.some((tab) => tab.id === location.state?.reportView) ? location.state.reportView : 'party'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedChallanId, setSelectedChallanId] = useState(() => challans[0]?.id || null)
  const [isEditingChallan, setIsEditingChallan] = useState(false)
  const [editingChallanForm, setEditingChallanForm] = useState(null)
  const [challanToDelete, setChallanToDelete] = useState(null)
  const [selectedFilterPartyId, setSelectedFilterPartyId] = useState('all')
  const [isPartyFilterOpen, setIsPartyFilterOpen] = useState(false)
  const [partyFilterSearch, setPartyFilterSearch] = useState('')

  useEffect(() => {
    if (reportTabs.some((tab) => tab.id === location.state?.reportView)) {
      setActiveTab(location.state.reportView)
    }
  }, [location.state])

  const filteredPartyOptions = useMemo(() => {
    const normalizedSearch = partyFilterSearch.trim().toLowerCase()

    if (!normalizedSearch) {
      return parties
    }

    return parties.filter((party) => party.partyName.toLowerCase().includes(normalizedSearch))
  }, [parties, partyFilterSearch])

  const filteredChallans = useMemo(() => {
    if (selectedFilterPartyId === 'all') {
      return challans
    }

    return challans.filter((challan) => challan.partyId === selectedFilterPartyId)
  }, [challans, selectedFilterPartyId])

  const selectedFilterParty = useMemo(() => {
    if (selectedFilterPartyId === 'all') {
      return null
    }

    return parties.find((party) => party.id === selectedFilterPartyId) || null
  }, [parties, selectedFilterPartyId])

  useEffect(() => {
    if (filteredChallans.length === 0) {
      setSelectedChallanId(null)
      return
    }

    const exists = filteredChallans.some((challan) => challan.id === selectedChallanId)

    if (!exists) {
      setSelectedChallanId(filteredChallans[0].id)
    }
  }, [filteredChallans, selectedChallanId])

  const selectedChallan = useMemo(
    () => challans.find((challan) => challan.id === selectedChallanId) || null,
    [challans, selectedChallanId],
  )

  const selectedParty = useMemo(() => {
    if (!selectedChallan) {
      return null
    }

    return parties.find((party) => party.id === selectedChallan.partyId) || selectedChallan.selectedParty || null
  }, [parties, selectedChallan])

  useEffect(() => {
    if (!isPartyFilterOpen) {
      return
    }

    const handlePointerDown = (event) => {
      const target = event.target

      if (target.closest('[data-party-filter-root]')) {
        return
      }

      setIsPartyFilterOpen(false)
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsPartyFilterOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isPartyFilterOpen])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    navigate('/reports', { replace: true, state: { reportView: tabId } })
  }

  const activeReportLabel = reportTabs.find((tab) => tab.id === activeTab)?.label || 'Party Details'

  const handleEditStart = () => {
    if (!selectedChallan) {
      return
    }

    setEditingChallanForm(createEditableChallan(selectedChallan))
    setIsEditingChallan(true)
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target
    setEditingChallanForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSave = () => {
    if (!selectedChallan || !editingChallanForm) {
      return
    }

    setChallans((prev) =>
      prev.map((challan) =>
        challan.id === selectedChallan.id
          ? {
              ...challan,
              ...editingChallanForm,
              totalQuantity: Number(editingChallanForm.totalQuantity),
            }
          : challan,
      ),
    )
    setIsEditingChallan(false)
    setEditingChallanForm(null)
  }

  const handleDeleteConfirm = () => {
    if (!challanToDelete) {
      return
    }

    setChallans((prev) => prev.filter((challan) => challan.id !== challanToDelete.id))
    setChallanToDelete(null)
    setIsEditingChallan(false)
    setEditingChallanForm(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-4">
        <HeroSection breadcrumbItems={['Home', 'Reports', activeReportLabel]} />

        <AnimatePresence mode="wait">
          {activeTab === 'party' ? (
            <motion.div
              key="party-details"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <PartyList parties={parties} setParties={setParties} />
            </motion.div>
          ) : activeTab === 'your-chalan' ? (
            <motion.div
              key="your-chalan-details"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <YourChalanReport yourChalans={yourChalans} setYourChalans={setYourChalans} />
            </motion.div>
          ) : (
            <motion.section
              key="challan-details"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]"
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Challan Details</h2>
                    <p className="mt-1 text-sm text-slate-500">Click any challan row to view complete details.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
                    <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">Total Challans</span>
                    <strong className="text-base text-slate-900">{filteredChallans.length}</strong>
                  </div>
                </div>

                <div className="mt-4" data-party-filter-root>
                  <div className="relative max-w-sm">
                    <button
                      type="button"
                      onClick={() => setIsPartyFilterOpen((prev) => !prev)}
                      className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 text-left text-sm text-slate-700 transition hover:border-violet-300"
                    >
                      <span>{selectedFilterParty ? selectedFilterParty.partyName : 'All Parties'}</span>
                      <span className="text-lg leading-none text-slate-400">&#9662;</span>
                    </button>

                    {isPartyFilterOpen && (
                      <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
                        <input
                          type="search"
                          value={partyFilterSearch}
                          onChange={(event) => setPartyFilterSearch(event.target.value)}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                          placeholder="Search party name"
                        />

                        <div className="mt-3 max-h-60 overflow-y-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFilterPartyId('all')
                              setPartyFilterSearch('')
                              setIsPartyFilterOpen(false)
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition ${
                              selectedFilterPartyId === 'all'
                                ? 'bg-violet-50 text-violet-700'
                                : 'text-slate-700 hover:bg-violet-50'
                            }`}
                          >
                            <span>All Parties</span>
                          </button>

                          {filteredPartyOptions.length === 0 ? (
                            <div className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500">
                              No matching party found.
                            </div>
                          ) : (
                            filteredPartyOptions.map((party) => (
                              <button
                                key={party.id}
                                type="button"
                                onClick={() => {
                                  setSelectedFilterPartyId(party.id)
                                  setPartyFilterSearch('')
                                  setIsPartyFilterOpen(false)
                                }}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition ${
                                  selectedFilterPartyId === party.id
                                    ? 'bg-violet-50 text-violet-700'
                                    : 'text-slate-700 hover:bg-violet-50'
                                }`}
                              >
                                <span>{party.partyName}</span>
                                <span className="text-xs text-slate-400">{party.city}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Challan No.</th>
                        <th className="px-4 py-3 font-semibold">Party</th>
                        <th className="px-4 py-3 font-semibold">Type</th>
                        <th className="px-4 py-3 font-semibold">Qty</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredChallans.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                            No challan details available for this party.
                          </td>
                        </tr>
                      ) : (
                        filteredChallans.map((challan) => (
                          <tr
                            key={challan.id}
                            onClick={() => setSelectedChallanId(challan.id)}
                            className={`cursor-pointer border-t border-slate-200 transition ${
                              selectedChallanId === challan.id
                                ? 'bg-violet-50 text-violet-900'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <td className="px-4 py-3 font-medium">{challan.challanNumber}</td>
                            <td className="px-4 py-3">{challan.partyName}</td>
                            <td className="px-4 py-3">{challan.quantityType}</td>
                            <td className="px-4 py-3">{challan.totalQuantity}</td>
                            <td className="px-4 py-3">{formatDisplayDate(challan.challanDate)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">Selected Challan</h3>
                  {selectedChallan ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleEditStart}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <FiEdit2 size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setChallanToDelete(selectedChallan)}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
                {!selectedChallan ? (
                  <p className="mt-4 text-sm text-slate-500">Select a challan to see all its details here.</p>
                ) : isEditingChallan && editingChallanForm ? (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Challan Number</p>
                        <input
                          name="challanNumber"
                          value={editingChallanForm.challanNumber}
                          onChange={handleEditChange}
                          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        />
                      </label>
                      <label className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Quantity Type</p>
                        <input
                          name="quantityType"
                          value={editingChallanForm.quantityType}
                          onChange={handleEditChange}
                          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        />
                      </label>
                      <label className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total Quantity</p>
                        <input
                          name="totalQuantity"
                          type="number"
                          min="1"
                          value={editingChallanForm.totalQuantity}
                          onChange={handleEditChange}
                          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        />
                      </label>
                      <label className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Challan Date</p>
                        <input
                          name="challanDate"
                          type="date"
                          value={editingChallanForm.challanDate}
                          onChange={handleEditChange}
                          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        />
                      </label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingChallan(false)
                          setEditingChallanForm(null)
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleEditSave}
                        className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-violet-500">Challan Number</p>
                      <h4 className="mt-1 text-xl font-semibold text-slate-900">{selectedChallan.challanNumber}</h4>
                      <p className="mt-2 text-sm text-slate-600">
                        {selectedChallan.quantityType} | Qty {selectedChallan.totalQuantity} | {formatDisplayDate(selectedChallan.challanDate)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Party Name</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{selectedChallan.partyName || 'N/A'}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Quantity Type</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{selectedChallan.quantityType || 'N/A'}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total Quantity</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{selectedChallan.totalQuantity || 'N/A'}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Challan Date</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{formatDisplayDate(selectedChallan.challanDate)}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                      <h4 className="text-sm font-semibold text-slate-900">Party Information</h4>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Shop Name</p>
                          <p className="mt-1 text-sm text-slate-700">{selectedParty?.shopName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Mobile</p>
                          <p className="mt-1 text-sm text-slate-700">{selectedParty?.mobileNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Email</p>
                          <p className="mt-1 text-sm text-slate-700">{selectedParty?.email || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">GST Number</p>
                          <p className="mt-1 text-sm text-slate-700">{selectedParty?.gstNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">City</p>
                          <p className="mt-1 text-sm text-slate-700">{selectedParty?.city || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">State</p>
                          <p className="mt-1 text-sm text-slate-700">{selectedParty?.state || 'N/A'}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Address</p>
                          <p className="mt-1 text-sm text-slate-700">{selectedParty?.address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {challanToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              >
                <button
                  type="button"
                  onClick={() => setChallanToDelete(null)}
                  className="absolute right-4 top-4 rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close confirmation"
                >
                  <FiX size={18} />
                </button>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                  <FiTrash2 size={18} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Delete Challan?</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Are you sure you want to delete challan <strong>{challanToDelete.challanNumber}</strong>? This action cannot be undone.
                </p>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setChallanToDelete(null)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Reports
