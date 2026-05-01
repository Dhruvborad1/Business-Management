import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi'

const createEditableParty = (party) => ({
  partyName: party.partyName || '',
  shopName: party.shopName || '',
  gstNumber: party.gstNumber || '',
  mobileNumber: party.mobileNumber || '',
  email: party.email || '',
  pincode: party.pincode || '',
  city: party.city || '',
  state: party.state || '',
  address: party.address || '',
})

function PartyList({ parties, setParties }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [partyToDelete, setPartyToDelete] = useState(null)

  const filteredParties = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return parties
    }

    return parties.filter((party) => party.partyName.toLowerCase().includes(normalizedSearch))
  }, [parties, searchTerm])

  const [selectedPartyId, setSelectedPartyId] = useState(null)

  const selectedParty = useMemo(() => {
    if (filteredParties.length === 0) {
      return null
    }

    if (selectedPartyId) {
      return filteredParties.find((party) => party.id === selectedPartyId) || null
    }

    return filteredParties[0] || null
  }, [filteredParties, selectedPartyId])

  useEffect(() => {
    if (!selectedParty) {
      setIsEditing(false)
      setEditForm(null)
      return
    }

    if (isEditing) {
      setEditForm(createEditableParty(selectedParty))
    }
  }, [selectedParty, isEditing])

  const handleEditStart = () => {
    if (!selectedParty) {
      return
    }

    setEditForm(createEditableParty(selectedParty))
    setIsEditing(true)
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSave = () => {
    if (!selectedParty || !editForm) {
      return
    }

    setParties((prev) =>
      prev.map((party) => (party.id === selectedParty.id ? { ...party, ...editForm } : party)),
    )
    setIsEditing(false)
  }

  const handleDeleteConfirm = () => {
    if (!partyToDelete) {
      return
    }

    setParties((prev) => prev.filter((party) => party.id !== partyToDelete.id))
    setPartyToDelete(null)
    setIsEditing(false)
    setEditForm(null)
    setSelectedPartyId(null)
  }

  if (parties.length === 0) {
    return (
      <div className="party-list-empty">
        <div className="party-list-empty-shell">
          <h2 className="party-list-title">Party List</h2>
          <p className="party-list-subtitle">Added parties will appear here once you save them from the form.</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="party-list-section"
    >
      <div className="party-list-header">
        <div>
          <h2 className="party-list-title">Party List</h2>
          <p className="party-list-subtitle">Search by party name and click any row to view full details.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
          <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">Total Parties</span>
          <strong className="text-base text-slate-900">{parties.length}</strong>
        </div>
      </div>

      <div className="party-list-toolbar">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="party-list-search"
          placeholder="Search by party name"
        />
      </div>

      <div className="party-table-wrapper">
        <table className="party-table">
          <thead>
            <tr>
              <th>Party Name</th>
              <th>Shop Name</th>
              <th>GST Number</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Pincode</th>
              <th>City</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {filteredParties.map((party, index) => (
              <motion.tr
                key={party.id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={selectedParty?.id === party.id ? 'party-table-row-active' : ''}
                onClick={() => setSelectedPartyId(party.id)}
              >
                <td data-label="Party Name">{party.partyName}</td>
                <td data-label="Shop Name">{party.shopName}</td>
                <td data-label="GST Number">{party.gstNumber}</td>
                <td data-label="Mobile">{party.mobileNumber}</td>
                <td data-label="Email">{party.email}</td>
                <td data-label="Pincode">{party.pincode}</td>
                <td data-label="City">{party.city}</td>
                <td data-label="State">{party.state}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredParties.length === 0 && (
        <div className="party-list-empty-result">
          <p>No party found for this search.</p>
        </div>
      )}

      {selectedParty && (
        <motion.div
          key={selectedParty.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="party-detail-panel"
        >
          <div className="party-detail-header">
            <div>
              <h3 className="party-detail-title">{selectedParty.partyName}</h3>
              <p className="party-detail-subtitle">{selectedParty.shopName}</p>
            </div>
            <div className="party-detail-actions">
              <button type="button" onClick={handleEditStart} className="party-detail-action-btn">
                <FiEdit2 size={15} />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setPartyToDelete(selectedParty)}
                className="party-detail-action-btn party-detail-action-btn-danger"
              >
                <FiTrash2 size={15} />
                Delete
              </button>
            </div>
          </div>

          {isEditing && editForm ? (
            <div className="party-edit-grid">
              <label className="party-edit-field">
                <span className="party-detail-label">Party Name</span>
                <input name="partyName" value={editForm.partyName} onChange={handleEditChange} className="party-edit-input" />
              </label>
              <label className="party-edit-field">
                <span className="party-detail-label">Shop Name</span>
                <input name="shopName" value={editForm.shopName} onChange={handleEditChange} className="party-edit-input" />
              </label>
              <label className="party-edit-field">
                <span className="party-detail-label">GST Number</span>
                <input name="gstNumber" value={editForm.gstNumber} onChange={handleEditChange} className="party-edit-input" />
              </label>
              <label className="party-edit-field">
                <span className="party-detail-label">Mobile</span>
                <input name="mobileNumber" value={editForm.mobileNumber} onChange={handleEditChange} className="party-edit-input" />
              </label>
              <label className="party-edit-field">
                <span className="party-detail-label">Email</span>
                <input name="email" value={editForm.email} onChange={handleEditChange} className="party-edit-input" />
              </label>
              <label className="party-edit-field">
                <span className="party-detail-label">Pincode</span>
                <input name="pincode" value={editForm.pincode} onChange={handleEditChange} className="party-edit-input" />
              </label>
              <label className="party-edit-field">
                <span className="party-detail-label">City</span>
                <input name="city" value={editForm.city} onChange={handleEditChange} className="party-edit-input" />
              </label>
              <label className="party-edit-field">
                <span className="party-detail-label">State</span>
                <input name="state" value={editForm.state} onChange={handleEditChange} className="party-edit-input" />
              </label>
              <label className="party-edit-field party-edit-field-wide">
                <span className="party-detail-label">Address</span>
                <textarea name="address" value={editForm.address} onChange={handleEditChange} className="party-edit-input party-edit-textarea" rows="3" />
              </label>
              <div className="party-edit-actions">
                <button type="button" onClick={() => setIsEditing(false)} className="party-detail-action-btn">
                  Cancel
                </button>
                <button type="button" onClick={handleEditSave} className="party-detail-action-btn party-detail-action-btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="party-detail-grid">
                <div className="party-detail-item">
                  <span className="party-detail-label">GST Number</span>
                  <strong className="party-detail-value">{selectedParty.gstNumber}</strong>
                </div>
                <div className="party-detail-item">
                  <span className="party-detail-label">Mobile</span>
                  <strong className="party-detail-value">{selectedParty.mobileNumber}</strong>
                </div>
                <div className="party-detail-item">
                  <span className="party-detail-label">Email</span>
                  <strong className="party-detail-value">{selectedParty.email}</strong>
                </div>
                <div className="party-detail-item">
                  <span className="party-detail-label">Pincode</span>
                  <strong className="party-detail-value">{selectedParty.pincode}</strong>
                </div>
                <div className="party-detail-item">
                  <span className="party-detail-label">City</span>
                  <strong className="party-detail-value">{selectedParty.city}</strong>
                </div>
                <div className="party-detail-item">
                  <span className="party-detail-label">State</span>
                  <strong className="party-detail-value">{selectedParty.state}</strong>
                </div>
                <div className="party-detail-item party-detail-item-wide">
                  <span className="party-detail-label">Address</span>
                  <strong className="party-detail-value">{selectedParty.address || 'N/A'}</strong>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {partyToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="party-modal-backdrop"
            >
              <div className="party-modal-shell">
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className="party-modal"
                >
                  <button
                    type="button"
                    onClick={() => setPartyToDelete(null)}
                    className="party-modal-close"
                    aria-label="Close confirmation"
                  >
                    <FiX size={18} />
                  </button>
                  <div className="party-modal-icon">
                    <FiTrash2 size={20} />
                  </div>
                  <h3 className="party-modal-title">Delete Party?</h3>
                  <p className="party-modal-text">
                    Are you sure you want to delete <strong>{partyToDelete.partyName}</strong>? This action cannot be undone.
                  </p>
                  <div className="party-modal-actions">
                    <button type="button" onClick={() => setPartyToDelete(null)} className="party-detail-action-btn">
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteConfirm}
                      className="party-detail-action-btn party-detail-action-btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default PartyList
