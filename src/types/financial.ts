
export interface Transaction {
  row_number: number;
  wallet: number;
  timestamp: string; // DD/MM/YYYY HH:mm:ss
  phone: number;
  valor: number; // Now comes as number instead of string
  categoria: string;
  descricao: string;
  pagamento: string;
  name: string;
}

export interface ApiResponse {
  response: {
    body: Transaction[];
    headers: {
      'content-type': string;
    };
    statusCode: number;
  };
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
