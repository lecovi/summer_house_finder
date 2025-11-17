import React, { useState } from 'react';
import type { Listing, Settings } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';
import { PlusIcon, CodeBracketIcon, SparklesIcon, DocumentTextIcon } from './common/Icons';
import { COMMON_AMENITIES, MOCK_SCRAPED_DATA } from '../constants';
import { processScrapedData } from '../services/geminiService';

interface AddListingsModalProps {
  onClose: () => void;
  currentListings: Listing[];
  setListings: (listings: Listing[]) => void;
  addActivity: (message: string) => void;
  settings: Settings;
}

const FormInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="relative bg-surface-variant rounded-t-lg pt-6 px-3 pb-2 focus-within:border-primary border-b-2 border-outline">
        <input {...props} className="w-full bg-transparent text-on-surface-variant outline-none peer" required/>
        <label className="absolute top-4 left-3 text-on-surface-variant transition-all duration-200 peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-primary peer-valid:-translate-y-3 peer-valid:text-xs">
            {props.placeholder}
        </label>
    </div>
);

const FormTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
     <div className="relative bg-surface-variant rounded-t-lg pt-6 px-3 pb-2 focus-within:border-primary border-b-2 border-outline">
        <textarea {...props} className="w-full bg-transparent text-on-surface-variant outline-none peer" required/>
        <label className="absolute top-4 left-3 text-on-surface-variant transition-all duration-200 peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-primary peer-valid:-translate-y-3 peer-valid:text-xs">
            {props.placeholder}
        </label>
    </div>
);

const AddListingsModal: React.FC<AddListingsModalProps> = ({ onClose, currentListings, setListings, addActivity, settings }) => {
  const [addMode, setAddMode] = useState<'paste' | 'manual'>('paste');
  const [scrapedHtml, setScrapedHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFormState = {
    name: '', price: 0, description: '', location: '', contactLink: '',
    imageUrls: '', comfortFeatures: [] as string[], proximityToCABA: 90,
    propertyType: 'Casa de campo', capacity: 8,
    availability: 'Consultar', sources: [] as {site: string, url: string}[],
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleProcessHtml = async () => {
    if (!settings.apiKey || !settings.apiKey.trim()) {
      setError("API Key de Gemini no configurada. Por favor, añádela en la pantalla de Configuración.");
      return;
    }
    if (!scrapedHtml.trim()) {
      setError('El campo de HTML no puede estar vacío.');
      return;
    }
    setIsLoading(true);
    setError(null);
    addActivity("Iniciando análisis de HTML con IA...");

    try {
      const processedData = await processScrapedData(scrapedHtml, settings.prompt, settings.apiKey);
      
      const updatedListings = [...currentListings].map(l => ({...l, isNew: false})); // Mark old ones as not new
      const newFoundListings: Listing[] = [];
      let updatedItemsCount = 0;

      for (const item of processedData) {
        const existingIndex = updatedListings.findIndex(l => 
            l.sources.some(s => item.sources.some(newItemSource => s.url === newItemSource.url))
        );

        if (existingIndex > -1) {
            const existingListing = updatedListings[existingIndex];
            const priceChanged = existingListing.price !== item.price;
            
            if (priceChanged) {
                const existingUrls = new Set(existingListing.sources.map(s => s.url));
                const newSources = item.sources.filter(s => !existingUrls.has(s.url));
                
                updatedListings[existingIndex] = {
                    ...existingListing, ...item,
                    sources: [...existingListing.sources, ...newSources],
                    isNew: true, comments: existingListing.comments,
                };
                addActivity(`Anuncio actualizado: "${existingListing.name}". El precio cambió a $${item.price.toLocaleString('es-AR')}.`);
                updatedItemsCount++;
            }
        } else {
            const isDuplicateByName = updatedListings.some(l => l.name.toLowerCase() === item.name.toLowerCase() && l.location.toLowerCase() === item.location.toLowerCase());
            if (!isDuplicateByName) {
                const newListing: Listing = {
                    ...item, id: `listing-${Date.now()}-${Math.random()}`,
                    comments: [], score: 0,
                    scores: { price: 0, comfort: 0, proximity: 0 },
                    isNew: true,
                };
                newFoundListings.push(newListing);
                addActivity(`Nuevo anuncio encontrado: "${newListing.name}".`);
            }
        }
      }

      const finalListings = [...updatedListings, ...newFoundListings];
      setListings(finalListings);
      addActivity(`Análisis completado: ${newFoundListings.length} nuevos, ${updatedItemsCount} actualizados.`);
      onClose();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error inesperado al procesar el HTML.";
      setError(errorMessage);
      addActivity(`Error en análisis: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: ['price', 'proximityToCABA', 'capacity'].includes(name) ? Number(value) : value }));
  };
  
  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({...prev, comfortFeatures: checked ? [...prev.comfortFeatures, value] : prev.comfortFeatures.filter(a => a !== value)}));
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
    addActivity(`Se agregó manualmente el listado "${newListing.name}".`);
    onClose();
  };

  return (
    <Modal title="Agregar Nuevos Anuncios" onClose={onClose}>
      <div className="mb-4 border-b border-outline-variant">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button onClick={() => setAddMode('paste')} className={`${addMode === 'paste' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
            <CodeBracketIcon /> Pegar HTML
          </button>
          <button onClick={() => setAddMode('manual')} className={`${addMode === 'manual' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
            <PlusIcon /> Manual
          </button>
        </nav>
      </div>

      {addMode === 'paste' ? (
        <div className="space-y-4">
            <div className="text-sm text-on-surface-variant bg-surface p-3 rounded-lg">
              <p className="font-medium mb-1">¿Cómo funciona?</p>
              <ol className="list-decimal list-inside text-xs space-y-1">
                  <li>Ve a una página de anuncios (ej. Mercado Libre) en tu navegador.</li>
                  <li>Haz clic derecho en la página y selecciona "Inspeccionar".</li>
                  <li>En las herramientas de desarrollador, busca el elemento `<body>`.</li>
                  <li>Haz clic derecho en `<body>`, ve a "Copiar" y elige "Copiar outerHTML".</li>
                  <li>Pega el contenido en el campo de abajo.</li>
              </ol>
            </div>
          <textarea
            value={scrapedHtml}
            onChange={(e) => setScrapedHtml(e.target.value)}
            placeholder="Pega el código HTML aquí..."
            rows={8}
            className="w-full p-3 bg-surface-variant text-on-surface-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          {error && <p className="text-error text-sm">{error}</p>}
          <div className="flex justify-between items-center gap-3 pt-4">
            <Button onClick={() => setScrapedHtml(MOCK_SCRAPED_DATA)} variant="tonal" disabled={isLoading} className="text-xs px-3 py-2 flex items-center gap-1">
                <DocumentTextIcon /> Cargar Ejemplo
            </Button>
            <div className="flex items-center gap-2">
                <Button onClick={onClose} variant="text" disabled={isLoading}>Cancelar</Button>
                <Button onClick={handleProcessHtml} disabled={isLoading || !scrapedHtml.trim()} className="flex items-center gap-2">
                {isLoading ? <div className="w-5 h-5 border-2 border-on-primary/50 border-t-on-primary rounded-full animate-spin"></div> : <SparklesIcon />}
                <span>{isLoading ? 'Procesando...' : 'Procesar con IA'}</span>
                </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormInput name="name" value={formData.name} onChange={handleFormChange} placeholder="Nombre del Anuncio" />
                </div>
                <FormInput name="price" type="number" value={formData.price} onChange={handleFormChange} placeholder="Precio" />
                <FormInput name="location" value={formData.location} onChange={handleFormChange} placeholder="Ubicación" />
            </div>
            <FormTextarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Descripción" rows={3} />
            <FormTextarea name="imageUrls" value={formData.imageUrls} onChange={handleFormChange} placeholder="URLs de imágenes, separadas por comas" rows={2} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput name="contactLink" value={formData.contactLink} onChange={handleFormChange} placeholder="Link de Contacto (WhatsApp/IG)" />
                <FormInput name="capacity" type="number" value={formData.capacity} onChange={handleFormChange} placeholder="Capacidad" />
                <FormInput name="proximityToCABA" type="number" value={formData.proximityToCABA} onChange={handleFormChange} placeholder="Minutos a CABA" />
                <FormInput name="availability" value={formData.availability} onChange={handleFormChange} placeholder="Disponibilidad" />
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

export default AddListingsModal;