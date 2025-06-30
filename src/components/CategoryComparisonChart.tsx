
import { Transaction } from '@/types/financial';
import { parseValue, formatCurrency } from '@/utils/financial';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CategoryComparisonChartProps {
  transactions: Transaction[];
}

export const CategoryComparisonChart = ({ transactions }: CategoryComparisonChartProps) => {
  // Group by category with both income and expenses
  const categoryData = transactions.reduce((acc, transaction) => {
    const categoria = transaction.categoria || 'Outros';
    const valor = parseValue(transaction.valor);
    
    if (!acc[categoria]) {
      acc[categoria] = {
        categoria,
        receitas: 0,
        despesas: 0,
        transacoes: 0,
        saldoCategoria: 0
      };
    }
    
    if (valor > 0) {
      acc[categoria].receitas += valor;
    } else {
      acc[categoria].despesas += Math.abs(valor);
    }
    
    acc[categoria].transacoes += 1;
    acc[categoria].saldoCategoria = acc[categoria].receitas - acc[categoria].despesas;
    
    return acc;
  }, {} as Record<string, any>);

  // Convert to array and sort by total activity (receitas + despesas)
  const chartData = Object.values(categoryData)
    .map((item: any) => ({
      ...item,
      totalAtividade: item.receitas + item.despesas
    }))
    .sort((a: any, b: any) => b.totalAtividade - a.totalAtividade)
    .slice(0, 10); // Top 10 most active categories

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-green-600">
              Receitas: {formatCurrency(data.receitas)}
            </p>
            <p className="text-red-600">
              Despesas: {formatCurrency(data.despesas)}
            </p>
            <p className="text-blue-600 font-medium">
              Saldo: {formatCurrency(data.saldoCategoria)}
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
        Análise por categoria
      </h3>
      
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Nenhum dado disponível
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="categoria" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Bar
                dataKey="receitas"
                fill="#10B981"
                name="Receitas"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="despesas"
                fill="#EF4444"
                name="Despesas"
                radius={[2, 2, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="saldoCategoria"
                stroke="#019894"
                strokeWidth={3}
                name="Saldo Categoria"
                dot={{ fill: '#019894', strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
