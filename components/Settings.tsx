import React, { useState, useEffect, useRef } from 'react';
import type { Settings } from '../types';
import Button from './common/Button';
import { TrashIcon, PlusIcon, EyeIcon, EyeOffIcon } from './common/Icons';

interface SettingsProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const SettingsComponent: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newSite, setNewSite] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const newSiteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      weights: { ...prev.weights, [name]: Number(value) },
    }));
    setHasChanges(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleAddSite = () => {
    if (newSite && !localSettings.sites.includes(newSite)) {
      setLocalSettings(prev => ({ ...prev, sites: [...prev.sites, newSite.trim()] }));
      setHasChanges(true);
      setNewSite('');
      newSiteInputRef.current?.focus();
    }
  };

  const handleRemoveSite = (siteToRemove: string) => {
    setLocalSettings(prev => ({
      ...prev,
      sites: prev.sites.filter(site => site !== siteToRemove),
    }));
    setHasChanges(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(localSettings);
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-normal text-on-background">Configuración</h2>
        <p className="text-on-surface-variant mt-1">
          Ajusta los parámetros para la puntuación de listados y el prompt para el análisis de IA.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-variant p-6 rounded-2xl space-y-6">
        <div>
            <h3 className="text-lg font-medium text-on-surface-variant mb-3">API Key de Gemini</h3>
            <p className="text-sm text-outline mb-3">Tu API Key se guarda localmente en tu navegador y no se comparte con nadie.</p>
            <div className="relative">
                <input
                type={showApiKey ? 'text' : 'password'}
                name="apiKey"
                value={localSettings.apiKey}
                onChange={handleInputChange}
                placeholder="Pega tu API Key aquí"
                className="w-full p-4 pr-12 bg-surface text-on-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                title={showApiKey ? 'Ocultar API Key' : 'Mostrar API Key'}
                className="absolute inset-y-0 right-0 px-4 flex items-center text-on-surface-variant hover:text-on-surface"
                >
                {showApiKey ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-on-surface-variant mb-4">Ponderación de Puntuación</h3>
          <div className="space-y-4">
            {Object.entries(localSettings.weights).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={key} className="capitalize block text-sm font-medium text-on-surface-variant mb-1">
                  {key} ({value}%)
                </label>
                <input
                  type="range"
                  id={key}
                  name={key}
                  min="0"
                  max="100"
                  value={value}
                  onChange={handleWeightChange}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-on-surface-variant mb-3">Prompt para Gemini</h3>
           <div className="bg-surface rounded-lg relative group">
            <textarea
              name="prompt"
              value={localSettings.prompt}
              onChange={handleInputChange}
              rows={12}
              className="w-full p-4 bg-transparent text-on-surface focus:outline-none"
              placeholder="Introduce el prompt que usará Gemini para procesar los datos..."
            />
             <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-outline group-focus-within:bg-primary transition-colors duration-200"></div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-on-surface-variant mb-3">Sitios a Consultar</h3>
          <div className="space-y-2">
            {localSettings.sites?.map(site => (
              <div key={site} className="flex items-center justify-between bg-surface p-3 rounded-lg">
                <span className="text-on-surface">{site}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSite(site)}
                  className="p-1.5 rounded-full text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
                  title={`Eliminar ${site}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <div className="relative flex-grow bg-surface rounded-lg">
                <input
                    ref={newSiteInputRef}
                    type="url"
                    value={newSite}
                    onChange={(e) => setNewSite(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddSite(); } }}
                    placeholder="www.ejemplo.com"
                    className="w-full p-3 bg-transparent text-on-surface focus:outline-none"
                />
            </div>
            <Button type="button" onClick={handleAddSite} variant="tonal" className="px-4">
              <PlusIcon />
            </Button>
          </div>
        </div>


        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={!hasChanges}>
            Guardar Cambios
          </Button>
          {showSuccess && <span className="text-primary text-sm">Configuración guardada exitosamente!</span>}
        </div>
      </form>
    </div>
  );
};

export default SettingsComponent;