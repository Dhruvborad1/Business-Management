export const companyDefaults = {
  companyName: 'GURUKRUPA FASHION',
  address: '1,2 1ST FLOOR,KRISHNA IND BEHIND HARI OM MILL VED ROAD,SURAT',
  phone: '9574336917',
  mobile: '93757 02200 - 99982 09649',
  panNumber: '',
  terms: ['Goods Once Sold Will Not Be Accepted.', '"Subject to "SURAT" Jurisdiction Only.  E.&.O.E"'],
}

export const emptyYourChalanRow = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  inwardChallanNumber: '',
  inwardChallanDate: '',
  description: '',
  designNumber: '',
  plain: '',
  short: '',
  work: '',
  sample: '',
  rate: '',
})

export const getTodayDate = () => new Date().toISOString().split('T')[0]

export const getChalanYear = (dateValue) => {
  const parsedDate = dateValue ? new Date(dateValue) : new Date()
  return Number.isNaN(parsedDate.getTime()) ? new Date().getFullYear() : parsedDate.getFullYear()
}

export const getNextYourChalanNumber = (yourChalans, dateValue) => {
  const targetYear = getChalanYear(dateValue)
  const numbersForYear = yourChalans
    .filter((chalan) => Number(chalan.chalanYear) === targetYear || getChalanYear(chalan.chalanDate) === targetYear)
    .map((chalan) => Number(chalan.chalanNumber))
    .filter((number) => Number.isFinite(number))

  return numbersForYear.length === 0 ? 1 : Math.max(...numbersForYear) + 1
}

export const createInitialYourChalanForm = (yourChalans = []) => {
  const chalanDate = getTodayDate()

  return {
    ...companyDefaults,
    chalanNumber: getNextYourChalanNumber(yourChalans, chalanDate),
    chalanDate,
    copyType: 'Original',
    partyName: '',
    partyAddress: '',
    partyMobile: '',
    broker: '',
    rows: [emptyYourChalanRow()],
  }
}

export const getRowTotalPieces = (row) =>
  ['plain', 'short', 'work', 'sample'].reduce((sum, key) => sum + Number(row[key] || 0), 0)

export const getRowAmount = (row) => getRowTotalPieces(row) * Number(row.rate || 0)

export const getYourChalanTotals = (rows) =>
  rows.reduce(
    (totals, row) => ({
      plain: totals.plain + Number(row.plain || 0),
      short: totals.short + Number(row.short || 0),
      work: totals.work + Number(row.work || 0),
      sample: totals.sample + Number(row.sample || 0),
      totalPieces: totals.totalPieces + getRowTotalPieces(row),
      amount: totals.amount + getRowAmount(row),
    }),
    { plain: 0, short: 0, work: 0, sample: 0, totalPieces: 0, amount: 0 },
  )

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

const convertBelowThousand = (number) => {
  let words = ''

  if (number >= 100) {
    words += `${ones[Math.floor(number / 100)]} Hundred `
    number %= 100
  }

  if (number >= 20) {
    words += `${tens[Math.floor(number / 10)]} `
    number %= 10
  }

  if (number > 0) {
    words += `${ones[number]} `
  }

  return words.trim()
}

export const amountToWords = (amount) => {
  let number = Math.round(Number(amount || 0))

  if (number === 0) {
    return 'Zero Only'
  }

  const parts = []
  const crore = Math.floor(number / 10000000)
  number %= 10000000
  const lakh = Math.floor(number / 100000)
  number %= 100000
  const thousand = Math.floor(number / 1000)
  number %= 1000

  if (crore) parts.push(`${convertBelowThousand(crore)} Crore`)
  if (lakh) parts.push(`${convertBelowThousand(lakh)} Lakh`)
  if (thousand) parts.push(`${convertBelowThousand(thousand)} Thousand`)
  if (number) parts.push(convertBelowThousand(number))

  return `${parts.join(' ')} Only`
}
