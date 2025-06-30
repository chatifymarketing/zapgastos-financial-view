
import { DateRange } from '@/types/financial';
import { Calendar, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FilterSectionProps {
  wallet: string;
  onWalletChange: (wallet: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onLoadWallet: () => void;
  categoryFilter: string | null;
  searchFilter: string;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
}

export const FilterSection = ({
  wallet,
  onWalletChange,
  dateRange,
  onDateRangeChange,
  onLoadWallet,
  categoryFilter,
  searchFilter,
  onSearchChange,
  onClearFilters
}: FilterSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-soft p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Carteira/Telefone
          </label>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={wallet}
              onChange={(e) => onWalletChange(e.target.value)}
              placeholder="Digite a carteira"
              className="flex-1"
            />
            <Button onClick={onLoadWallet} size="sm">
              Carregar
            </Button>
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Período
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.start && dateRange?.end ? (
                  `${format(dateRange.start, "dd/MM/yyyy", { locale: ptBR })} - ${format(dateRange.end, "dd/MM/yyyy", { locale: ptBR })}`
                ) : (
                  <span>Selecione o período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                selected={{
                  from: dateRange.start,
                  to: dateRange.end
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onDateRangeChange({ start: range.from, end: range.to });
                  }
                }}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Buscar transação
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={searchFilter}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por descrição..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Filtros ativos
          </label>
          <div className="flex items-center space-x-2">
            {categoryFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                {categoryFilter}
              </span>
            )}
            {(categoryFilter || searchFilter) && (
              <Button 
                onClick={onClearFilters}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
