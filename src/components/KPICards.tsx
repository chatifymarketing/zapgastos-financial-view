
import { Transaction } from '@/types/financial';
import { parseValue, formatCurrency } from '@/utils/financial';
import { TrendingUp, TrendingDown, CreditCard, Hash } from 'lucide-react';

interface KPICardsProps {
  transactions: Transaction[];
}

export const KPICards = ({ transactions }: KPICardsProps) => {
  const saldoAtual = transactions.reduce((sum, t) => sum + parseValue(t.valor), 0);
  const entradas = transactions
    .filter(t => parseValue(t.valor) > 0)
    .reduce((sum, t) => sum + parseValue(t.valor), 0);
  const saidas = Math.abs(transactions
    .filter(t => parseValue(t.valor) < 0)
    .reduce((sum, t) => sum + parseValue(t.valor), 0));
  const totalTransacoes = transactions.length;

  const kpiData = [
    {
      title: 'Saldo Atual',
      value: formatCurrency(saldoAtual),
      icon: saldoAtual >= 0 ? TrendingUp : TrendingDown,
      color: saldoAtual >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: saldoAtual >= 0 ? 'bg-green-50' : 'bg-red-50',
      iconColor: saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Entradas',
      value: formatCurrency(entradas),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Saídas',
      value: formatCurrency(saidas),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      title: 'Transações',
      value: totalTransacoes.toString(),
      icon: Hash,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-soft p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {kpi.title}
                </p>
                <p className={`text-2xl font-bold ${kpi.color}`}>
                  {kpi.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                <Icon className={`h-6 w-6 ${kpi.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
