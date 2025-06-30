
import { Transaction } from '@/types/financial';
import { parseValue, formatCurrency } from '@/utils/financial';

interface GaugeChartProps {
  transactions: Transaction[];
}

export const GaugeChart = ({ transactions }: GaugeChartProps) => {
  const entradas = transactions
    .filter(t => parseValue(t.valor) > 0)
    .reduce((sum, t) => sum + parseValue(t.valor), 0);
  
  const saidas = Math.abs(transactions
    .filter(t => parseValue(t.valor) < 0)
    .reduce((sum, t) => sum + parseValue(t.valor), 0));
  
  // Assuming previous balance is 0 for this example
  const saldoAnterior = 0;
  const total = entradas + saldoAnterior;
  const percentualUsado = total > 0 ? (saidas / total) * 100 : 0;
  
  // Clamp between 0 and 100
  const clampedPercentual = Math.min(Math.max(percentualUsado, 0), 100);
  
  // Calculate angle for the gauge (180 degrees = 100%)
  const angle = (clampedPercentual / 100) * 180;
  
  const getColor = (percentage: number) => {
    if (percentage <= 50) return '#10B981'; // Green
    if (percentage <= 80) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Percentual já usado
      </h3>
      
      <div className="flex flex-col items-center">
        <div className="relative w-56 h-32 mb-6">
          <svg
            className="w-full h-full"
            viewBox="0 0 240 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background arc */}
            <path
              d="M 30 90 A 90 90 0 0 1 210 90"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="16"
              strokeLinecap="round"
            />
            
            {/* Progress arc */}
            <path
              d="M 30 90 A 90 90 0 0 1 210 90"
              fill="none"
              stroke={getColor(clampedPercentual)}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${(clampedPercentual / 100) * 282.74} 282.74`}
              className="transition-all duration-700 ease-in-out"
            />
            
            {/* Needle */}
            <g transform={`rotate(${angle} 120 90)`}>
              <line
                x1="120"
                y1="90"
                x2="120"
                y2="20"
                stroke="#374151"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx="120"
                cy="90"
                r="6"
                fill="#374151"
              />
            </g>
          </svg>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold mb-3" style={{ color: getColor(clampedPercentual) }}>
            {clampedPercentual.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Gastos: {formatCurrency(saidas)}</div>
            <div>Disponível: {formatCurrency(total)}</div>
            <div className="text-xs text-gray-500 mt-2">
              Saldo restante: {formatCurrency(Math.max(0, total - saidas))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
