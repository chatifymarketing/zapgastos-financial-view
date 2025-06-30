
import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, subDays, subMonths, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from '@/types/financial';

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const presetRanges = [
  {
    label: 'Este mês',
    getValue: () => ({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date())
    })
  },
  {
    label: 'Mês passado',
    getValue: () => ({
      start: startOfMonth(subMonths(new Date(), 1)),
      end: endOfMonth(subMonths(new Date(), 1))
    })
  },
  {
    label: 'Últimos 7 dias',
    getValue: () => ({
      start: subDays(new Date(), 6),
      end: new Date()
    })
  },
  {
    label: 'Últimos 30 dias',
    getValue: () => ({
      start: subDays(new Date(), 29),
      end: new Date()
    })
  },
  {
    label: 'Últimos 90 dias',
    getValue: () => ({
      start: subDays(new Date(), 89),
      end: new Date()
    })
  },
  {
    label: 'Este ano',
    getValue: () => ({
      start: startOfYear(new Date()),
      end: endOfYear(new Date())
    })
  }
];

export const DateRangePicker = ({ dateRange, onDateRangeChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange>(dateRange);
  const [selectedPreset, setSelectedPreset] = useState<string>('Este mês');

  const formatDateRange = (range: DateRange) => {
    if (!range.start || !range.end) return 'Selecione o período';
    
    const startStr = format(range.start, "dd/MM/yyyy", { locale: ptBR });
    const endStr = format(range.end, "dd/MM/yyyy", { locale: ptBR });
    
    return `${startStr} - ${endStr}`;
  };

  const handlePresetClick = (preset: typeof presetRanges[0]) => {
    const newRange = preset.getValue();
    setTempRange(newRange);
    setSelectedPreset(preset.label);
    onDateRangeChange(newRange);
    setIsOpen(false);
  };

  const handleApply = () => {
    if (tempRange.start && tempRange.end) {
      onDateRangeChange(tempRange);
      setSelectedPreset('Personalizado');
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTempRange(dateRange);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Período
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{formatDateRange(dateRange)}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row">
            {/* Presets */}
            <div className="border-b sm:border-b-0 sm:border-r p-3 space-y-1 min-w-[140px]">
              <div className="text-sm font-medium text-gray-700 mb-2">Períodos</div>
              {presetRanges.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors",
                    selectedPreset === preset.label && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            
            {/* Calendar */}
            <div className="p-3">
              <CalendarComponent
                mode="range"
                selected={{
                  from: tempRange.start,
                  to: tempRange.end
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setTempRange({ start: range.from, end: range.to });
                    setSelectedPreset('Personalizado');
                  }
                }}
                numberOfMonths={1}
                className="pointer-events-auto"
                locale={ptBR}
              />
              
              {/* Custom date inputs */}
              <div className="border-t pt-3 mt-3 space-y-2">
                <div className="text-sm font-medium text-gray-700">Personalizado</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Início</label>
                    <Input
                      type="date"
                      value={tempRange.start ? format(tempRange.start, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setTempRange(prev => ({ ...prev, start: new Date(e.target.value) }));
                          setSelectedPreset('Personalizado');
                        }
                      }}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Fim</label>
                    <Input
                      type="date"
                      value={tempRange.end ? format(tempRange.end, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setTempRange(prev => ({ ...prev, end: new Date(e.target.value) }));
                          setSelectedPreset('Personalizado');
                        }
                      }}
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-end space-x-2 mt-3 pt-3 border-t">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleApply}>
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
