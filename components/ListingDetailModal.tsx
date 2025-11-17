import React, { useState } from 'react';
import type { Listing } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';
import { timeSince } from '../utils/time';
import { 
    LocationIcon, PriceValueIcon, WhatsAppIcon, InstagramIcon, CommentIcon, PlusIcon, SofaIcon, 
    UsersIcon, BuildingIcon, ClockIcon, PencilIcon, StarIcon, PriceTagIcon, CarIcon 
} from './common/Icons';
import { COMMON_AMENITIES } from '../constants';


const FormInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="relative bg-surface rounded-t-lg pt-6 px-3 pb-2 focus-within:border-primary border-b-2 border-outline w-full">
        <input {...props} className="w-full bg-transparent text-on-surface-variant outline-none peer" required />
        <label className="absolute top-4 left-3 text-on-surface-variant transition-all duration-200 peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-primary peer-valid:-translate-y-3 peer-valid:text-xs">
            {props.placeholder}
        </label>
    </div>
);

const FormTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
     <div className="relative bg-surface rounded-t-lg pt-6 px-3 pb-2 focus-within:border-primary border-b-2 border-outline w-full">
        <textarea {...props} className="w-full bg-transparent text-on-surface-variant outline-none peer" required />
        <label className="absolute top-4 left-3 text-on-surface-variant transition-all duration-200 peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-primary peer-valid:-translate-y-3 peer-valid:text-xs">
            {props.placeholder}
        </label>
    </div>
);


interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
  onUpdateListing: (listing: Listing) => void;
  addActivity: (message: string) => void;
}

const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose, onUpdateListing, addActivity }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedListing, setEditedListing] = useState<Listing>(listing);

  const handleNextImage = () => setCurrentImageIndex((prev) => (prev + 1) % listing.imageUrls.length);
  const handlePrevImage = () => setCurrentImageIndex((prev) => (prev - 1 + listing.imageUrls.length) % listing.imageUrls.length);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const updatedListing = {
        ...listing,
        comments: [...listing.comments, { text: newComment, timestamp: new Date().toISOString() }],
      };
      onUpdateListing(updatedListing);
      addActivity(`Comentario añadido a "${listing.name}".`);
      setNewComment('');
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['price', 'proximityToCABA', 'capacity'].includes(name);
    setEditedListing(prev => ({ ...prev, [name]: isNumeric ? Number(value) || 0 : value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = editedListing.comfortFeatures || [];
    const newAmenities = checked
      ? [...currentAmenities, amenity]
      : currentAmenities.filter(a => a !== amenity);
    setEditedListing(prev => ({ ...prev, comfortFeatures: newAmenities }));
  };
  
  const generateChangesSummary = (original: Listing, updated: Listing): string => {
      const changes: string[] = [];
      if (original.name !== updated.name) changes.push(`nombre`);
      if (original.price !== updated.price) changes.push(`precio a $${updated.price.toLocaleString('es-AR')}`);
      if (original.description !== updated.description) changes.push('descripción');
      if (original.location !== updated.location) changes.push(`ubicación`);
      if (original.capacity !== updated.capacity) changes.push(`capacidad a ${updated.capacity}`);
      if (original.proximityToCABA !== updated.proximityToCABA) changes.push(`proximidad a ${updated.proximityToCABA} min`);
      if (JSON.stringify(original.comfortFeatures.sort()) !== JSON.stringify(updated.comfortFeatures.sort())) changes.push('comodidades');

      if (changes.length === 0) return 'Sin cambios.';
      if (changes.length > 3) return `Se actualizaron ${changes.length} atributos.`;
      return `Cambios: ${changes.join(', ')}.`;
  }

  const handleSaveChanges = () => {
      const summary = generateChangesSummary(listing, editedListing);
      onUpdateListing(editedListing);
      addActivity(`Se editó "${listing.name}". ${summary}`);
      setIsEditing(false);
  };
  
  const contactLink = listing.contactLink || '';
  const isWhatsApp = contactLink.includes('wa.me');
  const isInstagram = contactLink.includes('instagram.com');

  const modalTitle = (
    <div className="flex justify-between items-center w-full">
      <span className="truncate pr-4">{isEditing ? `Editando: ${listing.name}`: listing.name}</span>
      {!isEditing && (
        <Button onClick={() => setIsEditing(true)} variant="tonal" className="px-4 py-2 text-sm">
          <PencilIcon className="w-4 h-4 mr-2" />
          Editar
        </Button>
      )}
    </div>
  );

  return (
    <Modal title={modalTitle as any} onClose={onClose} size="large">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Image & Scores */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <img src={listing.imageUrls[currentImageIndex] || 'https://picsum.photos/600/400'} alt={`${listing.name}`} className="w-full h-60 object-cover rounded-2xl" />
            {listing.imageUrls.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-surface/50 text-white p-2 rounded-full hover:bg-surface/75 transition">‹</button>
                <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-surface/50 text-white p-2 rounded-full hover:bg-surface/75 transition">›</button>
              </>
            )}
          </div>
          <div>
            <h4 className="font-medium text-on-surface mb-3 flex items-center gap-2"><StarIcon /> Puntuación</h4>
            <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-on-surface-variant"><PriceTagIcon className="w-4 h-4 text-secondary"/> Precio</span>
                    <span className="font-medium text-on-surface">{listing.scores.price} / 100</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-on-surface-variant"><SofaIcon className="w-4 h-4 text-secondary"/> Confort</span>
                    <span className="font-medium text-on-surface">{listing.scores.comfort} / 100</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-on-surface-variant"><CarIcon className="w-4 h-4 text-secondary"/> Cercanía</span>
                    <span className="font-medium text-on-surface">{listing.scores.proximity} / 100</span>
                </div>
                 <div className="flex justify-between items-center text-lg pt-2 border-t border-outline-variant">
                    <span className="flex items-center gap-2 font-bold text-on-surface">Total</span>
                    <span className="font-bold text-primary">{listing.score} / 100</span>
                </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Details */}
        <div className="lg:col-span-3 space-y-4">
            {isEditing ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                 <FormInput name="name" value={editedListing.name} onChange={handleEditChange} placeholder="Nombre"/>
                 <FormTextarea name="description" value={editedListing.description} onChange={handleEditChange} placeholder="Descripción" rows={4}/>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <FormInput name="price" type="number" value={editedListing.price} onChange={handleEditChange} placeholder="Precio"/>
                     <FormInput name="location" value={editedListing.location} onChange={handleEditChange} placeholder="Ubicación"/>
                     <FormInput name="capacity" type="number" value={editedListing.capacity} onChange={handleEditChange} placeholder="Capacidad (personas)"/>
                     <FormInput name="proximityToCABA" type="number" value={editedListing.proximityToCABA} onChange={handleEditChange} placeholder="Proximidad a CABA (min)"/>
                     <FormInput name="contactLink" value={editedListing.contactLink} onChange={handleEditChange} placeholder="Link de Contacto"/>
                     <FormInput name="propertyType" value={editedListing.propertyType} onChange={handleEditChange} placeholder="Tipo de Propiedad"/>
                 </div>
                 <div>
                    <h4 className="font-medium text-on-surface mb-2">Comodidades</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 max-h-32 overflow-y-auto">
                        {COMMON_AMENITIES.map(amenity => (
                            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={editedListing.comfortFeatures.includes(amenity)} onChange={(e) => handleAmenityChange(amenity, e.target.checked)} className="h-4 w-4 rounded border-outline bg-surface text-primary focus:ring-primary"/>
                                <span className="text-on-surface-variant capitalize text-sm">{amenity}</span>
                            </label>
                        ))}
                    </div>
                 </div>
              </div>
            ) : (
                <>
                    <p className="text-on-surface-variant">{listing.description}</p>
                    <div className="flex items-center gap-2 text-primary text-3xl font-normal">
                        <PriceValueIcon />
                        <span>${listing.price.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-on-surface-variant text-sm">
                        <div className="flex items-center gap-2"><LocationIcon /><span>{listing.location}</span></div>
                        <div className="flex items-center gap-2"><ClockIcon /><span>{listing.proximityToCABA} min de CABA</span></div>
                        <div className="flex items-center gap-2"><UsersIcon /><span>{listing.capacity} personas</span></div>
                        <div className="flex items-center gap-2"><BuildingIcon /><span>{listing.propertyType}</span></div>
                    </div>
                    <div className="pt-2">
                        <h4 className="font-medium text-on-surface mb-2 flex items-center gap-2"><SofaIcon /> Comodidades</h4>
                        <div className="flex flex-wrap gap-2">
                            {listing.comfortFeatures.map(f => <span key={f} className="bg-secondary-container text-on-secondary-container text-xs font-medium px-3 py-1.5 rounded-lg">{f}</span>)}
                        </div>
                    </div>
                    {contactLink && (
                        <a href={contactLink} target="_blank" rel="noopener noreferrer" className="block pt-2">
                            <Button variant='filled' className="w-full flex justify-center items-center gap-2">
                                {isWhatsApp && <WhatsAppIcon />}
                                {isInstagram && <InstagramIcon />}
                                <span>Contactar</span>
                            </Button>
                        </a>
                    )}
                </>
            )}
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 pt-6 border-t border-outline-variant flex justify-end gap-3">
          <Button variant="text" onClick={() => { setIsEditing(false); setEditedListing(listing); }}>Cancelar</Button>
          <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
        </div>
      )}
      
      {!isEditing && (
         <div className="mt-6 pt-6 border-t border-outline-variant">
            <h3 className="text-lg font-medium text-on-surface mb-4 flex items-center gap-2"><CommentIcon /> Comentarios</h3>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2 mb-4">
                {listing.comments.length > 0 ? [...listing.comments].reverse().map((c, i) => (
                    <div key={i} className="bg-surface-variant p-3 rounded-lg text-sm">
                        <p className="text-on-surface-variant">{c.text}</p>
                        <p className="text-xs text-outline mt-1 text-right">{timeSince(c.timestamp)}</p>
                    </div>
                )) : <p className="text-outline text-sm">No hay comentarios todavía.</p>}
            </div>
            <div className="flex gap-2 items-center group">
                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddComment()} placeholder="Añadir un comentario..." className="w-full p-3 bg-surface-variant text-on-surface-variant rounded-full focus:outline-none focus:ring-2 focus:ring-primary" />
                <button onClick={handleAddComment} className="flex-shrink-0 p-3 rounded-full bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50" disabled={!newComment.trim()}><PlusIcon /></button>
            </div>
        </div>
      )}
    </Modal>
  );
};

export default ListingDetailModal;