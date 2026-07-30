export const createBillHistoryRecord = (bill = {}) => {
  const rows = Array.isArray(bill.rows) ? bill.rows : []
  const totalQuantity = rows.reduce((sum, row) => sum + Number(row?.plain || 0) + Number(row?.short || 0) + Number(row?.work || 0) + Number(row?.sample || 0), 0)
  const totalAmount = rows.reduce((sum, row) => sum + (Number(row?.work || 0) + Number(row?.sample || 0)) * Number(row?.rate || 0), 0)

  return {
    id: bill.id || crypto.randomUUID(),
    partyId: bill.partyId || '',
    partyName: bill.partyName || '',
    billNumber: bill.billNumber || '',
    billDate: bill.billDate || '',
    createdAt: bill.createdAt || new Date().toISOString(),
    totalQuantity,
    totalAmount,
    rows,
    rawBill: bill.rawBill || bill,
  }
}

export const groupBillsByParty = (bills = []) => {
  return bills.reduce((groups, bill) => {
    const partyName = bill.partyName || 'Unknown Party'

    if (!groups[partyName]) {
      groups[partyName] = []
    }

    groups[partyName].push(bill)
    return groups
  }, {})
}
