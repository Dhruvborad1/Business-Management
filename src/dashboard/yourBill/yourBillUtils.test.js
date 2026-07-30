import test from 'node:test'
import assert from 'node:assert/strict'
import { createInitialBillForm, getBillTotals, validateBillForm } from './yourBillUtils.js'

test('createInitialBillForm includes GST and discount fields', () => {
  const form = createInitialBillForm()

  assert.equal(form.companyGstin, '24APDPB5367B1ZG')
  assert.equal(form.partyGstin, '')
  assert.equal(form.discountAmount, '0')
  assert.equal(form.discountPercent, '9')
  assert.equal(form.cgstAmount, '0')
  assert.equal(form.cgstPercent, '2.50')
  assert.equal(form.sgstAmount, '0')
  assert.equal(form.sgstPercent, '2.50')
})

test('getBillTotals sums quantity and amount accurately', () => {
  const rows = [
    {
      description: 'Fabric',
      plain: '2',
      short: '1',
      work: '3',
      sample: '4',
      rate: '100',
    },
    {
      description: 'Thread',
      plain: '0',
      short: '0',
      work: '1',
      sample: '0',
      rate: '50',
    },
  ]

  const totals = getBillTotals(rows)

  assert.equal(totals.quantity, 11)
  assert.equal(totals.amount, 750)
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

test('validateBillForm only requires the requested bill fields', () => {
  const invalidForm = {
    partyName: '',
    partyAddress: 'A',
    partyMobile: 'B',
    partyGstin: 'C',
    discountPercent: '2.50',
    cgstPercent: '2.50',
    sgstPercent: '2.50',
    rows: [],
  }

  const invalidResult = validateBillForm(invalidForm)

  assert.equal(invalidResult.isValid, false)
  assert.deepEqual(invalidResult.missingFields, ['Party Name', 'Party Challans'])

  const validForm = {
    partyName: 'ABC',
    partyAddress: 'Address',
    partyMobile: '9876543210',
    partyGstin: '24AABCU9603R1ZX',
    discountPercent: '2.50',
    cgstPercent: '2.50',
    sgstPercent: '2.50',
    rows: [{ description: 'Fabric', rate: '100' }],
  }

  const validResult = validateBillForm(validForm)

  assert.equal(validResult.isValid, true)
  assert.deepEqual(validResult.missingFields, [])
})
