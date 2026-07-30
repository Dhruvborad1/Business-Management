
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiPlus, FiX, FiUsers, FiFileText, FiFolderPlus, FiDollarSign, FiChevronDown } from 'react-icons/fi'
import HeroSection from './HeroSection'
import DataEntryForm from './DataEntryForm'
import PartyForm from '../directory/PartyForm'
import { createEmptyChallanRow, createInitialForm, defaultQuantityTypes } from '../data'
import YourChalanForm from '../yourChalan/YourChalanForm'
import YourBillForm from '../yourBill/YourBillForm'

const capitalizeFirstCharacter = (value) => {
  if (!value) {
    return value
  }
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function Directory({ parties, setParties, challans, setChallans, yourChalans, setYourChalans, billHistory, setBillHistory }) {
  const location = useLocation()

  const [activeForm, setActiveForm] = useState(null) // 'party' | 'challan' | 'yourChalan' | 'yourBill' | null

  const [editingYourChalanId, setEditingYourChalanId] = useState(null)
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
  const [challanMessage, setChallanMessage] = useState('')

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

  useEffect(() => {
    if (!location.state?.openYourChalanForm) {
      return
    }

    setActiveForm('yourChalan')
    setEditingYourChalanId(location.state.editYourChalanId || null)
  }, [location.state])

  useEffect(() => {
    if (!location.state?.openYourBillForm) {
      return
    }

    setActiveForm('yourBill')
  }, [location.state])

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

  // કાર્ડ્સ નો ડેટા
  const cardsData = [
    {
      id: 'party',
      title: 'Party Details Form',
      desc: 'Add or edit party info',
      icon: <FiUsers className="h-6 w-6 text-indigo-600" />,
      component: <PartyForm setParties={setParties} />,
    },
    {
      id: 'challan',
      title: 'Party Chalan Entry',
      desc: 'Create party challan entries',
      icon: <FiFolderPlus className="h-6 w-6 text-emerald-600" />,
      component: (
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
          onAddParty={() => setActiveForm('party')}
        />
      ),
    },
    {
      id: 'yourChalan',
      title: 'Your Chalan Form',
      desc: 'Manage & create your chalans',
      icon: <FiFileText className="h-6 w-6 text-blue-600" />,
      component: (
        <YourChalanForm
          parties={parties}
          quantityTypes={quantityTypes}
          challans={challans}
          setChallans={setChallans}
          yourChalans={yourChalans}
          setYourChalans={setYourChalans}
          editingYourChalanId={editingYourChalanId}
          onEditComplete={() => setEditingYourChalanId(null)}
        />
      ),
    },
    {
      id: 'yourBill',
      title: 'Generate Bill',
      desc: 'Create billing and invoices',
      icon: <FiDollarSign className="h-6 w-6 text-amber-600" />,
      component: (
        <YourBillForm
          parties={parties}
          yourChalans={yourChalans}
          billHistory={billHistory}
          setBillHistory={setBillHistory}
        />
      ),
    },
  ]

  const activeCardData = cardsData.find((card) => card.id === activeForm)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-6">
        {/* Hero Section */}
        <HeroSection />

        {/* ========================================================= */}
        {/* 1. MOBILE VIEW: ઊભી પટ્ટી વાળી ડિઝાઇન (માત્ર મોબાઇલમાં જ દેખાશે) */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-4 md:hidden">
          {cardsData.map((card) => {
            const isOpen = activeForm === card.id
            return (
              <section key={card.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveForm(isOpen ? null : card.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
                      {isOpen ? <FiX size={18} /> : <FiPlus size={18} />}
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">{card.title}</h2>
                      <p className="text-sm text-slate-500">Click to {isOpen ? 'close' : 'open'}</p>
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="border-t border-slate-200 p-4 overflow-hidden"
                    >
                      {card.component}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )
          })}
        </div>

        {/* ========================================================= */}
        {/* 2. DESKTOP VIEW: 4 કાર્ડ્સ ગ્રીડ + તેની નીચે જ ફોર્મ એનિમેશન સાથે ખુલશે */}
        {/* ========================================================= */}
        <div className="hidden flex-col gap-6 md:flex">
          {/* Top 4 Grid Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {cardsData.map((card) => {
              const isActive = activeForm === card.id
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveForm(isActive ? null : card.id)}
                  className={`relative text-left rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between ${isActive
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                        {card.icon}
                      </span>
                      <motion.div
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-slate-400"
                      >
                        <FiChevronDown size={20} />
                      </motion.div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{card.desc}</p>
                  </div>

                  <div className="mt-4 text-xs font-semibold text-indigo-600">
                    {isActive ? 'Click to hide' : 'Click to open form'}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Expanded Form Below Grid */}
          <AnimatePresence initial={false}>
            {activeCardData && (
              <motion.div
                key={activeCardData.id}
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md"
              >
                {/* Form Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm">
                      {activeCardData.icon}
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{activeCardData.title}</h2>
                      <p className="text-xs text-slate-500">{activeCardData.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveForm(null)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                  >
                    <FiX size={16} /> Close
                  </button>
                </div>

                {/* Form Content */}
                <div className="p-6">
                  {activeCardData.component}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  )
}

export default Directory  