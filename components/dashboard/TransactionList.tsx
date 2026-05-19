import { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Calendar, ArrowDownCircle, ArrowUpCircle, Edit2, Trash2, X, Download, Loader2 } from 'lucide-react';
import { Transaction } from '@/types/dashboard';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  privacyMode: boolean; // <--- NUEVO PROP
}

export default function TransactionList({ transactions, onEdit, onDelete, privacyMode }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const [filterDate, setFilterDate] = useState(new Date());

  const filteredTx = transactions.filter(tx => {
    const matchesSearch = tx.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || tx.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todas', ...Array.from(new Set(transactions.map(t => t.categoryId)))];
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // EL PDF SIEMPRE VA A SALIR CON LOS VALORES REALES (Para que te sirva de backup), 
  // pero podés ocultarlos si querés agregando lógica acá. Por defecto lo dejo visible en el PDF.
  const generatePDF = async () => {
    setIsGeneratingPdf(true);
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 800));

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let currentY = 15;

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Reporte Financiero Mensual", margin, currentY);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    const fechaImpresion = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(`Generado el: ${fechaImpresion}`, margin, currentY + 6);
    
    currentY += 15;

    const statsElement = document.getElementById('pdf-capture-stats');
    if (statsElement) {
        try {
            const canvas = await html2canvas(statsElement, { scale: 1.5, useCORS: true, logging: false, scrollY: -window.scrollY });
            const imgData = canvas.toDataURL('image/png');
            const imgProps = doc.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * (pageWidth - margin * 2)) / imgProps.width;
            doc.addImage(imgData, 'PNG', margin, currentY, pageWidth - margin * 2, pdfHeight);
            currentY += pdfHeight + 10;
        } catch (error) { console.error("Error stats:", error); }
    }

    const chartsElement = document.getElementById('pdf-capture-charts');
    if (chartsElement) {
        try {
            if (currentY > 200) { doc.addPage(); currentY = 20; }
            const canvas = await html2canvas(chartsElement, { scale: 1.5, useCORS: true, logging: false, scrollY: -window.scrollY });
            const imgData = canvas.toDataURL('image/png');
            const imgProps = doc.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * (pageWidth - margin * 2)) / imgProps.width;
            doc.text("Análisis de Gastos", margin, currentY - 2);
            doc.addImage(imgData, 'PNG', margin, currentY, pageWidth - margin * 2, pdfHeight);
            currentY += pdfHeight + 15;
        } catch (error) { console.error("Error charts:", error); }
    }

    if (currentY > 230) { doc.addPage(); currentY = 20; }
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Detalle de Movimientos", margin, currentY);
    currentY += 5;

    const tableData = filteredTx.map(tx => [
      new Date(tx.date).toLocaleDateString('es-AR'),
      tx.desc,
      tx.categoryId.charAt(0).toUpperCase() + tx.categoryId.slice(1),
      tx.source.toUpperCase(),
      `$ ${tx.amount.toLocaleString('es-AR')}`
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Fecha', 'Descripción', 'Categoría', 'Origen', 'Monto']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 9 },
      columnStyles: { 4: { halign: 'right', fontStyle: 'bold' } }
    });

    doc.save(`Reporte_EnQueGasto_${Date.now()}.pdf`);
    setIsGeneratingPdf(false);
  };

  const daysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (m: number, y: number) => new Date(y, m, 1).getDay();
  const renderCalendar = () => {
    const year = filterDate.getFullYear();
    const month = filterDate.getMonth();
    const days = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);
    const calendarDays = [];
    for (let i = 0; i < startDay; i++) { calendarDays.push(<div key={`empty-${i}`} className="h-8 w-8"></div>); }
    for (let i = 1; i <= days; i++) {
        calendarDays.push(<div key={i} className="h-8 w-8 flex items-center justify-center text-sm rounded-full hover:bg-blue-50 cursor-pointer font-medium text-slate-700">{i}</div>);
    }
    return calendarDays;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 relative z-0 mt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        
        <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Detalle de Movimientos</h3>
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-bold">{filteredTx.length} registros</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            
            <button 
                onClick={generatePDF}
                disabled={isGeneratingPdf}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors w-full sm:w-auto justify-center shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-wait"
            >
                {isGeneratingPdf ? <Loader2 size={16} className="animate-spin"/> : <Download size={16} />} 
                <span className="hidden sm:inline">{isGeneratingPdf ? 'Generando...' : 'Descargar Reporte'}</span> 
                <span className="sm:hidden">PDF</span>
            </button>

            <div className="relative">
                <button onClick={() => setShowDatePicker(!showDatePicker)} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors w-full sm:w-auto justify-center"><Calendar size={16} />{monthNames[filterDate.getMonth()]} De {filterDate.getFullYear()}</button>
                {showDatePicker && (
                    <>
                        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setShowDatePicker(false)}></div>
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 md:absolute md:top-full md:left-0 md:translate-x-0 md:translate-y-2 bg-white p-5 rounded-3xl shadow-2xl border border-slate-100 w-[300px] animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-4">
                                <button onClick={() => setFilterDate(new Date(filterDate.setMonth(filterDate.getMonth() - 1)))} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft size={20}/></button>
                                <span className="font-bold text-slate-800">{monthNames[filterDate.getMonth()]} {filterDate.getFullYear()}</span>
                                <button onClick={() => setFilterDate(new Date(filterDate.setMonth(filterDate.getMonth() + 1)))} className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight size={20}/></button>
                            </div>
                            <div className="grid grid-cols-7 mb-2 text-center">{['DO','LU','MA','MI','JU','VI','SA'].map(d => <span key={d} className="text-[10px] font-black text-slate-400">{d}</span>)}</div>
                            <div className="grid grid-cols-7 gap-1 place-items-center">{renderCalendar()}</div>
                            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center"><button onClick={() => setShowDatePicker(false)} className="text-xs text-red-500 font-bold hover:underline md:hidden">Cerrar</button><button className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg w-full md:w-auto">Ver todo {monthNames[filterDate.getMonth()]}</button></div>
                        </div>
                    </>
                )}
            </div>

            <div className="relative w-full sm:w-auto">
                <select className="w-full sm:w-[200px] appearance-none bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-black" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Filter size={16} /></div>
            </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
            <thead>
                <tr className="text-left border-b border-slate-50">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Fecha</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Descripción</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Categoría</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Origen</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Monto</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {filteredTx.length > 0 ? (
                    filteredTx.map((tx) => (
                        <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 text-xs font-bold text-slate-500">{new Date(tx.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</td>
                            <td className="py-4">
                                <p className="font-bold text-slate-800 text-sm">{tx.desc}</p>
                                {tx.isInstallment && <span className="inline-block mt-1 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-200">Cuota {tx.currentInstallment || 1}/{tx.installmentData?.count}</span>}
                                {tx.installmentData?.bank && tx.installmentData.bank !== 'Efectivo' && <span className="ml-2 text-[10px] text-slate-400 uppercase tracking-wider font-bold">• {tx.installmentData.bank}</span>}
                            </td>
                            <td className="py-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${tx.categoryId === 'comida' ? 'bg-orange-50 text-orange-700 border border-orange-100' : tx.categoryId === 'servicios' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : tx.categoryId === 'salud' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                    {tx.categoryId === 'comida' ? '🍔' : tx.categoryId === 'transporte' ? '🚌' : tx.categoryId === 'servicios' ? '💡' : tx.categoryId === 'educacion' ? '🎓' : '📦'} {tx.categoryId}
                                </span>
                            </td>
                            <td className="py-4"><span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${tx.source === 'ahorro' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>$ {tx.source}</span></td>
                            <td className="py-4 text-right">
                                <span className="font-black text-slate-900">
                                    {/* OCULTAMOS EL MONTO SI PRIVACY ES TRUE */}
                                    {privacyMode ? '****' : `$ ${tx.amount.toLocaleString('es-AR')}`}
                                </span>
                            </td>
                            <td className="py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onEdit(tx)} className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-blue-600 transition-all border border-transparent hover:border-slate-100"><Edit2 size={14} /></button>
                                    <button onClick={() => onDelete(tx.id)} className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-slate-100"><Trash2 size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan={6} className="py-10 text-center text-slate-400 text-sm font-medium">No se encontraron movimientos para esta búsqueda.</td></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}