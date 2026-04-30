import { formatDisplayDate } from '../utils/formatDate'

function RecentEntriesTable({ records }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
      <h2 className="text-lg font-semibold text-slate-900">Recent Challans</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600">
              <th className="px-3 py-2 font-semibold">Challan No.</th>
              <th className="px-3 py-2 font-semibold">Party</th>
              <th className="px-3 py-2 font-semibold">Type</th>
              <th className="px-3 py-2 font-semibold">Total Qty</th>
              <th className="px-3 py-2 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-center text-slate-500" colSpan="5">
                  No challans yet. Add your first entry from the panel.
                </td>
              </tr>
            ) : (
              records.slice(0, 8).map((item) => (
                <tr key={item.id} className="border-b border-slate-100 text-slate-700">
                  <td className="px-3 py-2">{item.challanNumber}</td>
                  <td className="px-3 py-2">{item.partyName}</td>
                  <td className="px-3 py-2">{item.quantityType}</td>
                  <td className="px-3 py-2">{item.totalQuantity}</td>
                  <td className="px-3 py-2">{formatDisplayDate(item.challanDate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default RecentEntriesTable
