import test from 'node:test'
import assert from 'node:assert/strict'
import { createInitialBillForm, getBillTotals } from './yourBillUtils.js'

test('createInitialBillForm includes GST and discount fields', () => {
  const form = createInitialBillForm()

  assert.equal(form.companyGstin, '')
  assert.equal(form.partyGstin, '')
  assert.equal(form.discountAmount, '')
  assert.equal(form.discountPercent, '2.50')
  assert.equal(form.cgstAmount, '')
  assert.equal(form.cgstPercent, '2.50')
  assert.equal(form.sgstAmount, '')
  assert.equal(form.sgstPercent, '2.50')
})

test('getBillTotals sums quantity and amount accurately', () => {
  const rows = [
    {
      description: 'Fabric',
      plain: '2',
      short: '1',
      work: '0',
      sample: '0',
      rate: '120',
    },
    {
      description: 'Thread',
      plain: '1',
      short: '1',
      work: '0',
      sample: '0',
      rate: '75',
    },
  ]

  const totals = getBillTotals(rows)

  assert.equal(totals.quantity, 5)
  assert.equal(totals.amount, 510)
})

test('getBillTotals charges rate only for work and sample pieces', () => {
  const rows = [
    {
      description: 'Sample Item',
      plain: '2',
      short: '1',
      work: '3',
      sample: '4',
      rate: '100',
    },
  ]

  const totals = getBillTotals(rows)

  assert.equal(totals.quantity, 10)
  assert.equal(totals.amount, 700)
})
