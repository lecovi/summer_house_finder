import React, { useState, useMemo } from 'react';
import type { Listing, Settings } from '../types';
import { processScrapedData } from '../services/geminiService';
import { MOCK_SCRAPED_DATA } from '../constants';
import ListingCard from './ListingCard';
import ListingRow from './ListingRow';
import ListingDetailModal from './ListingDetailModal';
import FilterBar from './FilterBar';
import AddManualModal from './AddManualModal';
import { PlusIcon, FilterIcon, SparklesIcon, GridIcon, ListIcon } from './common/Icons';
import Button from './common/Button';

interface DashboardProps {
  listings: Listing[];
  setListings: (listings: Listing[]) => void;
  settings: Settings;
  addActivity: (message: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ listings, setListings, settings, addActivity }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    amenities: [] as string[],
    maxProximity: 120,
    minCapacity: 8,
  });

  const handleSearch = async () => {
    if (!settings.apiKey || !settings.apiKey.trim()) {
      addActivity("Error: API Key de Gemini no configurada. Ve a Configuración para añadirla antes de investigar.");
      return;
    }
    
    setIsSearching(true);
    addActivity("Iniciando investigación de anuncios...");
    try {
      const processedData = await processScrapedData(MOCK_SCRAPED_DATA, settings.prompt, settings.apiKey);
      
      const updatedListings = [...listings].map(l => ({...l, isNew: false})); // Mark old ones as not new
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
                    ...existingListing,
                    ...item,
                    sources: [...existingListing.sources, ...newSources],
                    isNew: true, // Mark as new if price changed
                    comments: existingListing.comments,
                };
                addActivity(`Anuncio actualizado: "${existingListing.name}". El precio cambió a $${item.price.toLocaleString('es-AR')}.`);
                updatedItemsCount++;
            }
        } else {
            const isDuplicateByName = updatedListings.some(l => l.name.toLowerCase() === item.name.toLowerCase() && l.location.toLowerCase() === item.location.toLowerCase());
            if (!isDuplicateByName) {
                const newListing: Listing = {
                    ...item,
                    id: `listing-${Date.now()}-${Math.random()}`,
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

      addActivity(`Investigación completada: ${newFoundListings.length} nuevos, ${updatedItemsCount} actualizados.`);

    } catch (error) {
      console.error("Search failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Error durante la investigación de anuncios.";
      addActivity(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleUpdateListing = (listing: Listing) => {
    const updatedListings = listings.map(l => l.id === listing.id ? listing : l);
    setListings(updatedListings);
    setSelectedListing(listing); 
  };
  
  const handleSelectListing = (listing: Listing) => {
      setSelectedListing(listing);
  };

  const filteredAndSortedListings = useMemo(() => {
    const filtered = listings.filter(l => {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = l.name.toLowerCase().includes(searchLower) || l.location.toLowerCase().includes(searchLower) || l.description.toLowerCase().includes(searchLower);
        const matchesProximity = l.proximityToCABA <= filters.maxProximity;
        const matchesCapacity = l.capacity >= filters.minCapacity;
        const matchesAmenities = filters.amenities.every(amenity => 
            l.comfortFeatures.some(feature => feature.toLowerCase().includes(amenity.toLowerCase()))
        );
        return matchesSearch && matchesProximity && matchesCapacity && matchesAmenities;
    });
    return filtered.sort((a, b) => b.score - a.score);
  }, [listings, filters]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-normal text-on-background">Listados de Propiedades</h2>
        <div className="flex items-center gap-2">
            <Button onClick={handleSearch} variant="filled" className="flex items-center gap-2" disabled={isSearching}>
                {isSearching ? <div className="w-5 h-5 border-2 border-on-primary/50 border-t-on-primary rounded-full animate-spin"></div> : <SparklesIcon />}
                <span>{isSearching ? 'Investigando...' : 'Investigar'}</span>
            </Button>
            <Button onClick={() => setShowFilters(!showFilters)} variant="tonal" className="flex items-center gap-2">
                <FilterIcon />
                <span className="hidden sm:inline">{showFilters ? 'Ocultar' : 'Filtros'}</span>
            </Button>
            <div className="flex items-center rounded-full border border-outline p-0.5 bg-surface-variant">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-full ${viewMode === 'grid' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface'}`} title="Vista de cuadrícula"><GridIcon /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full ${viewMode === 'list' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface'}`} title="Vista de lista"><ListIcon /></button>
            </div>
        </div>
      </div>

      {showFilters && <FilterBar filters={filters} onFilterChange={setFilters} />}

      {filteredAndSortedListings.length > 0 ? (
        <div className="mt-6">
          {viewMode === 'grid' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedListings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} onSelect={() => handleSelectListing(listing)} />
                ))}
             </div>
          ) : (
            <div className="space-y-4">
                {filteredAndSortedListings.map(listing => (
                    <ListingRow key={listing.id} listing={listing} onSelect={() => handleSelectListing(listing)} />
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-surface-variant rounded-2xl mt-6">
          <h3 className="text-xl font-semibold text-on-surface">No se encontraron listados.</h3>
          <p className="text-on-surface-variant mt-2">Intenta ajustar los filtros o investiga nuevos anuncios.</p>
        </div>
      )}
      
      <button 
        onClick={() => setAddModalOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-on-primary p-4 rounded-2xl shadow-lg hover:opacity-90 transition-all duration-300 z-40 transform hover:scale-105"
        title="Agregar nuevo anuncio"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {isAddModalOpen && (
        <AddManualModal
            onClose={() => setAddModalOpen(false)}
            currentListings={listings}
            setListings={setListings}
            addActivity={addActivity}
            settings={settings}
        />
      )}


      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onUpdateListing={handleUpdateListing}
          addActivity={addActivity}
        />
      )}
    </div>
  );
};

export default Dashboard;
