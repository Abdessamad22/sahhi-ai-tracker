// Utility functions for consistent number formatting throughout the app

// Convert Arabic-Indic numerals to Western numerals
export function toWesternNumerals(str: string | number): string {
  if (typeof str === 'number') str = str.toString();
  
  const arabicToWestern: { [key: string]: string } = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  
  return str.replace(/[٠-٩]/g, char => arabicToWestern[char] || char);
}

// Format number ensuring Western numerals are used
export function formatNumberWestern(num: number): string {
  const formatted = num.toLocaleString('fr-FR');
  return toWesternNumerals(formatted);
}

// Format decimal number with specific precision using Western numerals
export function formatDecimalWestern(num: number, decimals: number = 1): string {
  const formatted = num.toFixed(decimals);
  return toWesternNumerals(formatted);
}

// Format date ensuring Western numerals
export function formatDateWestern(dateStr: string): string {
  const date = new Date(dateStr);
  const formatted = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(date);
  return toWesternNumerals(formatted);
}