
import { useQuery } from '@tanstack/react-query';
import { Transaction, ApiResponse } from '@/types/financial';

const API_ENDPOINT = 'https://hook2.chatify.marketing/webhook/financas';

interface ApiRequestData {
  wallet: string;
  start: string; // DD-MM-YYYY
  end: string;   // DD-MM-YYYY
}

const formatDateForAPI = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const fetchFinancialData = async (wallet: string, start: Date, end: Date): Promise<Transaction[]> => {
  const requestData: ApiRequestData = {
    wallet,
    start: formatDateForAPI(start),
    end: formatDateForAPI(end)
  };

  console.log('Fetching financial data:', requestData);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; // Return empty array for 404 (no data)
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle the new nested response structure
    if (Array.isArray(data) && data.length > 0 && data[0].response) {
      // New format: array with response object
      const apiResponse = data[0] as ApiResponse;
      if (apiResponse.response && Array.isArray(apiResponse.response.body)) {
        return apiResponse.response.body;
      }
    } else if (Array.isArray(data)) {
      // Fallback to direct array format
      return data;
    }

    // Handle empty or unexpected response
    console.warn('API returned unexpected data format:', data);
    return [];
  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw error;
  }
};

export const useFinancialData = (wallet: string, start: Date, end: Date, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['financial-data', wallet, formatDateForAPI(start), formatDateForAPI(end)],
    queryFn: () => fetchFinancialData(wallet, start, end),
    enabled: enabled && !!wallet,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
