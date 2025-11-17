import React from 'react';
import { COMMON_AMENITIES } from '../constants';

interface FilterBarProps {
  filters: {
    search: string;
    amenities: string[];
    maxProximity: number;
    minCapacity: number;
  };
  onFilterChange: (filters: FilterBarProps['filters']) => void;
}

const FormInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="relative bg-surface rounded-t-lg pt-6 px-3 pb-2 focus-within:border-primary border-b-2 border-outline">
        <input {...props} className="w-full bg-transparent text-on-surface-variant outline-none peer" />
        <label className="absolute top-4 left-3 text-on-surface-variant transition-all duration-200 peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-primary peer-valid:-translate-y-3 peer-valid:text-xs">
            {props.placeholder}
        </label>
    </div>
);


const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: name === 'maxProximity' || name === 'minCapacity' ? Number(value) : value });
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const newAmenities = checked
      ? [...filters.amenities, value]
      : filters.amenities.filter(a => a !== value);
    onFilterChange({ ...filters, amenities: newAmenities });
  };

  return (
    <div className="bg-surface-variant p-4 rounded-2xl mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <FormInput
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Buscar por palabra clave..."
            required
          />
        </div>

        {/* Min Capacity */}
        <div>
           <FormInput
            type="number"
            id="minCapacity"
            name="minCapacity"
            value={filters.minCapacity}
            onChange={handleInputChange}
            min="1"
            placeholder="Mínimo de personas"
            required
          />
        </div>

        {/* Max Proximity */}
        <div>
          <label htmlFor="maxProximity" className="block text-sm font-medium text-on-surface-variant mb-1">
            Distancia a CABA ({filters.maxProximity} min)
          </label>
          <input
            type="range"
            id="maxProximity"
            name="maxProximity"
            min="30"
            max="180"
            step="15"
            value={filters.maxProximity}
            onChange={handleInputChange}
            className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="text-sm font-medium text-on-surface-variant mb-2">Comodidades</h4>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {COMMON_AMENITIES.map(amenity => (
            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                value={amenity}
                checked={filters.amenities.includes(amenity)}
                onChange={handleAmenityChange}
                className="h-4 w-4 rounded border-outline bg-surface text-primary focus:ring-primary"
              />
              <span className="text-on-surface-variant capitalize text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;