
import { useState, useCallback, useRef } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { DashboardHeader } from '@/components/DashboardHeader';
import { KPICards } from '@/components/KPICards';
import { GaugeChart } from '@/components/GaugeChart';
import { DonutChart } from '@/components/DonutChart';
import { BarChart } from '@/components/BarChart';
import { AreaChart } from '@/components/AreaChart';
import { MonthlyTrendChart } from '@/components/MonthlyTrendChart';
import { CategoryComparisonChart } from '@/components/CategoryComparisonChart';
import { TransactionsTable } from '@/components/TransactionsTable';
import { FilterSection } from '@/components/FilterSection';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Transaction, DateRange } from '@/types/financial';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const Index = () => {
  const [wallet, setWallet] = useState('5548998343320');
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    return { 
      start: startOfMonth(new Date()), 
      end: endOfMonth(new Date()) 
    };
  });
  
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [dataEnabled, setDataEnabled] = useState(true);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const { data: transactions, isLoading, error, refetch } = useFinancialData(
    wallet,
    dateRange.start,
    dateRange.end,
    dataEnabled
  );

  const handleLoadWallet = useCallback(() => {
    console.log('Loading wallet:', wallet, 'Period:', dateRange);
    setDataEnabled(true);
    refetch();
  }, [wallet, dateRange, refetch]);

  const handleDateRangeChange = useCallback((newRange: DateRange) => {
    console.log('Date range changed:', newRange);
    setDateRange(newRange);
    setDataEnabled(true);
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (!dashboardRef.current || !transactions) {
      alert('Nenhum dado para exportar');
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      // Capturar o dashboard como imagem
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f9fafb'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calcular dimensões para caber na página
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      // Header
      pdf.setFontSize(20);
      pdf.text('ZapGastos - Relatório Financeiro', 20, 20);
      
      // Adicionar imagem do dashboard
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Salvar PDF
      const fileName = `relatorio-zapgastos-${dateRange.start.toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);
      
      console.log('PDF exportado com sucesso:', fileName);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar PDF. Tente novamente.');
    }
  }, [dateRange, transactions]);

  const handleClearFilters = useCallback(() => {
    setCategoryFilter(null);
    setSearchFilter('');
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-soft p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar dados
            </h2>
            <p className="text-gray-600 mb-4">
              Não foi possível carregar os dados financeiros para esta carteira.
            </p>
            <button
              onClick={handleLoadWallet}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        onExportPDF={handleExportPDF}
        wallet={wallet}
        dateRange={dateRange}
      />
      
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <FilterSection
          wallet={wallet}
          onWalletChange={setWallet}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onLoadWallet={handleLoadWallet}
          categoryFilter={categoryFilter}
          searchFilter={searchFilter}
          onSearchChange={setSearchFilter}
          onClearFilters={handleClearFilters}
        />

        {isLoading ? (
          <LoadingSkeleton />
        ) : !transactions || transactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-soft p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sem dados para esta carteira
            </h2>
            <p className="text-gray-600">
              Não foram encontrados dados financeiros para o período selecionado.
            </p>
          </div>
        ) : (
          <div ref={dashboardRef} className="space-y-6">
            <KPICards transactions={transactions} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GaugeChart transactions={transactions} />
              <DonutChart 
                transactions={transactions} 
                onCategoryClick={setCategoryFilter}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChart 
                transactions={transactions}
                onCategoryClick={setCategoryFilter}
              />
              <AreaChart transactions={transactions} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyTrendChart transactions={transactions} />
              <CategoryComparisonChart transactions={transactions} />
            </div>
            
            <TransactionsTable 
              transactions={transactions}
              categoryFilter={categoryFilter}
              searchFilter={searchFilter}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
