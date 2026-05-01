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

    setMessage('Party added successfully!')
    setFormData(emptyPartyForm)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="settings-form-container"
    >
      <h2 className="settings-form-title">Party Details</h2>
      <p className="settings-form-subtitle">Add new party/supplier information</p>

      {message && (
        <div className="settings-form-message">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-form-grid">
          <div className="settings-form-group">
            <label className="settings-form-label">Party Name *</label>
            <input
              type="text"
              name="partyName"
              value={formData.partyName}
              onChange={handleChange}
              className="settings-form-input"
              placeholder="Enter party name"
              required
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-form-label">Shop Name *</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              className="settings-form-input"
              placeholder="Enter shop name"
              required
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-form-label">GST Number *</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className="settings-form-input"
              placeholder="Enter GST number"
              required
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-form-label">Mobile Number *</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="settings-form-input"
              placeholder="Enter mobile number"
              required
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="settings-form-input"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-form-label">Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="settings-form-input"
              placeholder="Enter pincode"
              required
            />
          </div>

          <div className="settings-form-group full-width">
            <label className="settings-form-label">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="settings-form-input"
              placeholder="Enter address (optional)"
              rows="2"
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-form-label">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="settings-form-input"
              placeholder="Enter city"
              required
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-form-label">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="settings-form-input"
              placeholder="Enter state"
              required
            />
          </div>
        </div>

        <button type="submit" className="settings-form-button">
          Add Party
        </button>
      </form>
    </motion.div>
  )
}

export default PartyForm
