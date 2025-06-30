
import { useState, useCallback, useEffect } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { KPICards } from '@/components/KPICards';
import { GaugeChart } from '@/components/GaugeChart';
import { DonutChart } from '@/components/DonutChart';
import { BarChart } from '@/components/BarChart';
import { AreaChart } from '@/components/AreaChart';
import { TransactionsTable } from '@/components/TransactionsTable';
import { FilterSection } from '@/components/FilterSection';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Transaction, DateRange } from '@/types/financial';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const Index = () => {
  const [wallet, setWallet] = useState('5548998343320');
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end };
  });
  
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const { data: transactions, isLoading, error, refetch } = useFinancialData(
    wallet,
    dateRange.start,
    dateRange.end
  );

  const handleLoadWallet = useCallback(() => {
    console.log('Loading wallet:', wallet);
    refetch();
  }, [wallet, refetch]);

  const handleDateRangeChange = useCallback((newRange: DateRange) => {
    setDateRange(newRange);
  }, []);

  const handleExportPDF = useCallback(() => {
    const startStr = dateRange.start.toLocaleDateString('pt-BR');
    const endStr = dateRange.end.toLocaleDateString('pt-BR');
    
    // Mock PDF export functionality
    console.log(`Exporting PDF: relatorio-financas-${startStr}-${endStr}.pdf`);
    // In a real implementation, this would call the actual PDF generation
    alert(`PDF seria exportado: relatorio-financas-${startStr}-${endStr}.pdf`);
  }, [dateRange]);

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
