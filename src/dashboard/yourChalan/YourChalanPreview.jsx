import { amountToWords, getRowAmount, getRowTotalPieces, getYourChalanTotals } from './yourChalanUtils'
import { formatDisplayDate } from '../utils/formatDate'

function YourChalanPreview({ chalan }) {
  const totals = getYourChalanTotals(chalan.rows || [])

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3">
      <div className="min-w-[980px] border-2 border-black bg-white font-sans text-black">
        <div className="border-b-2 border-black bg-zinc-300 px-4 py-2 text-center text-3xl font-semibold tracking-wide">
          {chalan.companyName}
        </div>
        <div className="relative border-b border-black px-4 py-1 text-center text-lg">
          <span>{chalan.address}</span>
          <span className="absolute right-4 top-1">{chalan.phone}</span>
        </div>
        <div className="border-b border-black px-4 py-1 text-center text-lg">Mo:-{chalan.mobile}</div>
        <div className="relative border-b border-black px-4 py-1 text-center text-xl">
          <span>CHALLAN</span>
          <span className="absolute right-4 top-1">{chalan.copyType || 'Original'}</span>
        </div>

        <div className="grid grid-cols-[1fr_350px] border-b border-black">
          <div className="min-h-28 px-3 py-2 text-lg">
            <div className="flex gap-3">
              <span>M/s.</span>
              <strong className="text-2xl font-medium">{chalan.partyName || 'PARTY NAME'}</strong>
            </div>
            <div className="ml-20 mt-1 text-base">{chalan.partyAddress}</div>
            <div className="mt-7">Mo No.: {chalan.partyMobile}</div>
          </div>
          <div className="border-l border-black text-xl">
            <div className="bg-zinc-300 px-3 py-2">
              <div>Challan No. : {chalan.chalanNumber}</div>
              <div>Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{formatDisplayDate(chalan.chalanDate)}</div>
            </div>
            <div className="border-t border-black px-3 py-2">Broker&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{chalan.broker}</div>
          </div>
        </div>

        <table className="w-full border-collapse text-lg">
          <thead>
            <tr>
              {['Inward Ch.No', 'Inward Ch.Date', 'Description', 'Design No', 'Plain', 'Short', 'Work', 'Sample', 'Total Pcs.', 'Rate', 'Amount'].map((heading) => (
                <th key={heading} className="border-b border-r border-black px-1 py-1 font-medium last:border-r-0">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(chalan.rows || []).map((row) => (
              <tr key={row.id}>
                <td className="border-r border-black px-1 py-1">{row.inwardChallanNumber}</td>
                <td className="border-r border-black px-1 py-1">{formatDisplayDate(row.inwardChallanDate)}</td>
                <td className="border-r border-black px-1 py-1">{row.description}</td>
                <td className="border-r border-black px-1 py-1">{row.designNumber}</td>
                <td className="border-r border-black px-1 py-1 text-right">{row.plain}</td>
                <td className="border-r border-black px-1 py-1 text-right">{row.short}</td>
                <td className="border-r border-black px-1 py-1 text-right">{row.work}</td>
                <td className="border-r border-black px-1 py-1 text-right">{row.sample}</td>
                <td className="border-r border-black px-1 py-1 text-right">{getRowTotalPieces(row)}</td>
                <td className="border-r border-black px-1 py-1 text-right">{row.rate}</td>
                <td className="px-1 py-1 text-right">{getRowAmount(row).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="h-16">
              <td className="border-r border-black" />
              <td className="border-r border-black" />
              <td className="border-r border-black" />
              <td className="border-r border-black" />
              <td className="border-r border-black" />
              <td className="border-r border-black" />
              <td className="border-r border-black" />
              <td className="border-r border-black" />
              <td className="border-r border-black" />
              <td className="border-r border-black" />
              <td />
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="border-t border-r border-black px-1 py-1">PAN NO. : {chalan.panNumber}</td>
              <td className="border-t border-r border-black px-1 py-1 text-right">Total</td>
              <td className="border-t border-r border-black px-1 py-1 text-right">{totals.plain || ''}</td>
              <td className="border-t border-r border-black px-1 py-1 text-right">{totals.short || ''}</td>
              <td className="border-t border-r border-black px-1 py-1 text-right">{totals.work || ''}</td>
              <td className="border-t border-r border-black px-1 py-1 text-right">{totals.sample || ''}</td>
              <td className="border-t border-r border-black px-1 py-1 text-right">{totals.totalPieces}</td>
              <td className="border-t border-r border-black" />
              <td className="border-t border-black px-1 py-1 text-right">{totals.amount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="grid grid-cols-[1fr_350px] border-t border-black">
          <div className="px-2 py-2 text-sm">
            <strong>Rs. (in words) : </strong>
            {amountToWords(totals.amount)}
          </div>
          <div className="border-l border-black bg-zinc-300 px-2 py-2 text-xl">
            <span>Gross Amount</span>
            <span className="float-right">{totals.amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_350px] border-t border-black px-4 py-3">
          <div style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <div className="text-xl">Terms & Condition :</div>
            {(chalan.terms || []).map((term, index) => (
              <div key={`${term}-${index}`} className="text-base leading-6">{index + 1}.&nbsp;&nbsp;{term}</div>
            ))}
          </div>
          <div className="text-right text-xl">For, {chalan.companyName}</div>
        </div>
        <div className="grid grid-cols-2 px-8 pb-2 pt-4 text-base italic">
          <span className="text-center">Receiver Sign</span>
          <span className="text-right">(Authorised Signatory)</span>
        </div>
      </div>
    </div>
  )
}

export default YourChalanPreview
