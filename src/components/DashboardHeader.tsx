
import { Download } from 'lucide-react';
import { DateRange } from '@/types/financial';

interface DashboardHeaderProps {
  onExportPDF: () => void;
  wallet: string;
  dateRange: DateRange;
}

export const DashboardHeader = ({ onExportPDF, wallet, dateRange }: DashboardHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-semibold text-lg">
              ZapGastos
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard Finanças Pessoais
              </h1>
              <p className="text-sm text-gray-600">
                Carteira: {wallet} | {dateRange.start.toLocaleDateString('pt-BR')} - {dateRange.end.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          
          <button
            onClick={onExportPDF}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </button>
        </div>
      </div>
    </div>
  );
};
