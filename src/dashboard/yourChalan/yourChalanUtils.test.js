import test from 'node:test'
import assert from 'node:assert/strict'
import { buildQuantityUsage } from './yourChalanUtils.js'

test('buildQuantityUsage totals plain, short, work, and sample quantities for the same challan', () => {
  const rows = [
    {
      inwardChallanNumber: 'CH-100',
      plain: '2',
      short: '1',
      work: '3',
      sample: '4',
    },
  ]

  const usage = buildQuantityUsage(rows, 'party-1', (row, partyId) =>
    row.inwardChallanNumber ? `party:${partyId}:number:${row.inwardChallanNumber}` : '',
  )

  assert.equal(usage.get('party:party-1:number:CH-100')?.quantity, 10)
})
