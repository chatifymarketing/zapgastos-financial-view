
export interface Transaction {
  timestamp: string; // DD-MM-YYYY HH:mm:ss
  descricao: string;
  categoria: string;
  pagamento: string;
  valor: string; // "-R$ 50,00" format
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface KPIData {
  saldoAtual: number;
  entradas: number;
  saidas: number;
  totalTransacoes: number;
}

export interface CategoryData {
  categoria: string;
  valor: number;
}

export interface DailyFlow {
  date: string;
  receita: number;
  despesa: number;
  saldoAcumulado: number;
}
