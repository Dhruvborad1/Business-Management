import { useEffect, useMemo, useRef, useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import {
  createInitialYourChalanForm,
  emptyYourChalanRow,
  getNextYourChalanNumber,
  getYourChalanTotals,
} from './yourChalanUtils'
import YourChalanPreview from './YourChalanPreview'

const inputClass = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100'

function YourChalanForm({ parties, quantityTypes = [], yourChalans, setYourChalans }) {
  const [formData, setFormData] = useState(() => createInitialYourChalanForm(yourChalans))
  const [message, setMessage] = useState('Create your company challan to send to party.')
  const [partySearch, setPartySearch] = useState('')
  const [isPartyMenuOpen, setIsPartyMenuOpen] = useState(false)
  const [activeDescriptionRowId, setActiveDescriptionRowId] = useState(null)
  const partyMenuRef = useRef(null)
  const descriptionButtonRefs = useRef({})
  const descriptionMenuRef = useRef(null)
  const [descriptionMenuPosition, setDescriptionMenuPosition] = useState({ top: 0, left: 0, width: 224 })
  const totals = useMemo(() => getYourChalanTotals(formData.rows), [formData.rows])
  const selectedParty = useMemo(
    () => parties.find((party) => party.id === formData.partyId) || null,
    [parties, formData.partyId],
  )
  const filteredParties = useMemo(() => {
    const normalizedSearch = partySearch.trim().toLowerCase()

    if (!normalizedSearch) {
      return parties
    }

    return parties.filter((party) => party.partyName.toLowerCase().includes(normalizedSearch))
  }, [parties, partySearch])

  const updateField = (name, value) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value }

      if (name === 'chalanDate') {
        next.chalanNumber = getNextYourChalanNumber(yourChalans, value)
      }

      return next
    })
  }

  const updateTerms = (value) => {
    setFormData((prev) => ({
      ...prev,
      terms: value.split('\n'),
    }))
  }

  const handlePartySelect = (partyId) => {
    const selectedParty = parties.find((party) => party.id === partyId)

    setFormData((prev) => ({
      ...prev,
      partyId,
      partyName: selectedParty?.partyName || '',
      partyAddress: selectedParty?.address || selectedParty?.shopName || '',
      partyMobile: selectedParty?.mobileNumber || '',
    }))
    setPartySearch('')
    setIsPartyMenuOpen(false)
  }

  const updateDescriptionMenuPosition = (rowId) => {
    const targetButton = descriptionButtonRefs.current[rowId]

    if (!targetButton) {
      return
    }

    const rect = targetButton.getBoundingClientRect()
    const preferredWidth = Math.max(rect.width, 224)
    const menuWidth = Math.min(preferredWidth, window.innerWidth - 32)
    const nextLeft = Math.min(rect.left, window.innerWidth - menuWidth - 16)

    setDescriptionMenuPosition({
      top: rect.bottom + 8,
      left: Math.max(16, nextLeft),
      width: menuWidth,
    })
  }

  useEffect(() => {
    if (!isPartyMenuOpen && !activeDescriptionRowId) {
      return
    }

    const handlePointerDown = (event) => {
      if (
        partyMenuRef.current?.contains(event.target) ||
        descriptionMenuRef.current?.contains(event.target)
      ) {
        return
      }

      setIsPartyMenuOpen(false)
      setActiveDescriptionRowId(null)
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsPartyMenuOpen(false)
        setActiveDescriptionRowId(null)
      }
    }

    const handleViewportChange = () => {
      if (activeDescriptionRowId) {
        updateDescriptionMenuPosition(activeDescriptionRowId)
      }
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
  }, [isPartyMenuOpen, activeDescriptionRowId])

  const updateRow = (rowId, name, value) => {
    setFormData((prev) => ({
      ...prev,
      rows: prev.rows.map((row) => (row.id === rowId ? { ...row, [name]: value } : row)),
    }))
  }

  const addRow = () => {
    setFormData((prev) => ({ ...prev, rows: [...prev.rows, emptyYourChalanRow()] }))
  }

  const deleteRow = (rowId) => {
    setFormData((prev) => ({
      ...prev,
      rows: prev.rows.length === 1 ? prev.rows : prev.rows.filter((row) => row.id !== rowId),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validRows = formData.rows.filter((row) => row.description || row.designNumber || row.inwardChallanNumber)

    if (!formData.partyName || !formData.chalanDate || validRows.length === 0) {
      setMessage('Please fill party name, challan date, and at least one item row.')
      return
    }

    const savedChalan = {
      ...formData,
      id: crypto.randomUUID(),
      chalanNumber: getNextYourChalanNumber(yourChalans, formData.chalanDate),
      chalanYear: new Date(formData.chalanDate).getFullYear(),
      rows: validRows,
      grossAmount: totals.amount,
      totalPieces: totals.totalPieces,
      createdAt: new Date().toISOString(),
    }

    setYourChalans((prev) => [savedChalan, ...prev])
    setFormData(createInitialYourChalanForm([savedChalan, ...yourChalans]))
    setMessage(`Your chalan no. ${savedChalan.chalanNumber} saved successfully.`)
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Chalan Form</h2>
            <p className="mt-1 text-sm text-slate-500">{message}</p>
          </div>
          <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-2 text-right">
            <span className="block text-xs font-medium uppercase text-violet-500">Auto Chalan No.</span>
            <strong className="text-xl text-slate-900">{formData.chalanNumber}</strong>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
          <label className="lg:col-span-3">
            <span className="mb-1 block text-sm font-medium text-slate-700">Company Name</span>
            <input value={formData.companyName} onChange={(event) => updateField('companyName', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Date</span>
            <input type="date" value={formData.chalanDate} onChange={(event) => updateField('chalanDate', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-4">
            <span className="mb-1 block text-sm font-medium text-slate-700">Company Address</span>
            <input value={formData.address} onChange={(event) => updateField('address', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-3">
            <span className="mb-1 block text-sm font-medium text-slate-700">Company Phone</span>
            <input value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-3">
            <span className="mb-1 block text-sm font-medium text-slate-700">Mobile Line</span>
            <input value={formData.mobile} onChange={(event) => updateField('mobile', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Copy Type</span>
            <input value={formData.copyType} onChange={(event) => updateField('copyType', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Broker</span>
            <input value={formData.broker} onChange={(event) => updateField('broker', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">PAN No.</span>
            <input value={formData.panNumber} onChange={(event) => updateField('panNumber', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-3">
            <span className="mb-1 block text-sm font-medium text-slate-700">Terms & Condition</span>
            <textarea
              value={(formData.terms || []).join('\n')}
              onChange={(event) => updateTerms(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>
          <div className="relative lg:col-span-3" ref={partyMenuRef}>
            <span className="mb-1 block text-sm font-medium text-slate-700">Select Party</span>
            <button
              type="button"
              onClick={() => setIsPartyMenuOpen((prev) => !prev)}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-violet-300"
            >
              <span className={selectedParty ? 'text-slate-700' : 'text-slate-400'}>
                {selectedParty ? selectedParty.partyName : 'Manual party / select party'}
              </span>
              <span className="text-lg leading-none text-slate-400">&#9662;</span>
            </button>
            {isPartyMenuOpen && (
              <div className="absolute left-0 top-full z-40 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
                <input
                  type="search"
                  value={partySearch}
                  onChange={(event) => setPartySearch(event.target.value)}
                  className={inputClass}
                  placeholder="Search party name"
                />
                <div className="mt-3 max-h-56 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => handlePartySelect('')}
                    className="flex w-full rounded-xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-violet-50"
                  >
                    Manual party entry
                  </button>
                  {filteredParties.map((party) => (
                    <button
                      key={party.id}
                      type="button"
                      onClick={() => handlePartySelect(party.id)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-violet-50"
                    >
                      <span>{party.partyName}</span>
                      <span className="text-xs text-slate-400">{party.city}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <label className="lg:col-span-3">
            <span className="mb-1 block text-sm font-medium text-slate-700">M/s. Party Name *</span>
            <input value={formData.partyName} onChange={(event) => updateField('partyName', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Party Mobile</span>
            <input value={formData.partyMobile} onChange={(event) => updateField('partyMobile', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-4">
            <span className="mb-1 block text-sm font-medium text-slate-700">Party Address</span>
            <input value={formData.partyAddress} onChange={(event) => updateField('partyAddress', event.target.value)} className={inputClass} />
          </label>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                {['Inward Ch.No', 'Inward Date', 'Description', 'Design No', 'Plain', 'Short', 'Work', 'Sample', 'Rate', ''].map((heading) => (
                  <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formData.rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="px-2 py-2"><input value={row.inwardChallanNumber} onChange={(event) => updateRow(row.id, 'inwardChallanNumber', event.target.value)} className={inputClass} /></td>
                  <td className="px-2 py-2"><input type="date" value={row.inwardChallanDate} onChange={(event) => updateRow(row.id, 'inwardChallanDate', event.target.value)} className={inputClass} /></td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      ref={(node) => {
                        if (node) {
                          descriptionButtonRefs.current[row.id] = node
                        } else {
                          delete descriptionButtonRefs.current[row.id]
                        }
                      }}
                      onClick={() => {
                        if (activeDescriptionRowId !== row.id) {
                          updateDescriptionMenuPosition(row.id)
                        }

                        setActiveDescriptionRowId((prev) => (prev === row.id ? null : row.id))
                      }}
                      className="flex h-11 w-full min-w-[150px] items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-violet-300"
                    >
                      <span className={row.description ? 'text-slate-700' : 'text-slate-400'}>
                        {row.description || 'Select description'}
                      </span>
                      <span className="text-lg leading-none text-slate-400">&#9662;</span>
                    </button>
                  </td>
                  <td className="px-2 py-2"><input value={row.designNumber} onChange={(event) => updateRow(row.id, 'designNumber', event.target.value)} className={inputClass} /></td>
                  {['plain', 'short', 'work', 'sample', 'rate'].map((field) => (
                    <td key={field} className="px-2 py-2">
                      <input type="number" min="0" value={row[field]} onChange={(event) => updateRow(row.id, field, event.target.value)} className={inputClass} />
                    </td>
                  ))}
                  <td className="px-2 py-2">
                    <button type="button" onClick={() => deleteRow(row.id)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100" aria-label="Delete row">
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activeDescriptionRowId && (
          <div
            ref={descriptionMenuRef}
            className="fixed z-50 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
            style={{
              top: `${descriptionMenuPosition.top}px`,
              left: `${descriptionMenuPosition.left}px`,
              width: `${descriptionMenuPosition.width}px`,
            }}
          >
            {quantityTypes.length === 0 ? (
              <div className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500">
                No quantity type available.
              </div>
            ) : (
              quantityTypes.map((option) => {
                const activeRow = formData.rows.find((row) => row.id === activeDescriptionRowId)

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      updateRow(activeDescriptionRowId, 'description', option)
                      setActiveDescriptionRowId(null)
                    }}
                    className={`flex w-full rounded-xl px-3 py-3 text-left text-sm transition ${
                      activeRow?.description === option
                        ? 'bg-violet-50 text-violet-700'
                        : 'text-slate-700 hover:bg-violet-50'
                    }`}
                  >
                    {option}
                  </button>
                )
              })
            )}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={addRow} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <FiPlus size={16} />
            Add Row
          </button>
          <div className="text-sm font-semibold text-slate-700">Total Pcs. {totals.totalPieces} | Gross Amount {totals.amount.toFixed(2)}</div>
          <button type="submit" className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
            Save Your Chalan
          </button>
        </div>
      </form>

      <YourChalanPreview chalan={formData} />
    </div>
  )
}

export default YourChalanForm
