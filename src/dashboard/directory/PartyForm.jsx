import { useState } from 'react'
import { motion } from 'framer-motion'

const emptyPartyForm = {
  partyName: '',
  shopName: '',
  gstNumber: '',
  pincode: '',
  mobileNumber: '',
  email: '',
  address: '',
  city: '',
  state: '',
}

const capitalizeFirstCharacter = (value) => {
  if (!value) {
    return value
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

function PartyForm({ setParties }) {
  const [formData, setFormData] = useState({
    ...emptyPartyForm,
  })

  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState('info')

  const handleChange = (e) => {
    const { name, value } = e.target
    const shouldCapitalize = ['partyName', 'shopName', 'address', 'city', 'state'].includes(name)

    setFormData((prev) => ({
      ...prev,
      [name]: shouldCapitalize ? capitalizeFirstCharacter(value) : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.partyName || !formData.shopName || !formData.gstNumber ||
      !formData.pincode || !formData.mobileNumber || !formData.email ||
      !formData.city || !formData.state) {
      setMessageTone('error')
      setMessage('Please fill all required fields.')
      return
    }

    setParties((prev) => [
      {
        id: crypto.randomUUID(),
        ...formData,
      },
      ...prev,
    ])

    setMessageTone('success')
    setMessage('Party added successfully!')
    setFormData(emptyPartyForm)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="directory-form-container"
    >
      <h2 className="directory-form-title">Party Details</h2>
      <p className="directory-form-subtitle">Add new party/supplier information</p>

      <form onSubmit={handleSubmit} className="directory-form">
        <div className="directory-form-grid">
          <div className="directory-form-group">
            <label className="directory-form-label">Party Name *</label>
            <input
              type="text"
              name="partyName"
              value={formData.partyName}
              onChange={handleChange}
              className="directory-form-input"
              placeholder="Enter party name"
              required
            />
          </div>

          <div className="directory-form-group">
            <label className="directory-form-label">Shop Name *</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              className="directory-form-input"
              placeholder="Enter shop name"
              required
            />
          </div>

          <div className="directory-form-group">
            <label className="directory-form-label">GST Number *</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className="directory-form-input"
              placeholder="Enter GST number"
              required
            />
          </div>

          <div className="directory-form-group">
            <label className="directory-form-label">Mobile Number *</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="directory-form-input"
              placeholder="Enter mobile number"
              required
            />
          </div>

          <div className="directory-form-group">
            <label className="directory-form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="directory-form-input"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="directory-form-group">
            <label className="directory-form-label">Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="directory-form-input"
              placeholder="Enter pincode"
              required
            />
          </div>

          <div className="directory-form-group full-width">
            <label className="directory-form-label">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="directory-form-input"
              placeholder="Enter address (optional)"
              rows="2"
            />
          </div>

          <div className="directory-form-group">
            <label className="directory-form-label">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="directory-form-input"
              placeholder="Enter city"
              required
            />
          </div>

          <div className="directory-form-group">
            <label className="directory-form-label">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="directory-form-input"
              placeholder="Enter state"
              required
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="submit"
            className="w-full sm:w-40 md:w-44 lg:w-48 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Add Party
          </button>
        </div>

        {message && (
          <div className={`mt-3 rounded-xl border px-4 py-3 text-sm ${messageTone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
            {message}
          </div>
        )}
      </form>
    </motion.div>
  )
}

export default PartyForm
