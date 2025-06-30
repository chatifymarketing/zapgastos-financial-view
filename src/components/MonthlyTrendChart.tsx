
import { Transaction } from '@/types/financial';
import { parseValue, formatCurrency } from '@/utils/financial';
import { parseDateString } from '@/utils/financial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthlyTrendChartProps {
  transactions: Transaction[];
}

export const MonthlyTrendChart = ({ transactions }: MonthlyTrendChartProps) => {
  // Group transactions by month
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = parseDateString(transaction.timestamp);
    const monthKey = format(date, 'yyyy-MM', { locale: ptBR });
    const valor = parseValue(transaction.valor);
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        monthFormatted: format(date, 'MMM/yyyy', { locale: ptBR }),
        receitas: 0,
        despesas: 0,
        transacoes: 0
      };
    }
    
    if (valor > 0) {
      acc[monthKey].receitas += valor;
    } else {
      acc[monthKey].despesas += Math.abs(valor);
    }
    
    acc[monthKey].transacoes += 1;
    return acc;
  }, {} as Record<string, any>);

  // Convert to array and sort by month
  const chartData = Object.values(monthlyData)
    .sort((a: any, b: any) => a.month.localeCompare(b.month))
    .map((item: any) => ({
      ...item,
      saldoLiquido: item.receitas - item.despesas
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium mb-2">{data.monthFormatted}</p>
          <div className="space-y-1 text-sm">
            <p className="text-green-600">
              Receitas: {formatCurrency(data.receitas)}
            </p>
            <p className="text-red-600">
              Despesas: {formatCurrency(data.despesas)}
            </p>
            <p className="text-blue-600 font-medium">
              Saldo: {formatCurrency(data.saldoLiquido)}
            </p>
            <p className="text-gray-600">
              Transações: {data.transacoes}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tendência mensal
      </h3>
      
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Nenhum dado disponível
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="monthFormatted" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Line
                type="monotone"
                dataKey="receitas"
                stroke="#10B981"
                strokeWidth={2}
                name="Receitas"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="despesas"
                stroke="#EF4444"
                strokeWidth={2}
                name="Despesas"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="saldoLiquido"
                stroke="#019894"
                strokeWidth={3}
                name="Saldo Líquido"
                dot={{ fill: '#019894', strokeWidth: 2, r: 5 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
