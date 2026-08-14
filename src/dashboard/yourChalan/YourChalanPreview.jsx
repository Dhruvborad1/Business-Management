import { amountToWords, getRowAmount, getRowTotalPieces, getYourChalanTotals } from './yourChalanUtils'
import { formatDisplayDate } from '../utils/formatDate'

const ChalanDocument = ({ chalan, totals, className = '' }) => (
  <div className={`min-w-[980px] print:min-w-[750px] border-2 border-black bg-white font-sans text-black print:break-inside-avoid print:page-break-inside-avoid ${className}`}>
    <div className="border-b-2 border-black bg-zinc-300 px-4 py-2 print:py-1 text-center text-3xl print:text-2xl font-semibold tracking-wide">
      {chalan.companyName}
    </div>
    <div className="flex items-center justify-between gap-4 border-b border-black px-4 py-1 print:py-0 text-lg print:text-sm">
      <span className="truncate text-left">{chalan.address}</span>
      <span className="whitespace-nowrap text-right">{chalan.phone}</span>
    </div>
    <div className="border-b border-black px-4 py-1 print:py-0 text-center text-lg print:text-sm">Mo:-{chalan.mobile}</div>
    <div className="relative border-b border-black px-4 py-1 print:py-0 text-center text-xl print:text-base font-semibold">
      <span>CHALLAN</span>
      <span className="absolute right-4 top-1 print:top-0">{chalan.copyType}</span>
    </div>

    <div className="grid grid-cols-[1fr_350px] print:grid-cols-[1fr_250px] border-b border-black">
      <div className="px-3 py-2 print:py-1 text-lg print:text-sm">
        <div className="flex gap-3">
          <span>M/s.</span>
          <strong className="text-2xl print:text-lg font-medium">{chalan.partyName || 'PARTY NAME'}</strong>
        </div>
        <div className="ml-20 print:ml-10 mt-1 print:mt-0 text-base print:text-xs">{chalan.partyAddress}</div>
        <div className="mt-4 print:mt-1">Mo No.: {chalan.partyMobile}</div>
      </div>
      <div className="border-l border-black text-xl print:text-sm">
        <div className="bg-zinc-300 px-3 py-2 print:py-1">
          <div>Challan No. : {chalan.chalanNumber}</div>
          <div>Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{formatDisplayDate(chalan.chalanDate)}</div>
        </div>
        <div className="border-t border-black px-3 py-2 print:py-1">Broker&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{chalan.broker}</div>
      </div>
    </div>

    <table className="w-full border-collapse text-lg print:text-[11px]">
      <thead>
        <tr>
          {['Inward Ch.No', 'Inward Ch.Date', 'Description', 'Design No', 'Plain', 'Short', 'Work', 'Sample', 'Total Pcs.', 'Rate', 'Amount'].map((heading) => (
            <th key={heading} className="border-b border-r border-black px-1 py-1 print:py-0.5 font-medium last:border-r-0">
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(chalan.rows || []).map((row) => (
          <tr key={row.id} className="h-[32px] print:h-[22px]">
            <td className="border-r border-black px-1">{row.inwardChallanNumber}</td>
            <td className="border-r border-black px-1">{formatDisplayDate(row.inwardChallanDate)}</td>
            <td className="border-r border-black px-1">{row.description}</td>
            <td className="border-r border-black px-1">{row.designNumber}</td>
            <td className="border-r border-black px-1 text-right">{row.plain}</td>
            <td className="border-r border-black px-1 text-right">{row.short}</td>
            <td className="border-r border-black px-1 text-right">{row.work}</td>
            <td className="border-r border-black px-1 text-right">{row.sample}</td>
            <td className="border-r border-black px-1 text-right font-medium">{getRowTotalPieces(row)}</td>
            <td className="border-r border-black px-1 text-right">{row.rate}</td>
            <td className="px-1 text-right font-medium">{(getRowAmount(row) ? getRowAmount(row).toFixed(2) : '')}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="3" className="border-t border-r border-black px-1 py-1 print:py-0.5 font-medium">PAN NO. : {chalan.panNumber}</td>
          <td className="border-t border-r border-black px-1 py-1 print:py-0.5 text-right font-bold">Total</td>
          <td className="border-t border-r border-black px-1 py-1 print:py-0.5 text-right font-medium">{totals.plain || ''}</td>
          <td className="border-t border-r border-black px-1 py-1 print:py-0.5 text-right font-medium">{totals.short || ''}</td>
          <td className="border-t border-r border-black px-1 py-1 print:py-0.5 text-right font-medium">{totals.work || ''}</td>
          <td className="border-t border-r border-black px-1 py-1 print:py-0.5 text-right font-medium">{totals.sample || ''}</td>
          <td className="border-t border-r border-black px-1 py-1 print:py-0.5 text-right font-bold">{totals.totalPieces}</td>
          <td className="border-t border-r border-black" />
          <td className="border-t border-black px-1 py-1 print:py-0.5 text-right font-bold">{totals.amount.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>

    <div className="grid grid-cols-[1fr_350px] print:grid-cols-[1fr_250px] border-t border-black">
      <div className="px-2 py-2 print:py-1 text-sm print:text-xs">
        <strong>Rs. (in words) : </strong>
        {amountToWords(totals.amount)}
      </div>
      <div className="border-l border-black bg-zinc-300 px-2 py-2 print:py-1 text-xl print:text-sm font-semibold">
        <span>Gross Amount</span>
        <span className="float-right">{totals.amount.toFixed(2)}</span>
      </div>
    </div>

    <div className="grid grid-cols-[1fr_350px] print:grid-cols-[1fr_250px] border-t border-black px-4 py-3 print:px-2 print:py-1">
      <div style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        <div className="text-xl print:text-sm font-medium">Terms & Condition :</div>
        {(chalan.terms || []).map((term, index) => (
          <div key={`${term}-${index}`} className="text-base print:text-[10px] leading-6 print:leading-tight">{index + 1}.&nbsp;&nbsp;{term}</div>
        ))}
      </div>
      <div className="text-right text-xl print:text-sm font-medium">For, {chalan.companyName}</div>
    </div>
    <div className="grid grid-cols-2 px-8 pb-2 pt-4 print:pb-1 print:pt-1 text-base print:text-[11px] italic">
      <span className="text-center">Receiver Sign</span>
      <span className="text-right">(Authorised Signatory)</span>
    </div>
  </div>
)

function YourChalanPreview({ chalan }) {
  const totals = getYourChalanTotals(chalan.rows || [])
  const allRows = chalan.rows || []

  // Chunk rows for print view (max 10 per page), no empty padding
  const rowChunks = []
  for (let i = 0; i < Math.max(1, allRows.length); i += 10) {
    const chunk = allRows.slice(i, i + 10)
    rowChunks.push(chunk)
  }

  return (
    <>
      <style type="text/css">
        {`
          @media print {
            @page {
              size: A4 portrait;
              margin: 8mm 5mm;
            }
          }
        `}
      </style>
      
      {/* SCREEN VIEW */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 print:hidden">
        <ChalanDocument
          chalan={{ ...chalan, rows: allRows }}
          totals={totals}
        />
      </div>

      {/* PRINT VIEW - Iterates chunks (pages), 2 copies per page */}
      <div className="hidden print:block print:w-full">
        {rowChunks.map((chunk, index) => (
          <div 
            key={index} 
            className="print:flex print:flex-col print:justify-start print:w-full print:gap-4 print:page-break-after-always"
          >
            {/* First Copy (Original) */}
            <ChalanDocument
              chalan={{ ...chalan, rows: chunk, copyType: chalan.copyType || 'Original' }}
              totals={totals}
              className="print:w-full print:border-2 print:border-black"
            />

            {/* Cut Line */}
            <div className="w-full border-t border-dashed border-slate-400" />

            {/* Second Copy (Duplicate) */}
            <ChalanDocument
              chalan={{ ...chalan, rows: chunk, copyType: 'Duplicate' }}
              totals={totals}
              className="print:w-full print:border-2 print:border-black"
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default YourChalanPreview
