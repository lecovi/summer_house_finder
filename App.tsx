import React, { useState, useEffect, useCallback } from 'react';
import type { Listing, Settings, ActivityLog, View } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { getListings, getSettings, getActivityLog, saveListings, saveSettings, saveActivityLog } from './services/storageService';
import { calculateScores } from './utils/scoring';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SettingsComponent from './components/Settings';
import ActivityLogComponent from './components/ActivityLog';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [listings, setListings] = useState<Listing[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [newListingCount, setNewListingCount] = useState(0);

  useEffect(() => {
    const loadedListings = getListings();
    const loadedSettings = getSettings();
    const loadedActivityLog = getActivityLog();

    setSettings(loadedSettings);
    const scoredListings = calculateScores(loadedListings, loadedSettings.weights);
    setListings(scoredListings);
    setActivityLog(loadedActivityLog);
    setNewListingCount(loadedListings.filter(l => l.isNew).length);
  }, []);
  
  const handleSetView = (newView: View) => {
    if (newView === 'dashboard') {
        const seenListings = listings.map(l => ({...l, isNew: false}));
        setListings(seenListings);
        saveListings(seenListings);
        setNewListingCount(0);
    }
    setView(newView);
  }

  const addActivity = useCallback((message: string) => {
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      message,
      timestamp: new Date().toISOString(),
    };
    const updatedLog = [newActivity, ...activityLog];
    setActivityLog(updatedLog);
    saveActivityLog(updatedLog);
  }, [activityLog]);

  const handleSetListings = useCallback((updatedListings: Listing[]) => {
      const scoredListings = calculateScores(updatedListings, settings.weights);
      setListings(scoredListings);
      saveListings(scoredListings);
      setNewListingCount(scoredListings.filter(l => l.isNew).length);
  }, [settings.weights]);

  const handleSetSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    const rescoredListings = calculateScores(listings, newSettings.weights);
    setListings(rescoredListings);
    saveListings(rescoredListings);
    addActivity('Configuración actualizada.');
  }, [listings, addActivity]);


  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard listings={listings} setListings={handleSetListings} settings={settings} addActivity={addActivity} />;
      case 'settings':
        return <SettingsComponent settings={settings} setSettings={handleSetSettings} />;
      case 'activity':
        return <ActivityLogComponent logs={activityLog} />;
      default:
        return <Dashboard listings={listings} setListings={handleSetListings} settings={settings} addActivity={addActivity}/>;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header currentView={view} setView={handleSetView} newListingCount={newListingCount} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;