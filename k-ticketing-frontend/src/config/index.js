export const CONFIG = {
  USE_MOCK: true, // Toggle to false when integrating with the Lubuntu backend server
  API_BASE_URL: 'http://localhost:3000',
  KIOSK_ENABLED: import.meta.env.VITE_KIOSK_ENABLED === 'true', //Enable KIOSK mode
};