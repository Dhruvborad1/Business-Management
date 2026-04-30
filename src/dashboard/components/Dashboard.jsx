import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AnalyticsCharts from './AnalyticsCharts'
import DataEntryForm from './DataEntryForm'
import HeroSection from './HeroSection'
import RecentEntriesTable from './RecentEntriesTable'
import StatsCards from './StatsCards'
import { createEmptyChallanRow, createInitialForm, defaultQuantityTypes, seedMonthlySales } from '../data'

const capitalizeFirstCharacter = (value) => {
    if (!value) {
        return value
    }

    return value.charAt(0).toUpperCase() + value.slice(1)
}

function DashboardHome({ parties, challans, setChallans }) {
    const navigate = useNavigate()
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
    const [formData, setFormData] = useState(() => createInitialForm(quantityTypes[0] || ''))
    const [message, setMessage] = useState('Add challan details here for stock received from the market.')

    const metrics = useMemo(() => {
        const totalOrders = challans.length
        const totalQuantity = challans.reduce((sum, item) => sum + Number(item.totalQuantity || 0), 0)
        const totalParty = parties.length
        const totalTypes = quantityTypes.length

        return { totalOrders, totalQuantity, totalParty, totalTypes }
    }, [challans, parties, quantityTypes])

    const monthlyData = useMemo(() => {
        const nextData = seedMonthlySales.map((item) => ({ ...item }))

        challans.forEach((row) => {
            const monthKey = new Date(row.challanDate).toLocaleString('en-US', { month: 'short' })
            const existingIndex = nextData.findIndex((item) => item.month === monthKey)

            if (existingIndex >= 0) {
                nextData[existingIndex] = {
                    ...nextData[existingIndex],
                    challans: nextData[existingIndex].challans + 1,
                    quantity: nextData[existingIndex].quantity + Number(row.totalQuantity || 0),
                }
            } else {
                nextData.push({ month: monthKey, challans: 1, quantity: Number(row.totalQuantity || 0) })
            }
        })

        return nextData
    }, [challans])

    const handleRowChange = (rowId, name, value) => {
        const normalizedValue = name === 'challanNumber' ? capitalizeFirstCharacter(value) : value

        setFormData((prev) => ({
            ...prev,
            rows: prev.rows.map((row) => (row.id === rowId ? { ...row, [name]: normalizedValue } : row)),
        }))
    }

    const handleAddRow = () => {
        setFormData((prev) => ({
            ...prev,
            rows: [...prev.rows, createEmptyChallanRow(quantityTypes[0] || '')],
        }))
    }

    const handleDeleteRow = (rowId) => {
        setFormData((prev) => {
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
            setFormData((prev) => ({
                ...prev,
                rows: prev.rows.map((row) => ({ ...row, quantityType: normalizedType })),
            }))
            return false
        }

        const updatedTypes = [...quantityTypes, normalizedType]
        setQuantityTypes(updatedTypes)
        window.localStorage.setItem('riyafashion-quantity-types', JSON.stringify(updatedTypes))
        setFormData((prev) => ({
            ...prev,
            rows: prev.rows.map((row) => ({ ...row, quantityType: row.quantityType || normalizedType })),
        }))
        setMessage(`"${normalizedType}" quantity type was added.`)
        return true
    }

    const handleRemoveType = (typeName) => {
        if (quantityTypes.length <= 1) {
            setMessage('At least one quantity type is required.')
            return
        }

        const updatedTypes = quantityTypes.filter((type) => type !== typeName)
        setQuantityTypes(updatedTypes)
        window.localStorage.setItem('riyafashion-quantity-types', JSON.stringify(updatedTypes))

        setFormData((prev) => ({
            ...prev,
            rows: prev.rows.map((row) => ({
                ...row,
                quantityType: row.quantityType === typeName ? updatedTypes[0] : row.quantityType,
            })),
        }))

        setMessage(`"${typeName}" quantity type was removed.`)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const normalizedRows = formData.rows.map((row) => ({
            ...row,
            totalQuantity: Number(row.totalQuantity),
            selectedParty: parties.find((party) => party.id === row.partyId),
        }))

        const hasInvalidRow = normalizedRows.some(
            (row) =>
                !row.selectedParty ||
                !row.quantityType ||
                !row.challanDate ||
                !row.challanNumber ||
                row.totalQuantity <= 0,
        )

        if (hasInvalidRow) {
            setMessage('Please fill party, type, total quantity, date, and challan number.')
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

        setMessage('Challan added successfully.')
        setFormData(createInitialForm(quantityTypes[0] || ''))
    }

    return (
        <>
            <StatsCards metrics={metrics} />

            <section className="grid grid-cols-1 gap-4">
                <DataEntryForm
                    formData={formData}
                    message={message}
                    parties={parties}
                    quantityTypes={quantityTypes}
                    onRowChange={handleRowChange}
                    onSubmit={handleSubmit}
                    onAddRow={handleAddRow}
                    onDeleteRow={handleDeleteRow}
                    onAddType={handleAddType}
                    onRemoveType={handleRemoveType}
                    onAddParty={() => navigate('/settings')}
                />
                <AnalyticsCharts monthlyData={monthlyData} />
            </section>

            <RecentEntriesTable records={challans} />
        </>
    )
}

function Dashboard({ parties, challans, setChallans }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col gap-4">

                <HeroSection />
                <DashboardHome parties={parties} challans={challans} setChallans={setChallans} />
            </div>
        </motion.div>

    )
}

export default Dashboard
