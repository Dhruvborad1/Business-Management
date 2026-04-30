import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiPlus, FiX } from 'react-icons/fi'
import HeroSection from './HeroSection'
import DataEntryForm from './DataEntryForm'
import PartyForm from '../settings/PartyForm'
import { createEmptyChallanRow, createInitialForm, defaultQuantityTypes } from '../data'
import YourChalanForm from '../yourChalan/YourChalanForm'

const capitalizeFirstCharacter = (value) => {
  if (!value) {
    return value
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

function Settings({ parties, setParties, challans, setChallans, yourChalans, setYourChalans }) {
  const [isPartyFormOpen, setIsPartyFormOpen] = useState(false)
  const [isChallanFormOpen, setIsChallanFormOpen] = useState(false)
  const [isYourChalanFormOpen, setIsYourChalanFormOpen] = useState(false)
  const [quantityTypes, setQuantityTypes] = useState(() => {
    const savedTypes = window.localStorage.getItem('riyafashion-quantity-types')

    if (!savedTypes) {
      return defaultQuantityTypes
    }

    try {
      return JSON.parse(savedTypes)
    } catch {
      return defaultQuantityTypes
    }
  })
  const [challanFormData, setChallanFormData] = useState(() => createInitialForm(quantityTypes[0] || ''))
  const [challanMessage, setChallanMessage] = useState('Add challan details here for stock received from the market.')

  const handleRowChange = (rowId, name, value) => {
    const normalizedValue = name === 'challanNumber' ? capitalizeFirstCharacter(value) : value

    setChallanFormData((prev) => ({
      ...prev,
      rows: prev.rows.map((row) => (row.id === rowId ? { ...row, [name]: normalizedValue } : row)),
    }))
  }

  const handleAddRow = () => {
    setChallanFormData((prev) => ({
      ...prev,
      rows: [...prev.rows, createEmptyChallanRow(quantityTypes[0] || '')],
    }))
  }

  const handleDeleteRow = (rowId) => {
    setChallanFormData((prev) => {
      if (prev.rows.length === 1) {
        return prev
      }

      return {
        ...prev,
        rows: prev.rows.filter((row) => row.id !== rowId),
      }
    })
  }

  const handleAddType = (typeName) => {
    const normalizedType = typeName.trim()

    if (!normalizedType) {
      return false
    }

    const exists = quantityTypes.some((type) => type.toLowerCase() === normalizedType.toLowerCase())

    if (exists) {
      setChallanFormData((prev) => ({
        ...prev,
        rows: prev.rows.map((row) => ({ ...row, quantityType: normalizedType })),
      }))
      return false
    }

    const updatedTypes = [...quantityTypes, normalizedType]
    setQuantityTypes(updatedTypes)
    window.localStorage.setItem('riyafashion-quantity-types', JSON.stringify(updatedTypes))
    setChallanFormData((prev) => ({
      ...prev,
      rows: prev.rows.map((row) => ({ ...row, quantityType: row.quantityType || normalizedType })),
    }))
    setChallanMessage(`"${normalizedType}" quantity type was added.`)
    return true
  }

  const handleRemoveType = (typeName) => {
    if (quantityTypes.length <= 1) {
      setChallanMessage('At least one quantity type is required.')
      return
    }

    const updatedTypes = quantityTypes.filter((type) => type !== typeName)
    setQuantityTypes(updatedTypes)
    window.localStorage.setItem('riyafashion-quantity-types', JSON.stringify(updatedTypes))
    setChallanFormData((prev) => ({
      ...prev,
      rows: prev.rows.map((row) => ({
        ...row,
        quantityType: row.quantityType === typeName ? updatedTypes[0] : row.quantityType,
      })),
    }))
    setChallanMessage(`"${typeName}" quantity type was removed.`)
  }

  const handleChallanSubmit = (event) => {
    event.preventDefault()

    const normalizedRows = challanFormData.rows.map((row) => ({
      ...row,
      totalQuantity: Number(row.totalQuantity),
      selectedParty: parties.find((party) => party.id === row.partyId),
    }))

    const hasInvalidRow = normalizedRows.some(
      (row) => !row.selectedParty || !row.quantityType || !row.challanDate || !row.challanNumber || row.totalQuantity <= 0,
    )

    if (hasInvalidRow) {
      setChallanMessage('Please fill party, type, total quantity, date, and challan number.')
      return
    }

    setChallans((prev) => [
      ...normalizedRows.map((row) => ({
        id: crypto.randomUUID(),
        ...row,
        partyName: row.selectedParty.partyName,
      })),
      ...prev,
    ])
    setChallanMessage('Challan added successfully.')
    setChallanFormData(createInitialForm(quantityTypes[0] || ''))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-4">

        {/* Hero Section */}
        <HeroSection />

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setIsPartyFormOpen((prev) => !prev)}
            className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 ${
              isPartyFormOpen ? 'rounded-t-2xl' : 'rounded-2xl'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
                {isPartyFormOpen ? <FiX size={18} /> : <FiPlus size={18} />}
              </span>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Party Details Form</h2>
                <p className="text-sm text-slate-500">Click to {isPartyFormOpen ? 'close' : 'open'} the form</p>
              </div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isPartyFormOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -16 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-slate-200"
              >
                <div className="p-4 pt-5">
                  <PartyForm setParties={setParties} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setIsChallanFormOpen((prev) => !prev)}
            className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 ${
              isChallanFormOpen ? 'rounded-t-2xl' : 'rounded-2xl'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
                {isChallanFormOpen ? <FiX size={18} /> : <FiPlus size={18} />}
              </span>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Chalan Entry Form</h2>
                <p className="text-sm text-slate-500">Click to {isChallanFormOpen ? 'close' : 'open'} the form</p>
              </div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isChallanFormOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -16 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-slate-200"
              >
                <div className="p-4 pt-5">
                  <DataEntryForm
                    formData={challanFormData}
                    message={challanMessage}
                    parties={parties}
                    quantityTypes={quantityTypes}
                    onRowChange={handleRowChange}
                    onSubmit={handleChallanSubmit}
                    onAddRow={handleAddRow}
                    onDeleteRow={handleDeleteRow}
                    onAddType={handleAddType}
                    onRemoveType={handleRemoveType}
                    onAddParty={() => setIsPartyFormOpen(true)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setIsYourChalanFormOpen((prev) => !prev)}
            className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 ${
              isYourChalanFormOpen ? 'rounded-t-2xl' : 'rounded-2xl'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
                {isYourChalanFormOpen ? <FiX size={18} /> : <FiPlus size={18} />}
              </span>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Your Chalan Form</h2>
                <p className="text-sm text-slate-500">Click to {isYourChalanFormOpen ? 'close' : 'open'} the form</p>
              </div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isYourChalanFormOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -16 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-slate-200"
              >
                <div className="p-4 pt-5">
                  <YourChalanForm
                    parties={parties}
                    quantityTypes={quantityTypes}
                    yourChalans={yourChalans}
                    setYourChalans={setYourChalans}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </motion.div>
  )
}

export default Settings
