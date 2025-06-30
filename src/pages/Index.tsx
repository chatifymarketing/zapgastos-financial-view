import { useState, useCallback } from 'react';
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
    // Default to "Este mês" (current month)
    return { 
      start: startOfMonth(new Date()), 
      end: endOfMonth(new Date()) 
    };
  });
  
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [dataEnabled, setDataEnabled] = useState(true);

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
    try {
      const startStr = dateRange.start.toLocaleDateString('pt-BR');
      const endStr = dateRange.end.toLocaleDateString('pt-BR');
      
      // Create PDF content
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('ZapGastos - Relatório Financeiro', 20, 30);
      doc.setFontSize(12);
      doc.text(`Carteira: ${wallet}`, 20, 45);
      doc.text(`Período: ${startStr} - ${endStr}`, 20, 55);
      
      if (transactions && transactions.length > 0) {
        // KPIs
        const entradas = transactions.filter(t => t.valor > 0).reduce((sum, t) => sum + t.valor, 0);
        const saidas = Math.abs(transactions.filter(t => t.valor < 0).reduce((sum, t) => sum + t.valor, 0));
        const saldo = entradas - saidas;
        
        doc.text(`Saldo Atual: R$ ${saldo.toFixed(2)}`, 20, 75);
        doc.text(`Entradas: R$ ${entradas.toFixed(2)}`, 20, 85);
        doc.text(`Saídas: R$ ${saidas.toFixed(2)}`, 20, 95);
        doc.text(`Total de Transações: ${transactions.length}`, 20, 105);
        
        // Transactions summary
        doc.text('Últimas Transações:', 20, 125);
        let yPos = 135;
        
        transactions.slice(0, 10).forEach((transaction, index) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 30;
          }
          
          const valor = transaction.valor >= 0 ? `+R$ ${transaction.valor.toFixed(2)}` : `R$ ${transaction.valor.toFixed(2)}`;
          const line = `${transaction.timestamp.split(' ')[0]} - ${transaction.descricao} - ${valor}`;
          doc.text(line, 20, yPos);
          yPos += 10;
        });
      }
      
      // Save PDF
      const fileName = `relatorio-financas-${dateRange.start.toLocaleDateString('pt-BR').replace(/\//g, '-')}-${dateRange.end.toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      doc.save(fileName);
      
      console.log('PDF exported successfully:', fileName);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Erro ao exportar PDF. Tente novamente.');
    }
  }, [dateRange, transactions, wallet]);

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
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
