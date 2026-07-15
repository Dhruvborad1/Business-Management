import { amountToWords } from '../yourChalan/yourChalanUtils'
import { formatDisplayDate } from '../utils/formatDate'
import { getBillTotals } from './yourBillUtils' 

function YourBillPreview({ bill }) {
  const totals = getBillTotals(bill?.rows || [])
  
  const percentValue = Number(bill?.discountPercent || 0)
  const explicitAmount = Number(bill?.discountAmount || 0)
  const discountPercent = percentValue > 0 ? percentValue : totals.amount > 0 ? Number(((explicitAmount / totals.amount) * 100).toFixed(2)) : 0
  const discountAmount = percentValue > 0 ? (totals.amount * percentValue) / 100 : explicitAmount
  const taxableAmount = totals.amount - discountAmount
  const cgstPercent = Number(bill?.cgstPercent || 0)
  const sgstPercent = Number(bill?.sgstPercent || 0)
  const cgstAmount = cgstPercent > 0 ? (taxableAmount * cgstPercent) / 100 : Number(bill?.cgstAmount || 0)
  const sgstAmount = sgstPercent > 0 ? (taxableAmount * sgstPercent) / 100 : Number(bill?.sgstAmount || 0)
  const finalBillAmount = bill?.finalBillAmount || (taxableAmount + cgstAmount + sgstAmount)

  // ટેબલની અંદરના દરેક કોલમ માટે ટોટલ ગણતરી
  const tableTotals = (bill?.rows || []).reduce((acc, row) => {
    const plain = Number(row.plain || 0);
    const short = Number(row.short || 0);
    const work = Number(row.work || 0);
    const sample = Number(row.sample || 0);
    
    const totalPcs = plain + short + work + sample;
    const billableQuantity = work + sample;
    const rowAmount = billableQuantity * Number(row.rate || 0);

    return {
      plain: acc.plain + plain,
      short: acc.short + short,
      work: acc.work + work,
      sample: acc.sample + sample,
      totalPcs: acc.totalPcs + totalPcs,
      amount: acc.amount + rowAmount
    };
  }, { plain: 0, short: 0, work: 0, sample: 0, totalPcs: 0, amount: 0 });

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3">
      <div className="min-w-[980px] border-2 border-black bg-white font-sans text-black">
        
        {/* Header Section */}
        <div className="border-b-2 border-black bg-zinc-100 px-4 py-2 text-center text-3xl font-bold tracking-wide">
          {bill?.companyName || 'GURUKRUPA FASHION'}
        </div>
        <div className="relative border-b border-black px-4 py-1 text-center text-base font-medium">
          <span>{bill?.address || '1,2 1ST FLOOR, KRISHNA IND BEHIND HARI OM MILL VED ROAD, SURAT'}</span>
        </div>
        <div className="border-b border-black px-4 py-1 text-center text-base font-medium">
          Mo:- {bill?.mobile || '93757 02200 - 99982 09649'}
        </div>
        <div className="relative border-b border-black px-4 py-1 text-center text-xl font-bold">
          <span>TAX INVOICE</span>
          <span className="absolute right-4 top-1 text-base font-normal italic">{bill?.copyType || 'Original'}</span>
        </div>

        {/* Party Details & Bill Details */}
        <div className="grid grid-cols-[1fr_380px] border-b border-black">
          <div className="min-h-28 px-3 py-2 text-base">
            <div className="flex gap-1">
              <span className="font-semibold">M/s.</span>
              <div className="ml-2">
                <strong className="text-xl font-bold">{bill?.partyName || 'OMEGA DESIGNER'}</strong>
                <div className="mt-1 text-sm whitespace-pre-line">{bill?.partyAddress || 'NO-103 MILLUM.2.TEXTILE MARKET\nSURAT'}</div>
              </div>
            </div>
            <div className="mt-4 font-semibold">Place of Supply: {bill?.placeOfSupply || '24-Gujarat'}</div>
            <div className="mt-1 font-semibold">GSTIN No.: {bill?.partyGstin || '24AOTPJ2455F1ZV'}</div>
          </div>
          
          <div className="border-l border-black text-base">
            <div className="grid grid-cols-2 border-b border-black px-3 py-1">
              <div>BILL No</div>
              <div>: {bill?.billNumber || '2/26-27'}</div>
            </div>
            <div className="grid grid-cols-2 border-b border-black px-3 py-1">
              <div>Date</div>
              <div>: {formatDisplayDate(bill?.billDate || '2026-04-03')}</div>
            </div>
            <div className="grid grid-cols-2 border-b border-black px-3 py-1">
              <div>Broker</div>
              <div>: {bill?.broker || 'BROKER'}</div>
            </div>
            <div className="grid grid-cols-2 px-3 py-1 font-semibold">
              <div>GSTIN No.</div>
              <div>: {bill?.companyGstin || '24APDPB5367B1ZG'}</div>
            </div>
          </div>
        </div>

        {/* Dynamic Table */}
        <table className="w-full border-collapse text-base text-center">
          <thead>
            <tr className="border-b border-black bg-zinc-100">
              <th className="border-r border-black px-1 py-1 font-semibold">Inward Ch.No</th>
              <th className="border-r border-black px-1 py-1 font-semibold">Issue Ch.No</th>
              <th className="border-r border-black px-1 py-1 font-semibold">Description</th>
              <th className="border-r border-black px-1 py-1 font-semibold">Design No</th>
              <th className="border-r border-black px-1 py-1 font-semibold">Plain</th>
              <th className="border-r border-black px-1 py-1 font-semibold">Short</th>
              <th className="border-r border-black px-1 py-1 font-semibold">Work</th>
              <th className="border-r border-black px-1 py-1 font-semibold">Sample</th>
              <th className="border-r border-black px-1 py-1 font-semibold">Total Pcs.</th>
              <th className="border-r border-black px-1 py-1 font-semibold">GST%</th>
              <th className="border-r border-black px-1 py-1 font-semibold">Rate</th>
              <th className="px-1 py-1 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(bill?.rows || []).map((row, idx) => {
              const totalPcs = Number(row.work || 0) + Number(row.plain || 0) + Number(row.short || 0) + Number(row.sample || 0)
              const billableQuantity = Number(row.work || 0) + Number(row.sample || 0)
              const rowAmount = billableQuantity * Number(row.rate || 0)
              
              return (
                <tr key={row.id || idx} className="border-b border-black/10 last:border-b-0">
                  <td className="border-r border-black px-1 py-1">{row.inwardChNo}</td>
                  <td className="border-r border-black px-1 py-1">{row.issueChNo}</td>
                  <td className="border-r border-black px-1 py-1 text-left">{row.description}</td>
                  <td className="border-r border-black px-1 py-1 text-left">{row.designNumber}</td>
                  <td className="border-r border-black px-1 py-1 text-right">{row.plain || ''}</td>
                  <td className="border-r border-black px-1 py-1 text-right">{row.short || ''}</td>
                  <td className="border-r border-black px-1 py-1 text-right">{row.work || ''}</td>
                  <td className="border-r border-black px-1 py-1 text-right">{row.sample || ''}</td>
                  <td className="border-r border-black px-1 py-1 text-right font-medium">{totalPcs}</td>
                  <td className="border-r border-black px-1 py-1 text-right">{row.gstPercent || '5.00'}</td>
                  <td className="border-r border-black px-1 py-1 text-right">{Number(row.rate || 0).toFixed(2)}</td>
                  <td className="px-1 py-1 text-right font-medium">{rowAmount.toFixed(2)}</td>
                </tr>
              )
            })}
            
            {/* બદલાવેલી રો: જ્યાં હવે બધી વસ્તુનું ટોટલ દેખાશે */}
            <tr className="h-10 border-t-2 border-black bg-zinc-50 font-bold">
              <td className="border-r border-black text-left px-2" colSpan={4}>TOTAL</td>
              <td className="border-r border-black text-right px-1">{tableTotals.plain || ''}</td>
              <td className="border-r border-black text-right px-1">{tableTotals.short || ''}</td>
              <td className="border-r border-black text-right px-1">{tableTotals.work || ''}</td>
              <td className="border-r border-black text-right px-1">{tableTotals.sample || ''}</td>
              <td className="border-r border-black text-right px-1">{tableTotals.totalPcs || '0'}</td>
              <td className="border-r border-black" />
              <td className="border-r border-black" />
              <td className="text-right px-1">{tableTotals.amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Calculations & Footer Summary */}
        <div className="grid grid-cols-[1fr_380px] border-t border-black">
          
          {/* Left Side: Amounts in words and Bank Info */}
          <div className="border-r border-black p-3 text-sm flex flex-col justify-between gap-4">
            <div>
              <div><strong>PAN No.:</strong> {bill?.panNumber}</div>
              <div className="mt-2 font-medium">
                <span className="underline font-semibold text-xs uppercase block text-zinc-600">Amounts In Words:</span>
                <div className="mt-0.5"><strong>GST Amount:</strong> {bill?.gstInWords || 'Nine Hundred Seventy Four And Sixty Two Paise Only'}</div>
                <div className="mt-0.5"><strong>Bill Amount:</strong> {amountToWords(finalBillAmount) || 'One Lakh Twenty Three Thousand Four Hundred Eighty Eight And Seventy Two Paise Only'}</div>
              </div>
            </div>
            
            {/* Bank details grid from PDF */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-zinc-50 p-2 border border-zinc-300 rounded text-xs">
              <div><strong>BANK BRANCH :-</strong> {bill?.bankBranch}</div>
              <div><strong>CHQ NO:-</strong> {bill?.chqNo}</div>
              <div><strong>CHQ DATE:-</strong> {bill?.chqDate}</div>
              <div><strong>CHQ AMOUNT :-</strong> {bill?.chqAmount}</div>
              <div className="col-span-2"><strong>CHQ DIFFRANCE :-</strong> {bill?.chqDifference}</div>
            </div>
          </div>
          
          {/* Right Side: Totals, Taxes, Final Bill Amount */}
          <div className="text-base font-medium">
            <div className="grid grid-cols-3 border-b border-black bg-zinc-100 px-2 py-1 text-right font-bold">
              <div className="text-left col-span-2">Total Pcs / Gross:</div>
              <div>{totals.quantity || 0}</div> 
            </div>
            <div className="grid grid-cols-3 border-b border-black px-2 py-1 text-right">
              <div className="text-left col-span-2">DISCOUNT {discountPercent.toFixed(2)}%</div>
              <div className="text-red-600">-{discountAmount.toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-3 border-b border-black px-2 py-1 text-right font-semibold">
              <div className="text-left col-span-2">Taxable Amount</div>
              <div>{taxableAmount.toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-3 border-b border-black px-2 py-1 text-right">
              <div className="text-left col-span-2">CGST {cgstPercent.toFixed(2)}%</div>
              <div>{cgstAmount.toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-3 border-b border-black px-2 py-1 text-right">
              <div className="text-left col-span-2">SGST {sgstPercent.toFixed(2)}%</div>
              <div>{sgstAmount.toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-3 bg-zinc-200 px-2 py-2 text-right text-xl font-bold">
              <div className="text-left col-span-2">Bill Amount (₹)</div>
              <div>{finalBillAmount.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Terms and Signature Section */}
        <div className="grid grid-cols-[1fr_380px] border-t border-black p-3">
          <div style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <div className="text-base font-bold">Terms & Condition :</div>
            <div className="text-sm leading-5 mt-1">
              {bill?.terms && bill.terms.length > 0 ? (
                bill.terms.map((term, index) => (
                  <div key={index}>{index + 1}. {term}</div>
                ))
              ) : (
                <>
                  <div>1. Subject to "SURAT" Jurisdiction Only. E.&.O.E</div>
                </>
              )}
            </div>
          </div>
          <div className="text-right text-base font-bold flex flex-col justify-between items-end">
            <div>For, {bill?.companyName || 'GURUKRUPA FASHION'}</div>
          </div>
        </div>
        
        {/* Signatures Row */}
        <div className="grid grid-cols-2 px-6 pb-3 pt-12 text-sm italic font-medium">
          <span className="text-left border-t border-black/40 inline-block w-40 text-center pt-1">Receiver Sign</span>
          <span className="text-right">(Authorised Signatory)</span>
        </div>

      </div>
    </div>
  )
}

export default YourBillPreview