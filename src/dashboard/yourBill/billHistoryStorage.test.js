import test from 'node:test'
import assert from 'node:assert/strict'
import { createBillHistoryRecord, getBillNumberSequence, groupBillsByParty } from './billHistoryStorage.js'

test('createBillHistoryRecord stores the party and bill summary', () => {
  const bill = createBillHistoryRecord({
    partyId: 'party-1',
    partyName: 'ABC Traders',
    billDate: '2026-07-15',
    rows: [{ description: 'Fabric', work: '2', sample: '1', rate: '100' }],
  }, [])

  assert.equal(bill.partyName, 'ABC Traders')
  assert.equal(bill.billNumber, '1/26')
  assert.equal(bill.totalQuantity, 3)
  assert.equal(bill.totalAmount, 300)
  assert.ok(bill.id)
})

test('getBillNumberSequence increments within the same year and resets next year', () => {
  const bills = [
    createBillHistoryRecord({ partyName: 'ABC Traders', billDate: '2026-01-10', rows: [] }, []),
    createBillHistoryRecord({ partyName: 'ABC Traders', billDate: '2026-02-10', rows: [] }, []),
  ]

  assert.equal(getBillNumberSequence(bills, '2026-03-10'), 2)
  assert.equal(getBillNumberSequence(bills, '2027-01-10'), 1)
})

test('groupBillsByParty groups bills under the correct party', () => {
  const bills = [
    createBillHistoryRecord({ partyId: 'party-1', partyName: 'ABC Traders', billDate: '2026-01-10', rows: [] }, []),
    createBillHistoryRecord({ partyId: 'party-1', partyName: 'ABC Traders', billDate: '2026-02-10', rows: [] }, []),
    createBillHistoryRecord({ partyId: 'party-2', partyName: 'XYZ Fashion', billDate: '2026-03-10', rows: [] }, []),
  ]

  const groups = groupBillsByParty(bills)

  assert.equal(groups['ABC Traders'].length, 2)
  assert.equal(groups['XYZ Fashion'].length, 1)
})
