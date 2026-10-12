/** Central client env (see Frontend/.env.example). */
export const API_URL = import.meta.env.API_URL || '/api';
export const CLERK_PUBLISHABLE_KEY = import.meta.env.CLERK_PUBLISHABLE_KEY?.trim() || '';
