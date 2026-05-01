import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

function DataEntryForm({
  formData,
  message,
  parties,
  quantityTypes,
  onRowChange,
  onSubmit,
  onAddRow,
  onDeleteRow,
  onAddType,
  onRemoveType,
  onAddParty,
}) {
  const [partySearch, setPartySearch] = useState('')
  const [activePartyRowId, setActivePartyRowId] = useState(null)
  const [activeTypeRowId, setActiveTypeRowId] = useState(null)
  const [newType, setNewType] = useState('')
  const [partyMenuPosition, setPartyMenuPosition] = useState({ top: 0, left: 0, width: 320 })
  const [typeMenuPosition, setTypeMenuPosition] = useState({ top: 0, left: 0, width: 280 })
  const partyButtonRefs = useRef({})
  const partyMenuRef = useRef(null)
  const typeButtonRefs = useRef({})
  const typeMenuRef = useRef(null)
  const rows = formData.rows

  const inputClass =
    'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100'

  const filteredParties = useMemo(() => {
    const normalizedSearch = partySearch.trim().toLowerCase()

    if (!normalizedSearch) {
      return parties
    }

    return parties.filter((party) => party.partyName.toLowerCase().includes(normalizedSearch))
  }, [parties, partySearch])

  const activePartyRow = rows.find((row) => row.id === activePartyRowId) || null
  const activeTypeRow = rows.find((row) => row.id === activeTypeRowId) || null

  const getSelectedParty = (partyId) => parties.find((party) => party.id === partyId)

  const selectParty = (rowId, partyId) => {
    onRowChange(rowId, 'partyId', partyId)
    setActivePartyRowId(null)
    setPartySearch('')
  }

  const handleAddType = () => {
    const added = onAddType(newType)

    if (added) {
      setNewType('')
    }
  }

  const updatePartyMenuPosition = (rowId) => {
    const targetButton = partyButtonRefs.current[rowId]

    if (!targetButton) {
      return
    }

    const rect = targetButton.getBoundingClientRect()
    const preferredWidth = 320
    const availableRightSpace = window.innerWidth - rect.left
    const menuWidth = Math.min(preferredWidth, Math.max(280, availableRightSpace - 16))
    const nextLeft =
      rect.left + menuWidth > window.innerWidth - 16
        ? Math.max(16, window.innerWidth - menuWidth - 16)
        : rect.left

    setPartyMenuPosition({
      top: rect.bottom + 8,
      left: nextLeft,
      width: menuWidth,
    })
  }

  const updateTypeMenuPosition = (rowId) => {
    const targetButton = typeButtonRefs.current[rowId]

    if (!targetButton) {
      return
    }

    const rect = targetButton.getBoundingClientRect()
    const preferredWidth = Math.max(rect.width, 280)
    const menuWidth = Math.min(preferredWidth, window.innerWidth - 32)
    const nextLeft = Math.min(rect.left, window.innerWidth - menuWidth - 16)

    setTypeMenuPosition({
      top: rect.bottom + 8,
      left: Math.max(16, nextLeft),
      width: menuWidth,
    })
  }

  useEffect(() => {
    if (!activePartyRowId) {
      return
    }

    updatePartyMenuPosition(activePartyRowId)

    const handlePointerDown = (event) => {
      if (
        partyButtonRefs.current[activePartyRowId]?.contains(event.target) ||
        partyMenuRef.current?.contains(event.target)
      ) {
        return
      }

      setActivePartyRowId(null)
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActivePartyRowId(null)
      }
    }

    const handleViewportChange = () => {
      updatePartyMenuPosition(activePartyRowId)
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [activePartyRowId])

  useEffect(() => {
    if (!activeTypeRowId) {
      return
    }

    updateTypeMenuPosition(activeTypeRowId)

    const handlePointerDown = (event) => {
      if (
        typeButtonRefs.current[activeTypeRowId]?.contains(event.target) ||
        typeMenuRef.current?.contains(event.target)
      ) {
        return
      }

      setActiveTypeRowId(null)
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveTypeRowId(null)
      }
    }

    const handleViewportChange = () => {
      updateTypeMenuPosition(activeTypeRowId)
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [activeTypeRowId])

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Chalan Entry Form</h2>
          <p className="mt-2 text-sm text-slate-600">{message}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white xl:overflow-visible">
          <table className="min-w-[920px] w-full border-collapse xl:min-w-0">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="border-r border-slate-700 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Party Name</th>
                <th className="border-r border-slate-700 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Search / Select</th>
                <th className="border-r border-slate-700 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Quantity Type</th>
                <th className="border-r border-slate-700 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Total Quantity</th>
                <th className="border-r border-slate-700 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Date</th>
                <th className="border-r border-slate-700 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Party Challan Number</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">
                  <button
                    type="button"
                    onClick={onAddRow}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                  >
                    <FiPlus size={14} />
                    Add Row
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const selectedParty = getSelectedParty(row.partyId)

                return (
              <tr key={row.id} className="align-top">
                <td className="border-r border-b border-slate-200 px-4 py-4">
                  <div className="min-w-[150px] xl:min-w-0">
                    <p className="text-sm font-semibold text-slate-700">
                      {selectedParty ? selectedParty.partyName : 'No party selected'}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {selectedParty ? `${selectedParty.city}, ${selectedParty.state}` : 'Select from dropdown'}
                    </p>
                  </div>
                </td>
                <td className="border-r border-b border-slate-200 px-4 py-4">
                  <div className="relative min-w-[180px] xl:min-w-0">
                    <button
                      ref={(node) => {
                        if (node) {
                          partyButtonRefs.current[row.id] = node
                        } else {
                          delete partyButtonRefs.current[row.id]
                        }
                      }}
                      type="button"
                      onClick={() => {
                        if (activePartyRowId !== row.id) {
                          updatePartyMenuPosition(row.id)
                        }

                        setActivePartyRowId((prev) => (prev === row.id ? null : row.id))
                      }}
                      className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-violet-300"
                    >
                      <span className={selectedParty ? 'text-slate-700' : 'text-slate-400'}>
                        {selectedParty ? selectedParty.partyName : 'Search and select party'}
                      </span>
                      <span className="text-lg leading-none text-slate-400">&#9662;</span>
                    </button>
                  </div>
                </td>
                <td className="border-r border-b border-slate-200 px-4 py-4">
                  <div className="min-w-[140px] xl:min-w-0">
                    <button
                      ref={(node) => {
                        if (node) {
                          typeButtonRefs.current[row.id] = node
                        } else {
                          delete typeButtonRefs.current[row.id]
                        }
                      }}
                      type="button"
                      onClick={() => {
                        if (activeTypeRowId !== row.id) {
                          updateTypeMenuPosition(row.id)
                        }

                        setActiveTypeRowId((prev) => (prev === row.id ? null : row.id))
                      }}
                      className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-violet-300"
                    >
                      <span className={row.quantityType ? 'text-slate-700' : 'text-slate-400'}>
                        {row.quantityType || 'Select quantity type'}
                      </span>
                      <span className="text-lg leading-none text-slate-400">&#9662;</span>
                    </button>
                  </div>
                </td>
                <td className="border-r border-b border-slate-200 px-4 py-4">
                  <div className="min-w-[120px] xl:min-w-0">
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      value={row.totalQuantity}
                      onChange={(event) => onRowChange(row.id, 'totalQuantity', event.target.value)}
                      placeholder="Total quantity"
                    />
                  </div>
                </td>
                <td className="border-r border-b border-slate-200 px-4 py-4">
                  <div className="min-w-[130px] xl:min-w-0">
                    <input
                      className={inputClass}
                      type="date"
                      value={row.challanDate}
                      onChange={(event) => onRowChange(row.id, 'challanDate', event.target.value)}
                    />
                  </div>
                </td>
                <td className="border-r border-b border-slate-200 px-4 py-4">
                  <div className="min-w-[150px] xl:min-w-0">
                    <input
                      className={inputClass}
                      value={row.challanNumber}
                      onChange={(event) => onRowChange(row.id, 'challanNumber', event.target.value)}
                      placeholder="Enter challan number"
                    />
                  </div>
                </td>
                <td className="border-b border-slate-200 px-4 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => onDeleteRow(row.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={rows.length === 1}
                    aria-label="Delete row"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </div>

      {activePartyRowId && (
        <div
          ref={partyMenuRef}
          className="fixed z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
          style={{
            top: `${partyMenuPosition.top}px`,
            left: `${partyMenuPosition.left}px`,
            width: `${partyMenuPosition.width}px`,
          }}
        >
          <input
            type="search"
            value={partySearch}
            onChange={(event) => setPartySearch(event.target.value)}
            className={inputClass}
            placeholder="Search party name"
          />

          <div className="mt-3 max-h-56 overflow-y-auto">
            {filteredParties.length === 0 ? (
              <div className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500">
                No matching party found. Add a new party to continue.
              </div>
            ) : (
              filteredParties.map((party) => (
                <button
                  key={party.id}
                  type="button"
                  onClick={() => selectParty(activePartyRowId, party.id)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-violet-50"
                >
                  <span>{party.partyName}</span>
                  <span className="text-xs text-slate-400">{party.city}</span>
                </button>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={onAddParty}
            className="mt-3 inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open Party Details Form
          </button>
        </div>
      )}

      {activeTypeRowId && (
        <div
          ref={typeMenuRef}
          className="fixed z-50 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
          style={{
            top: `${typeMenuPosition.top}px`,
            left: `${typeMenuPosition.left}px`,
            width: `${typeMenuPosition.width}px`,
          }}
        >
          <div className="border-b border-slate-200 p-2">
            <div className="flex flex-col gap-2">
              <input
                value={newType}
                onChange={(event) => setNewType(event.target.value)}
                className={inputClass}
                placeholder="Add new quantity type"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddType}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <FiPlus size={14} />
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (activeTypeRow) {
                      onRemoveType(activeTypeRow.quantityType)
                    }
                    setActiveTypeRowId(null)
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  <FiTrash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {quantityTypes.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  if (activeTypeRowId) {
                    onRowChange(activeTypeRowId, 'quantityType', option)
                  }
                  setActiveTypeRowId(null)
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition ${
                  activeTypeRow?.quantityType === option
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-slate-700 hover:bg-violet-50'
                }`}
              >
                <span>{option}</span>
                {activeTypeRow?.quantityType === option ? <span>Selected</span> : null}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onAddParty}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Open Party Details
        </button>
        <button
          type="submit"
          className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Save Challan
        </button>
      </div>
    </motion.form>
  )
}

export default DataEntryForm
