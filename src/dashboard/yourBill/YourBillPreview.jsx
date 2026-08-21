import { amountToWords } from '../yourChalan/yourChalanUtils'
import { formatDisplayDate } from '../utils/formatDate'
import { getBillTotals } from './yourBillUtils' 

function YourBillPreview({ bill }) {
  const displayedBillItems = (bill?.rows || []).slice(0, 20)
  const totals = getBillTotals(displayedBillItems)
  
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
  const tableTotals = displayedBillItems.reduce((acc, row) => {
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
    <>
      <style type="text/css">
        {`
          @page {
            size: A4 portrait;
            margin: 5mm;
          }

          @media print {
            html,
            body {
              width: 210mm;
              margin: 0;
              padding: 0;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .bill-print {
              width: 200mm;
              min-height: 287mm;
              max-height: 287mm;
              margin: 0 auto;
              box-sizing: border-box;
              break-inside: avoid;
              page-break-inside: avoid;
              page-break-after: avoid;
            }
          }
        `}
      </style>

      {/* Screen Preview Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 print:p-0 print:border-none print:overflow-visible">
        
        {/* STRICT A4 PAGE CONTAINER */}
        <div className="bill-print w-[200mm] h-[287mm] mx-auto bg-white box-border">
          <div className="border-2 border-black flex flex-col h-full font-sans text-black overflow-hidden relative">
            
            {/* Header Section */}
            <div className="border-b-2 border-black bg-zinc-100 px-4 py-2 text-center text-3xl font-bold tracking-wide flex-none">
              {bill?.companyName || 'GURUKRUPA FASHION'}
            </div>
            <div className="relative border-b border-black px-4 py-1 text-center text-sm font-medium flex-none">
              <span>{bill?.address || '1,2 1ST FLOOR, KRISHNA IND BEHIND HARI OM MILL VED ROAD, SURAT'}</span>
            </div>
            <div className="border-b border-black px-4 py-1 text-center text-sm font-medium flex-none">
              Mo:- {bill?.mobile || '93757 02200 - 99982 09649'}
            </div>
            <div className="relative border-b border-black px-4 py-1 text-center text-lg font-bold flex-none">
              <span>TAX INVOICE</span>
              <span className="absolute right-4 top-1 text-sm font-normal italic">{bill?.copyType || 'Original'}</span>
            </div>

            {/* Party Details & Bill Details */}
            <div className="grid grid-cols-[1fr_260px] border-b border-black flex-none">
              <div className="min-h-24 px-3 py-2 text-xs">
                <div className="flex gap-1">
                  <span className="font-semibold text-xs">M/s.</span>
                  <div className="ml-2">
                    <strong className="text-base font-bold">{bill?.partyName || 'OMEGA DESIGNER'}</strong>
                    <div className="mt-0.5 whitespace-pre-line">{bill?.partyAddress || 'NO-103 MILLUM.2.TEXTILE MARKET\nSURAT'}</div>
                  </div>
                </div>
                <div className="mt-2 font-semibold">Place of Supply: {bill?.placeOfSupply || '24-Gujarat'}</div>
                <div className="mt-0.5 font-semibold">GSTIN No.: {bill?.partyGstin || '24AOTPJ2455F1ZV'}</div>
              </div>
              
              <div className="border-l border-black text-xs">
                <div className="grid grid-cols-[80px_1fr] border-b border-black px-3 py-1">
                  <div>BILL No</div>
                  <div className="font-medium">: {bill?.billNumber || '2/26-27'}</div>
                </div>
                <div className="grid grid-cols-[80px_1fr] border-b border-black px-3 py-1">
                  <div>Date</div>
                  <div className="font-medium">: {formatDisplayDate(bill?.billDate || '2026-04-03')}</div>
                </div>
                <div className="grid grid-cols-[80px_1fr] border-b border-black px-3 py-1">
                  <div>Broker</div>
                  <div className="font-medium">: {bill?.broker || 'BROKER'}</div>
                </div>
                <div className="grid grid-cols-[80px_1fr] px-3 py-1 font-semibold">
                  <div>GSTIN No.</div>
                  <div>: {bill?.companyGstin || '24APDPB5367B1ZG'}</div>
                </div>
              </div>
            </div>

            {/* Dynamic Table Section */}
            <div className="flex-1 flex flex-col border-b border-black">
              <table className="w-full border-collapse text-[10px] text-center table-fixed h-full">
                <thead>
                  <tr className="border-b border-black bg-zinc-100 h-7">
                    <th className="border-r border-black px-1 font-semibold w-[9%] leading-tight">Inward<br/>Ch.No</th>
                    <th className="border-r border-black px-1 font-semibold w-[9%] leading-tight">Issue<br/>Ch.No</th>
                    <th className="border-r border-black px-1 font-semibold text-left w-[18%]">Description</th>
                    <th className="border-r border-black px-1 font-semibold text-left w-[12%]">Design No</th>
                    <th className="border-r border-black px-1 font-semibold w-[5%]">Plain</th>
                    <th className="border-r border-black px-1 font-semibold w-[5%]">Short</th>
                    <th className="border-r border-black px-1 font-semibold w-[5%]">Work</th>
                    <th className="border-r border-black px-1 font-semibold w-[6%]">Sample</th>
                    <th className="border-r border-black px-1 font-semibold w-[7%]">Total Pcs</th>
                    <th className="border-r border-black px-1 font-semibold w-[6%]">GST%</th>
                    <th className="border-r border-black px-1 font-semibold w-[8%]">Rate</th>
                    <th className="px-1 font-semibold w-[10%]">Amount</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {displayedBillItems.map((row, idx) => {
                    const totalPcs = Number(row.work || 0) + Number(row.plain || 0) + Number(row.short || 0) + Number(row.sample || 0)
                    const billableQuantity = Number(row.work || 0) + Number(row.sample || 0)
                    const rowAmount = billableQuantity * Number(row.rate || 0)
                    
                    return (
                      <tr key={row.id || idx} className="border-b border-black/10 last:border-b-0 h-5">
                        <td className="border-r border-black px-1 truncate">{row.inwardChNo}</td>
                        <td className="border-r border-black px-1 truncate">{row.issueChNo}</td>
                        <td className="border-r border-black px-1 text-left truncate">{row.description}</td>
                        <td className="border-r border-black px-1 text-left truncate">{row.designNumber}</td>
                        <td className="border-r border-black px-1 text-right">{row.plain || ''}</td>
                        <td className="border-r border-black px-1 text-right">{row.short || ''}</td>
                        <td className="border-r border-black px-1 text-right">{row.work || ''}</td>
                        <td className="border-r border-black px-1 text-right">{row.sample || ''}</td>
                        <td className="border-r border-black px-1 text-right font-medium">{totalPcs || ''}</td>
                        <td className="border-r border-black px-1 text-right">{row.gstPercent || '5.00'}</td>
                        <td className="border-r border-black px-1 text-right">{Number(row.rate || 0).toFixed(2)}</td>
                        <td className="px-1 text-right font-medium">{rowAmount.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                  {/* Empty spacer row to push content to top if fewer than 20 rows */}
                  <tr className="h-auto">
                    <td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td></td>
                  </tr>
                </tbody>
                <tfoot className="border-t-2 border-black bg-zinc-50 font-bold h-8">
                  <tr>
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
                </tfoot>
              </table>
            </div>

            {/* Calculations & Footer Summary */}
            <div className="grid grid-cols-[1fr_260px] border-b border-black flex-none">
              
              {/* Left Side: Amounts in words and Bank Info */}
              <div className="border-r border-black p-2 flex flex-col justify-between gap-3 text-[11px]">
                <div>
                  <div><strong>PAN No.:</strong> {bill?.panNumber}</div>
                  <div className="mt-1.5 font-medium">
                    <span className="underline font-semibold text-[10px] uppercase block text-zinc-600 mb-0.5">Amounts In Words:</span>
                    <div className="mt-0.5 text-[10px] leading-tight"><strong>GST Amount:</strong> {bill?.gstInWords || 'Nine Hundred Seventy Four And Sixty Two Paise Only'}</div>
                    <div className="mt-0.5 text-[10px] leading-tight"><strong>Bill Amount:</strong> {amountToWords(finalBillAmount) || 'One Lakh Twenty Three Thousand Four Hundred Eighty Eight And Seventy Two Paise Only'}</div>
                  </div>
                </div>
                
                {/* Bank details grid */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-zinc-50 p-1.5 border border-zinc-300 rounded text-[9px]">
                  <div><strong>BANK BRANCH :-</strong> {bill?.bankBranch}</div>
                  <div><strong>CHQ NO:-</strong> {bill?.chqNo}</div>
                  <div><strong>CHQ DATE:-</strong> {bill?.chqDate}</div>
                  <div><strong>CHQ AMOUNT :-</strong> {bill?.chqAmount}</div>
                  <div className="col-span-2"><strong>CHQ DIFFRANCE :-</strong> {bill?.chqDifference}</div>
                </div>
              </div>
              
              {/* Right Side: Totals, Taxes, Final Bill Amount */}
              <div className="text-[11px] font-medium flex flex-col">
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
                <div className="grid grid-cols-3 bg-zinc-200 px-2 text-right text-[13px] font-bold flex-1 items-center">
                  <div className="text-left col-span-2">Bill Amount (₹)</div>
                  <div>{finalBillAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Terms and Signature Section */}
            <div className="grid grid-cols-[1fr_260px] p-2 h-[80px] flex-none">
              <div style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <div className="text-sm font-bold mb-0.5">Terms & Condition :</div>
                <div className="text-[10px] leading-tight">
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
              <div className="text-right text-[11px] font-bold flex flex-col justify-between items-end relative">
                <div>For, {bill?.companyName || 'GURUKRUPA FASHION'}</div>
                
                {/* Signatures placed at bottom right absolute or flex bottom */}
                <div className="w-full flex justify-between px-2 pt-6 italic font-medium absolute bottom-0 left-0">
                  <span className="text-left border-t border-black/40 inline-block w-20 text-center pt-1 text-[9px]">Receiver Sign</span>
                  <span className="text-right text-[9px]">(Authorised Signatory)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default YourBillPreview