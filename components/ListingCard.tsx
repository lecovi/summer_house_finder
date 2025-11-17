import React from 'react';
import type { Listing } from '../types';
import { timeSince } from '../utils/time';
import { 
    LocationIcon, StarIcon, PriceValueIcon, CarIcon, SofaIcon, PriceTagIcon,
    UsersIcon, CalendarIcon, CommentIcon, MercadoLibreIcon, ZonapropIcon, AirbnbIcon, LinkIcon,
    WhatsAppIcon, InstagramIcon, ClockIcon
} from './common/Icons';

interface ListingCardProps {
  listing: Listing;
  onSelect: () => void;
}

const ScoreBadge: React.FC<{ score: number, icon: React.ReactNode, title: string }> = ({ score, icon, title }) => (
    <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-surface text-on-surface-variant`} title={title}>
        {icon}
        <span>{score}</span>
    </div>
);

const SiteIcon: React.FC<{ site: string }> = ({ site }) => {
    const s = site.toLowerCase();
    if (s.includes('mercado libre')) return <MercadoLibreIcon />;
    if (s.includes('zonaprop')) return <ZonapropIcon />;
    if (s.includes('airbnb')) return <AirbnbIcon />;
    return <LinkIcon className="w-5 h-5" />;
};

const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect }) => {
  const lastComment = listing.comments.length > 0 ? listing.comments[listing.comments.length - 1] : null;

  const contactLink = listing.contactLink || '';
  const isWhatsApp = contactLink.includes('wa.me') || contactLink.includes('whatsapp.com');
  const isInstagram = contactLink.includes('instagram.com');

  return (
    <div
      onClick={onSelect}
      className="bg-surface-variant rounded-2xl overflow-hidden border border-outline-variant hover:bg-white/5 transition-colors duration-300 cursor-pointer flex flex-col group"
    >
      <div className="relative">
        <img
          src={listing.imageUrls[0] || 'https://picsum.photos/400/250'}
          alt={listing.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-primary text-on-primary text-lg font-bold px-4 py-1.5 rounded-xl flex items-center gap-2">
            <StarIcon className="w-5 h-5"/>
            <span>{listing.score}</span>
        </div>
        {listing.isNew && (
            <div className="absolute top-3 left-3 bg-tertiary-container text-on-tertiary-container text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                NUEVO
            </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-medium text-on-surface truncate" title={listing.name}>{listing.name}</h3>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-on-surface-variant mt-2">
            <div className="flex items-center gap-2" title={listing.location}>
                <LocationIcon />
                <span className="truncate">{listing.location}</span>
            </div>
            <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4"/>
                <span>{listing.capacity} personas</span>
            </div>
             <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4"/>
                <span>{listing.proximityToCABA} min</span>
            </div>
             <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4"/>
                <span className="truncate">{listing.availability}</span>
            </div>
        </div>

        <div className="flex items-center justify-between my-4">
            <div className="flex items-center gap-2 text-2xl text-primary font-normal">
                <PriceValueIcon />
                <span>${listing.price.toLocaleString('es-AR')}</span>
            </div>
             {contactLink && (
                <a href={contactLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2.5 bg-secondary-container text-on-secondary-container rounded-full hover:opacity-80 transition-opacity" title="Contactar">
                    {isWhatsApp && <WhatsAppIcon />}
                    {isInstagram && <InstagramIcon />}
                </a>
            )}
        </div>

        <p className="text-sm text-on-surface-variant flex-grow mb-4 line-clamp-2" title={listing.description}>
            {listing.description}
        </p>

        {lastComment && (
            <div className="mb-4 p-3 bg-surface rounded-lg flex items-start gap-3 text-xs text-on-surface-variant">
                <CommentIcon className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary"/>
                 <div className="flex-grow overflow-hidden">
                    <p className="italic truncate" title={lastComment.text}>
                        "{lastComment.text}"
                    </p>
                    <p className="text-outline text-right mt-1">{timeSince(lastComment.timestamp)}</p>
                </div>
            </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-outline-variant">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <ScoreBadge score={listing.scores.price} icon={<PriceTagIcon className="w-4 h-4"/>} title="Puntuación de Precio" />
                    <ScoreBadge score={listing.scores.comfort} icon={<SofaIcon className="w-4 h-4"/>} title="Puntuun de Confort" />
                    <ScoreBadge score={listing.scores.proximity} icon={<CarIcon className="w-4 h-4"/>} title="Puntuación de Proximidad"/>
                </div>
                 <div className="flex items-center gap-2">
                    {listing.sources.map((source) => (
                        <a 
                            key={source.url}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-on-surface-variant hover:text-primary transition-colors"
                            title={`Ver en ${source.site}`}
                        >
                            <SiteIcon site={source.site} />
                        </a>
                    ))}
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ListingCard;