import { useEffect, useMemo, useState } from 'react'
import { createInitialBillForm, getBillTotals, validateBillForm } from './yourBillUtils'
import YourBillPreview from './YourBillPreview'
import { createBillHistoryRecord } from './billHistoryStorage'

const inputClass = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100'

function YourBillForm({ parties = [], yourChalans = [], billHistory = [], setBillHistory }) {
  const [formData, setFormData] = useState(createInitialBillForm)
  const [message, setMessage] = useState('Fill the form and generate your bill preview.')
  const [messageTone, setMessageTone] = useState('info')
  const [partySearch, setPartySearch] = useState('')
  const [isPartyMenuOpen, setIsPartyMenuOpen] = useState(false)
  const [selectedChallanIds, setSelectedChallanIds] = useState([])
  const totals = useMemo(() => getBillTotals(formData.rows), [formData.rows])

  const filteredParties = useMemo(() => {
    const normalizedSearch = partySearch.trim().toLowerCase()

    if (!normalizedSearch) {
      return parties
    }

    return parties.filter((party) => {
      const partyName = (party.partyName || '').toLowerCase()
      const shopName = (party.shopName || '').toLowerCase()
      const mobileNumber = (party.mobileNumber || '').toLowerCase()

      return partyName.includes(normalizedSearch) || shopName.includes(normalizedSearch) || mobileNumber.includes(normalizedSearch)
    })
  }, [parties, partySearch])

  const selectedPartyChalans = useMemo(
    () => yourChalans.filter((chalan) => chalan.partyId === formData.partyId),
    [yourChalans, formData.partyId],
  )

  const getInwardChallanNumber = (chalan) => {
    const values = (chalan?.rows || [])
      .map((row) => row?.inwardChallanNumber || row?.inwardChNo || row?.inwardChallanNo || '')
      .filter(Boolean)

    if (values.length > 0) {
      return values[0]
    }

    return chalan?.inwardChNo || chalan?.inwardChallanNumber || chalan?.chalanNumber || '-'
  }

  const buildRowsFromChalans = (challanIds) => {
    const selectedChalans = yourChalans.filter((chalan) => challanIds.includes(chalan.id) && chalan.partyId === formData.partyId)

    if (selectedChalans.length === 0) {
      return []
    }

    return selectedChalans.flatMap((chalan) =>
      (chalan.rows || []).map((row, index) => ({
        id: `${chalan.id}-${index}-${Math.random().toString(36).slice(2, 8)}`,
        description: row.description || '',
        designNumber: row.designNumber || '',
        plain: row.plain || '',
        short: row.short || '',
        work: row.work || '',
        sample: row.sample || '',
        rate: row.rate || '',
        sourceChallanId: chalan.id,
        sourceChallanNumber: chalan.chalanNumber,
        inwardChNo: row?.inwardChallanNumber || row?.inwardChNo || row?.inwardChallanNo || getInwardChallanNumber(chalan),
        issueChNo: chalan?.chalanNumber || chalan?.issueChNo || chalan?.issueChallanNumber || '-',
      })),
    )
  }

  useEffect(() => {
    if (!formData.partyId) {
      if (selectedChallanIds.length > 0) {
        setSelectedChallanIds([])
      }
      return
    }

    setFormData((prev) => ({
      ...prev,
      rows: buildRowsFromChalans(selectedChallanIds),
    }))
  }, [selectedChallanIds, formData.partyId, yourChalans])

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const updateTerms = (value) => {
    setFormData((prev) => ({
      ...prev,
      terms: value.split('\n').map((term) => term.trim()).filter(Boolean),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validation = validateBillForm(formData)

    if (!validation.isValid) {
      setMessageTone('error')
      setMessage(`Please fill the following fields: ${validation.missingFields.join(', ')}.`)
      return
    }

    const record = createBillHistoryRecord({
      ...formData,
      partyId: formData.partyId,
      partyName: formData.partyName,
      billNumber: formData.billNumber,
      billDate: formData.billDate,
      rows: formData.rows,
      rawBill: formData,
    })

    setBillHistory?.([record, ...billHistory])
    setMessageTone('success')
    setMessage('Bill saved to Bill History.')

    // Reset Form Fields after successful submission
    setFormData(createInitialBillForm)
    setSelectedChallanIds([])
    setPartySearch('')
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Bill Form</h2>
            <p className="mt-1 text-sm text-slate-500">{message}</p>
          </div>
          <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-2 text-right">
            <span className="block text-xs font-medium uppercase text-violet-500">Bill No.</span>
            <strong className="text-xl text-slate-900">{formData.billNumber || '—'}</strong>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Bill No.</span>
            <input value={formData.billNumber} onChange={(event) => updateField('billNumber', event.target.value)} className={inputClass} placeholder="Enter bill no" />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Bill Date</span>
            <input type="date" value={formData.billDate} onChange={(event) => updateField('billDate', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-4">
            <span className="mb-1 block text-sm font-medium text-slate-700">Company Name</span>
            <input value={formData.companyName} onChange={(event) => updateField('companyName', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-4">
            <span className="mb-1 block text-sm font-medium text-slate-700">Address</span>
            <input value={formData.address} onChange={(event) => updateField('address', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Mobile</span>
            <input value={formData.mobile} onChange={(event) => updateField('mobile', event.target.value)} className={inputClass} />
          </label>
          <label className="lg:col-span-3">
            <span className="mb-1 block text-sm font-medium text-slate-700">Your GSTIN NO</span>
            <input value={formData.companyGstin} onChange={(event) => updateField('companyGstin', event.target.value)} className={inputClass} placeholder="Enter your GSTIN" />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Copy Type</span>
            <select value={formData.copyType} onChange={(event) => updateField('copyType', event.target.value)} className={inputClass}>
              <option value="Original">Original</option>
              <option value="Duplicate">Duplicate</option>
              <option value="Triplicate">Triplicate</option>
            </select>
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Broker</span>
            <input value={formData.broker} onChange={(event) => updateField('broker', event.target.value)} className={inputClass} placeholder="Enter broker" />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">PAN No.</span>
            <input value={formData.panNumber} onChange={(event) => updateField('panNumber', event.target.value)} className={inputClass} placeholder="Enter pan number" />
          </label>
          <label className="lg:col-span-4">
            <span className="mb-1 block text-sm font-medium text-slate-700">Terms & Conditions</span>
            <textarea value={(formData.terms || []).join('\n')} onChange={(event) => updateTerms(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
          </label>
          <div className="relative lg:col-span-4">
            <span className="mb-1 block text-sm font-medium text-slate-700">Party Name</span>
            <button
              type="button"
              onClick={() => {
                setPartySearch(formData.partyName || '')
                setIsPartyMenuOpen((prev) => !prev)
              }}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-violet-300"
            >
              <span className={formData.partyName ? 'text-slate-700' : 'text-slate-400'}>
                {formData.partyName || 'Select party'}
              </span>
              <span className="text-lg leading-none text-slate-400">▾</span>
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
                  {filteredParties.length === 0 ? (
                    <div className="rounded-xl px-3 py-3 text-sm text-slate-500">No party found</div>
                  ) : (
                    filteredParties.map((party) => (
                      <button
                        key={party.id}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            partyId: party.id,
                            partyName: party.partyName || '',
                            partyAddress: party.address || party.shopName || '',
                            partyMobile: party.mobileNumber || '',
                            partyGstin: party.gstNumber || party.gst || '',
                          }))
                          setSelectedChallanIds([])
                          setPartySearch(party.partyName || '')
                          setIsPartyMenuOpen(false)
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-violet-50"
                      >
                        <span>{party.partyName}</span>
                        <span className="text-xs text-slate-400">{party.city || party.address || ''}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <label className="lg:col-span-4">
            <span className="mb-1 block text-sm font-medium text-slate-700">Party Address</span>
            <input value={formData.partyAddress} onChange={(event) => updateField('partyAddress', event.target.value)} className={inputClass} placeholder="Enter address" />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Party Mobile</span>
            <input value={formData.partyMobile} onChange={(event) => updateField('partyMobile', event.target.value)} className={inputClass} placeholder="Enter mobile" />
          </label>
          <label className="lg:col-span-3">
            <span className="mb-1 block text-sm font-medium text-slate-700">Party GSTIN NO</span>
            <input value={formData.partyGstin} onChange={(event) => updateField('partyGstin', event.target.value)} className={inputClass} placeholder="Enter party GSTIN" />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Discount %</span>
            <input type="number" inputMode="decimal" min="0" step="0.01" value={formData.discountPercent} onChange={(event) => updateField('discountPercent', event.target.value)} className={inputClass} placeholder="0.00" />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">CGST %</span>
            <input type="number" inputMode="decimal" min="0" step="0.01" value={formData.cgstPercent} onChange={(event) => updateField('cgstPercent', event.target.value)} className={inputClass} placeholder="0.00" />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">SGST %</span>
            <input type="number" inputMode="decimal" min="0" step="0.01" value={formData.sgstPercent} onChange={(event) => updateField('sgstPercent', event.target.value)} className={inputClass} placeholder="0.00" />
          </label>
        </div>

        <div className="lg:col-span-12 mt-5">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Party Challans
          </span>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            {selectedPartyChalans.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-slate-400 min-w-[1120px]">
                No challans available. Please select a party first.
              </div>
            ) : (
              <table className="min-w-[1120px] text-left text-sm w-full border-collapse">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    {['Select', 'Inward Ch.No', 'Issue Ch.No', 'Challan Date', 'Total Rows', 'Total Qty', 'Gross Amount'].map((heading) => (
                      <th key={heading} className="px-3 py-3 font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedPartyChalans.map((chalan) => {
                    const isChecked = selectedChallanIds.includes(chalan.id);
                    return (
                      <tr
                        key={chalan.id}
                        className="border-t border-slate-200 transition-colors duration-150 hover:bg-slate-50/80 cursor-pointer"
                        onClick={() => {
                          setSelectedChallanIds((prev) =>
                            prev.includes(chalan.id)
                              ? prev.filter((id) => id !== chalan.id)
                              : [...prev, chalan.id]
                          );
                        }}
                      >
                        {/* Checkbox Column */}
                        <td className="px-3 py-3" onClick={(event) => event.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedChallanIds((prev) =>
                                prev.includes(chalan.id)
                                  ? prev.filter((id) => id !== chalan.id)
                                  : [...prev, chalan.id]
                              );
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer vertical-align-middle"
                          />
                        </td>

                        {/* Inward Challan Number Column */}
                        <td className="px-3 py-3 font-medium text-slate-900">
                          {getInwardChallanNumber(chalan)}
                        </td>

                        {/* Challan Number Column */}
                        <td className="px-3 py-3 font-medium text-slate-900">
                          {chalan.chalanNumber}
                        </td>

                        {/* Challan Date Column */}
                        <td className="px-3 py-3 text-slate-600">
                          {chalan.chalanDate}
                        </td>

                        {/* Total Rows Column */}
                        <td className="px-3 py-3 text-slate-700">
                          {chalan.rows?.length || 0}
                        </td>

                        {/* Total Quantity Column */}
                        <td className="px-3 py-3 text-slate-700">
                          {chalan.totalPieces || 0}
                        </td>

                        {/* Gross Amount Column */}
                        <td className="px-3 py-3 font-semibold text-slate-900">
                          {Number(chalan.grossAmount || chalan.totalAmount || 0).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Selected challan rows will appear in the bill preview automatically. No manual row table is needed.
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-slate-700">Total Qty. {totals.quantity} | Total Amount {totals.amount.toFixed(2)}</div>
          <button type="submit" className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl">
            Generate Bill
          </button>
        </div>

        <div className={`mt-3 rounded-xl border px-4 py-3 text-sm ${messageTone === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : messageTone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
          {message}
        </div>
      </form>

      <YourBillPreview bill={formData} />
    </div>
  )
}

export default YourBillForm