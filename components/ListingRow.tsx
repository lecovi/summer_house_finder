import React from 'react';
import type { Listing } from '../types';
import { LocationIcon, PriceValueIcon, StarIcon, UsersIcon, ClockIcon } from './common/Icons';

interface ListingRowProps {
  listing: Listing;
  onSelect: () => void;
}

const ListingRow: React.FC<ListingRowProps> = ({ listing, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="bg-surface-variant rounded-2xl hover:bg-white/5 transition-colors duration-300 cursor-pointer flex items-center p-3 gap-4"
    >
      <img
        src={listing.imageUrls[0] || 'https://picsum.photos/200'}
        alt={listing.name}
        className="w-24 h-24 sm:w-32 sm:h-24 object-cover rounded-xl flex-shrink-0"
      />
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 items-center">
        <div className="sm:col-span-2">
          <h3 className="text-base sm:text-lg font-medium text-on-surface truncate">{listing.name}</h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant mt-1">
            <LocationIcon />
            <span>{listing.location}</span>
          </div>
        </div>
        
        <div className="flex flex-row sm:flex-col items-start sm:items-end gap-1 sm:gap-0">
            <div className="flex items-center gap-2 text-xl text-primary font-normal">
                <PriceValueIcon className="w-4 h-4" />
                <span>${listing.price.toLocaleString('es-AR')}</span>
            </div>
             <div className="sm:hidden text-outline text-xs">/ semana</div>
        </div>

        <div className="col-span-full flex items-center flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-on-surface-variant mt-1">
            <div className="flex items-center gap-1" title="Capacidad">
                <UsersIcon className="w-4 h-4" />
                <span>{listing.capacity} personas</span>
            </div>
             <div className="flex items-center gap-1" title="Proximidad a CABA">
                <ClockIcon className="w-4 h-4" />
                <span>{listing.proximityToCABA} min</span>
            </div>
            <div className="flex items-center gap-1" title="Comodidades">
                <span>{listing.comfortFeatures.length} comodidades</span>
            </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container font-bold p-3 rounded-full w-20 h-20 ml-auto flex-shrink-0">
        <StarIcon className="w-6 h-6"/>
        <span className="text-2xl font-normal">{listing.score}</span>
      </div>
    </div>
  );
};

export default ListingRow;