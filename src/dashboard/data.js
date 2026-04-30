export const seedMonthlySales = [
  { month: 'Jan', challans: 16, quantity: 190 },
  { month: 'Feb', challans: 20, quantity: 225 },
  { month: 'Mar', challans: 22, quantity: 255 },
  { month: 'Apr', challans: 18, quantity: 214 },
  { month: 'May', challans: 24, quantity: 292 },
  { month: 'Jun', challans: 27, quantity: 326 },
]

export const getTodayDate = () => new Date().toISOString().split('T')[0]

export const createEmptyChallanRow = (defaultType = 'Saree') => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  partyId: '',
  quantityType: defaultType,
  totalQuantity: '',
  challanDate: getTodayDate(),
  challanNumber: '',
})

export const createInitialForm = (defaultType = 'Saree') => ({
  rows: [createEmptyChallanRow(defaultType)],
})

export const defaultQuantityTypes = ['Saree', 'Spare Part']
