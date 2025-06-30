
import { Transaction } from '@/types/financial';
import { parseValue, formatCurrency } from '@/utils/financial';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  transactions: Transaction[];
  onCategoryClick: (category: string) => void;
}

export const BarChart = ({ transactions, onCategoryClick }: BarChartProps) => {
  const revenueByCategory = transactions
    .filter(t => parseValue(t.valor) > 0)
    .reduce((acc, transaction) => {
      const categoria = transaction.categoria || 'Outros';
      const valor = parseValue(transaction.valor);
      acc[categoria] = (acc[categoria] || 0) + valor;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(revenueByCategory)
    .map(([categoria, valor]) => ({
      name: categoria,
      value: valor,
      formatted: formatCurrency(valor)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 categories

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Receitas por fonte
      </h3>
      
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Nenhuma receita encontrada
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={chartData}
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                fontSize={12}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={80}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#019894"
                radius={[0, 4, 4, 0]}
                onClick={(data) => onCategoryClick(data.name)}
                className="cursor-pointer hover:opacity-80"
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
