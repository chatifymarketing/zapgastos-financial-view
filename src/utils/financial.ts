
export const parseValue = (valueStr: string): number => {
  if (!valueStr || typeof valueStr !== 'string') return 0;
  
  // Remove "R$", spaces, and convert comma to dot
  const cleanValue = valueStr
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '') // Remove thousand separators
    .replace(',', '.') // Convert decimal comma to dot
    .trim();
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateStr: string): string => {
  // Input format: DD-MM-YYYY HH:mm:ss
  // Output format: DD/MM HH:mm
  const parts = dateStr.split(' ');
  if (parts.length !== 2) return dateStr;
  
  const datePart = parts[0]; // DD-MM-YYYY
  const timePart = parts[1]; // HH:mm:ss
  
  const dateComponents = datePart.split('-');
  if (dateComponents.length !== 3) return dateStr;
  
  const timeComponents = timePart.split(':');
  if (timeComponents.length < 2) return dateStr;
  
  return `${dateComponents[0]}/${dateComponents[1]} ${timeComponents[0]}:${timeComponents[1]}`;
};

export const parseDateString = (dateStr: string): Date => {
  // Input format: DD-MM-YYYY HH:mm:ss
  const parts = dateStr.split(' ');
  const datePart = parts[0]; // DD-MM-YYYY
  const timePart = parts[1] || '00:00:00'; // HH:mm:ss
  
  const [day, month, year] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  
  return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
};
