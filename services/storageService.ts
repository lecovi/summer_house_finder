import type { Listing, Settings, ActivityLog } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

const LISTINGS_KEY = 'summer_house_listings';
const SETTINGS_KEY = 'summer_house_settings';
const ACTIVITY_LOG_KEY = 'summer_house_activity_log';

// Listings
export const getListings = (): Listing[] => {
  const data = localStorage.getItem(LISTINGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveListings = (listings: Listing[]): void => {
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
};

// Settings
export const getSettings = (): Settings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  const savedSettings = data ? JSON.parse(data) : {};
  // Fusiona con los valores por defecto para asegurar que las nuevas claves de configuración estén incluidas
  return { 
    ...DEFAULT_SETTINGS, 
    ...savedSettings, 
    weights: { ...DEFAULT_SETTINGS.weights, ...(savedSettings.weights || {}) } 
  };
};

export const saveSettings = (settings: Settings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// Activity Log
export const getActivityLog = (): ActivityLog[] => {
  const data = localStorage.getItem(ACTIVITY_LOG_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveActivityLog = (log: ActivityLog[]): void => {
  localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
};