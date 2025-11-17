import React, { useState } from 'react';
import type { Listing, Settings } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';
import { PlusIcon, LinkIcon, SparklesIcon } from './common/Icons';
import { COMMON_AMENITIES, MOCK_SCRAPED_DATA } from '../constants';
import { processScrapedData } from '../services/geminiService';

interface AddManualModalProps {
  onClose: () => void;
  currentListings: Listing[];
  setListings: (listings: Listing[]) => void;
  addActivity: (message: string) => void;
  settings: Settings;
}

const FormInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="relative bg-surface-variant rounded-t-lg pt-6 px-3 pb-2 focus-within:border-primary border-b-2 border-outline">
        <input {...props} className="w-full bg-transparent text-on-surface-variant outline-none peer" />
        <label className="absolute top-4 left-3 text-on-surface-variant transition-all duration-200 peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-primary peer-valid:-translate-y-3 peer-valid:text-xs">
            {props.placeholder}
        </label>
    </div>
);

const FormTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
     <div className="relative bg-surface-variant rounded-t-lg pt-6 px-3 pb-2 focus-within:border-primary border-b-2 border-outline">
        <textarea {...props} className="w-full bg-transparent text-on-surface-variant outline-none peer" />
        <label className="absolute top-4 left-3 text-on-surface-variant transition-all duration-200 peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-primary peer-valid:-translate-y-3 peer-valid:text-xs">
            {props.placeholder}
        </label>
    </div>
);


const AddManualModal: React.FC<AddManualModalProps> = ({ onClose, currentListings, setListings, addActivity, settings }) => {
  const [addMode, setAddMode] = useState<'url' | 'manual'>('url');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFormState = {
    name: '', price: 0, description: '', location: '', contactLink: '',
    imageUrls: '', comfortFeatures: [] as string[], proximityToCABA: 90,
    propertyType: 'Casa de campo', capacity: 8,
    availability: 'Consultar', sources: [] as {site: string, url: string}[],
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleProcessUrl = async () => {
    if (!settings.apiKey || !settings.apiKey.trim()) {
      setError("API Key de Gemini no configurada. Por favor, añádela en la pantalla de Configuración.");
      return;
    }
    if (!url.trim()) {
      setError('La URL no puede estar vacía.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Simulate fetching and scraping the URL
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      // Use mock data for processing, as we can't scrape client-side
      const processedData = await processScrapedData(MOCK_SCRAPED_DATA, settings.prompt, settings.apiKey);
      
      // Find the first valid item that isn't a duplicate
      const newItemData = processedData.find(item => !currentListings.some(l => l.name === item.name));
      
      if (!newItemData) {
          throw new Error("No se pudo encontrar un nuevo anuncio válido en la URL o ya existe.");
      }

      const newListing: Listing = {
          ...newItemData,
          id: `listing-${Date.now()}-${Math.random()}`,
          comments: [], score: 0,
          scores: { price: 0, comfort: 0, proximity: 0 },
          contactLink: newItemData.contactLink || '',
          isNew: true,
      };
      
      setListings([...currentListings, newListing]);
      addActivity(`Se agregó "${newListing.name}" desde una URL.`);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al procesar la URL.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'proximityToCABA' || name === 'capacity' ? Number(value) : value }));
  };
  
  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const newAmenities = checked
      ? [...formData.comfortFeatures, value]
      : formData.comfortFeatures.filter(a => a !== value);
    setFormData(prev => ({...prev, comfortFeatures: newAmenities}));
  };

  const handleManualSubmit = () => {
     if (!formData.name.trim() || formData.price <= 0) {
      setError('El nombre y el precio son obligatorios.');
      return;
    }
    const newListing: Listing = {
        ...formData,
        id: `listing-${Date.now()}-${Math.random()}`,
        imageUrls: formData.imageUrls.split(',').map(url => url.trim()).filter(url => url),
        comments: [], score: 0,
        scores: { price: 0, comfort: 0, proximity: 0 },
        isNew: true,
        sources: formData.contactLink ? [{site: 'Manual', url: formData.contactLink}] : []
    };
    setListings([...currentListings, newListing]);
    addActivity(`Se agregó manually el listado "${newListing.name}".`);
    onClose();
  };

  return (
    <Modal title="Agregar Nuevo Anuncio" onClose={onClose}>
      <div className="mb-4 border-b border-outline-variant">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button onClick={() => setAddMode('url')} className={`${addMode === 'url' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
            <LinkIcon /> Desde URL
          </button>
          <button onClick={() => setAddMode('manual')} className={`${addMode === 'manual' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
            <PlusIcon /> Manual
          </button>
        </nav>
      </div>

      {addMode === 'url' ? (
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">Pega la URL de una publicación de Mercado Libre, Zonaprop, etc. La IA intentará extraer la información.</p>
          <FormInput
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL de la publicación"
            disabled={isLoading}
            required
          />
          {error && <p className="text-error text-sm">{error}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={onClose} variant="text" disabled={isLoading}>Cancelar</Button>
            <Button onClick={handleProcessUrl} disabled={isLoading || !url} className="flex items-center gap-2">
              {isLoading ? 'Procesando...' : <><SparklesIcon /> Procesar URL</>}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormInput name="name" value={formData.name} onChange={handleFormChange} placeholder="Nombre del Anuncio" required/>
                </div>
                <FormInput name="price" type="number" value={formData.price} onChange={handleFormChange} placeholder="Precio" required/>
                <FormInput name="location" value={formData.location} onChange={handleFormChange} placeholder="Ubicación" required/>
            </div>
            <FormTextarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Descripción" rows={3} required/>
            <FormTextarea name="imageUrls" value={formData.imageUrls} onChange={handleFormChange} placeholder="URLs de imágenes, separadas por comas" rows={2} required/>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput name="contactLink" value={formData.contactLink} onChange={handleFormChange} placeholder="Link de Contacto (WhatsApp/IG)" required/>
                <FormInput name="capacity" type="number" value={formData.capacity} onChange={handleFormChange} placeholder="Capacidad" required/>
                <FormInput name="proximityToCABA" type="number" value={formData.proximityToCABA} onChange={handleFormChange} placeholder="Minutos a CABA" required/>
                <FormInput name="availability" value={formData.availability} onChange={handleFormChange} placeholder="Disponibilidad" required/>
            </div>
            <div>
              <h4 className="text-sm font-medium text-on-surface-variant mb-2">Comodidades</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {COMMON_AMENITIES.map(amenity => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" value={amenity} checked={formData.comfortFeatures.includes(amenity)} onChange={handleAmenityChange} className="h-4 w-4 rounded border-outline bg-surface text-primary focus:ring-primary"/>
                    <span className="text-on-surface-variant capitalize text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
            {error && <p className="text-error text-sm mt-2">{error}</p>}
           <div className="flex justify-end gap-3 pt-4">
            <Button onClick={onClose} variant="text">Cancelar</Button>
            <Button onClick={handleManualSubmit}><PlusIcon/> Guardar Anuncio</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddManualModal;