export const createInitialBillForm = () => ({
  billNumber: '',
  billDate: new Date().toISOString().split('T')[0],
  partyId: '',
  partyName: '',
  partyAddress: '',
  partyMobile: '',
  broker: '',
  copyType: 'Original',
  companyName: 'RIYA FASHION',
  address: '1,2 1ST FLOOR,KRISHNA IND BEHIND HARI OM MILL VED ROAD,SURAT',
  phone: '9574336917',
  mobile: '93757 02200 - 99982 09649',
  panNumber: '',
  companyGstin: '24APDPB5367B1ZG',
  partyGstin: '',
  discountAmount: '0',
  discountPercent: '9',
  cgstAmount: '0',
  sgstAmount: '0',
  cgstPercent: '2.50',
  sgstPercent: '2.50',
  terms: ['Goods Once Sold Will Not Be Accepted.', '"Subject to "SURAT" Jurisdiction Only.  E.&.O.E"'],
  rows: [createEmptyBillRow()],
})

export const createEmptyBillRow = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  description: '',
  designNumber: '',
  plain: '',
  short: '',
  work: '',
  sample: '',
  rate: '',
})

export const getBillRowTotalPieces = (row) => ['plain', 'short', 'work', 'sample'].reduce((sum, key) => sum + Number(row[key] || 0), 0)

export const getBillRowAmount = (row) => {
  const work = Number(row.work || 0)
  const sample = Number(row.sample || 0)
  return (work + sample) * Number(row.rate || 0)
}

export const getBillTotals = (rows = []) =>
  rows.reduce(
    (totals, row) => ({
      plain: totals.plain + Number(row.plain || 0),
      short: totals.short + Number(row.short || 0),
      work: totals.work + Number(row.work || 0),
      sample: totals.sample + Number(row.sample || 0),
      quantity: totals.quantity + getBillRowTotalPieces(row),
      amount: totals.amount + getBillRowAmount(row),
    }),
    { plain: 0, short: 0, work: 0, sample: 0, quantity: 0, amount: 0 },
  )

export const validateBillForm = (formData = {}) => {
  const missingFields = []

  if (!String(formData.partyName || '').trim()) {
    missingFields.push('Party Name')
  }

  if (!String(formData.partyAddress || '').trim()) {
    missingFields.push('Party Address')
  }

  if (!String(formData.partyMobile || '').trim()) {
    missingFields.push('Party Mobile')
  }

  if (!String(formData.partyGstin || '').trim()) {
    missingFields.push('Party GSTIN NO')
  }

  if (!String(formData.discountPercent ?? '').trim()) {
    missingFields.push('Discount %')
  }

  if (!String(formData.cgstPercent ?? '').trim()) {
    missingFields.push('CGST %')
  }

  if (!String(formData.sgstPercent ?? '').trim()) {
    missingFields.push('SGST %')
  }

  if (!Array.isArray(formData.rows) || formData.rows.length === 0) {
    missingFields.push('Party Challans')
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  }
}
