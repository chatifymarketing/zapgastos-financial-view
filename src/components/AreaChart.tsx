
import { Transaction } from '@/types/financial';
import { parseValue, formatCurrency } from '@/utils/financial';
import { parseDateString } from '@/utils/financial';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AreaChartProps {
  transactions: Transaction[];
}

export const AreaChart = ({ transactions }: AreaChartProps) => {
  // Group transactions by date
  const dailyData = transactions.reduce((acc, transaction) => {
    const date = parseDateString(transaction.timestamp);
    const dateKey = format(date, 'yyyy-MM-dd');
    const valor = parseValue(transaction.valor);
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        receita: 0,
        despesa: 0,
        transactions: []
      };
    }
    
    if (valor > 0) {
      acc[dateKey].receita += valor;
    } else {
      acc[dateKey].despesa += Math.abs(valor);
    }
    
    acc[dateKey].transactions.push(transaction);
    return acc;
  }, {} as Record<string, any>);

  // Convert to array and sort by date
  const sortedDays = Object.values(dailyData)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate accumulated balance
  let saldoAcumulado = 0;
  const chartData = sortedDays.map((day: any) => {
    const saldoDia = day.receita - day.despesa;
    saldoAcumulado += saldoDia;
    
    return {
      date: day.date,
      dateFormatted: format(new Date(day.date), 'dd/MM', { locale: ptBR }),
      receita: day.receita,
      despesa: day.despesa,
      saldoAcumulado: saldoAcumulado
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium mb-2">{data.dateFormatted}</p>
          <div className="space-y-1 text-sm">
            <p className="text-green-600">
              Receita: {formatCurrency(data.receita)}
            </p>
            <p className="text-red-600">
              Despesa: {formatCurrency(data.despesa)}
            </p>
            <p className="text-gray-700 font-medium">
              Saldo: {formatCurrency(data.saldoAcumulado)}
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
        Fluxo de caixa diário
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
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="dateFormatted" 
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis 
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="receita"
                stackId="1"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorReceita)"
              />
              <Area
                type="monotone"
                dataKey="despesa"
                stackId="2"
                stroke="#EF4444"
                fillOpacity={1}
                fill="url(#colorDespesa)"
              />
              
              {/* Accumulated balance line */}
              <Line
                type="monotone"
                dataKey="saldoAcumulado"
                stroke="#019894"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
