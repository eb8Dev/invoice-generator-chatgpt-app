import React, { useState, useEffect } from 'react';
import { Download, Printer } from 'lucide-react';

function App() {
  const [invoice, setInvoice] = useState({
    number: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sender: { name: '', address: '', email: '' },
    client: { name: '', address: '', email: '' },
    items: [],
    notes: ''
  });

  useEffect(() => {
    const handleSetGlobals = (event) => {
      const globals = event.detail?.globals;
      if (globals?.toolOutput?.invoice) {
        setInvoice(globals.toolOutput.invoice);
      }
    };
    if (window.openai?.toolOutput?.invoice) {
      setInvoice(window.openai.toolOutput.invoice);
    }
    window.addEventListener("openai:set_globals", handleSetGlobals);
    return () => window.removeEventListener("openai:set_globals", handleSetGlobals);
  }, []);

  const calculateTotal = () => {
    return invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 print:bg-white print:py-0">
      {/* Toolbar - Hidden when printing */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-end print:hidden px-4">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Download size={18} />
          <span>Download / Print</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden print:shadow-none print:rounded-none">
        
        {/* Invoice Header */}
        <div className="p-8 md:p-12 border-b border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">INVOICE</h1>
              <div className="mt-2 text-slate-500 font-medium flex items-center gap-2">
                <span>#</span>
                <span>{invoice.number || '---'}</span>
              </div>
            </div>
            
            {/* Total Amount Box */}
            <div className="text-right">
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Total Amount</div>
              <div className="text-4xl font-bold text-slate-900">
                {formatCurrency(calculateTotal())}
              </div>
            </div>
          </div>
        </div>

        {/* Sender & Client Details */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Sender (From) */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Billed From</h3>
            <div className="space-y-1 text-slate-700">
              <div className={`font-bold text-lg ${!invoice.sender.name && 'text-slate-300 italic'}`}>
                {invoice.sender.name || '[Sender Name]'}
              </div>
              <div className={`whitespace-pre-line ${!invoice.sender.address && 'text-slate-300 italic'}`}>
                {invoice.sender.address || '[Sender Address]'}
              </div>
              <div className={`${!invoice.sender.email && 'text-slate-300 italic'}`}>
                {invoice.sender.email || '[Sender Email]'}
              </div>
            </div>
          </div>

          {/* Client (To) */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Billed To</h3>
            <div className="space-y-1 text-slate-700">
              <div className={`font-bold text-lg ${!invoice.client.name && 'text-slate-300 italic'}`}>
                {invoice.client.name || '[Client Name]'}
              </div>
              <div className={`whitespace-pre-line ${!invoice.client.address && 'text-slate-300 italic'}`}>
                {invoice.client.address || '[Client Address]'}
              </div>
              <div className={`${!invoice.client.email && 'text-slate-300 italic'}`}>
                {invoice.client.email || '[Client Email]'}
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="px-8 md:px-12 pb-8 grid grid-cols-2 gap-12 text-sm">
          <div>
            <span className="font-semibold text-slate-500">Invoice Date:</span>
            <span className="ml-3 font-medium text-slate-900">{invoice.date}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Due Date:</span>
            <span className="ml-3 font-medium text-slate-900">{invoice.dueDate}</span>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-8 md:px-12 py-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="py-4 font-semibold text-xs text-slate-400 uppercase tracking-wider w-1/2">Description</th>
                <th className="py-4 font-semibold text-xs text-slate-400 uppercase tracking-wider text-right">Qty</th>
                <th className="py-4 font-semibold text-xs text-slate-400 uppercase tracking-wider text-right">Rate</th>
                <th className="py-4 font-semibold text-xs text-slate-400 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoice.items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-400 italic bg-slate-50/50 rounded-lg">
                    No items added yet.
                  </td>
                </tr>
              ) : (
                invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-4 pr-4">
                      <p className="font-medium text-slate-900">{item.description}</p>
                    </td>
                    <td className="py-4 text-right text-slate-600 font-medium tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="py-4 text-right text-slate-600 font-medium tabular-nums">
                      {formatCurrency(item.rate)}
                    </td>
                    <td className="py-4 text-right text-slate-900 font-bold tabular-nums">
                      {formatCurrency(item.quantity * item.rate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer Total */}
            {invoice.items.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-slate-100">
                  <td colSpan="3" className="pt-6 text-right font-bold text-slate-600 uppercase text-xs tracking-wider">Total</td>
                  <td className="pt-6 text-right font-bold text-2xl text-blue-600 tabular-nums">
                    {formatCurrency(calculateTotal())}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Notes / Footer */}
        <div className="bg-slate-50 p-8 md:p-12 border-t border-slate-100 mt-8">
          {invoice.notes && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</h4>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 mt-8 pt-8 border-t border-slate-200">
            <p>Thank you for your business!</p>
            <p className="mt-2 md:mt-0 print:hidden">Generated by AI Invoice Builder</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;