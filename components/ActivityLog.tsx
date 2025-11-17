import React, { useState, useMemo } from 'react';
import type { ActivityLog } from '../types';
import { timeSince } from '../utils/time';
import { ClockIcon, SearchIcon, CalendarDaysIcon } from './common/Icons';

interface ActivityLogProps {
  logs: ActivityLog[];
}

const ActivityLogComponent: React.FC<ActivityLogProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filters = ['Todos', 'Búsqueda', 'Nuevos', 'Actualizaciones', 'Comentarios', 'Configuración'];

  const keywordMap: { [key: string]: string[] } = {
    'Búsqueda': ['investigación', 'investigando'],
    'Nuevos': ['nuevo anuncio'],
    'Actualizaciones': ['actualizado', 'editó'],
    'Comentarios': ['comentario añadido'],
    'Configuración': ['configuración actualizada'],
  };

  const filteredLogs = useMemo(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    return logs.filter(log => {
        const messageLower = log.message.toLowerCase();
        const matchesSearch = messageLower.includes(searchTerm.toLowerCase());
        
        if (!matchesSearch) return false;
        
        const logDate = new Date(log.timestamp);
        if (start && logDate < start) return false;
        if (end && logDate > end) return false;

        if (activeFilter === 'Todos') return true;
        
        const keywords = keywordMap[activeFilter];
        if (!keywords) return true;
        
        return keywords.some(keyword => messageLower.includes(keyword));
    });
  }, [logs, searchTerm, activeFilter, startDate, endDate]);


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-normal text-on-background">Actividad Reciente</h2>
        <p className="text-on-surface-variant mt-1">Un registro de los cambios y acciones que has realizado.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Buscar en actividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 bg-surface text-on-surface rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="relative">
                 <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 pl-10 bg-surface text-on-surface-variant rounded-full focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                 />
                 <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
            </div>
            <div className="relative">
                 <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 pl-10 bg-surface text-on-surface-variant rounded-full focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                 />
                 <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
            </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mt-2">
        {filters.map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-primary-container text-on-primary-container' : 'bg-surface text-on-surface-variant hover:bg-surface-variant'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="bg-surface-variant p-6 rounded-2xl">
        {filteredLogs.length > 0 ? (
          <ul className="space-y-4">
            {filteredLogs.map(log => (
              <li key={log.id} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <ClockIcon className="text-primary"/>
                </div>
                <div>
                  <p className="text-on-surface-variant">{log.message}</p>
                  <p className="text-xs text-outline">{timeSince(log.timestamp)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg text-on-surface">No se encontraron actividades.</h3>
            <p className="text-on-surface-variant mt-1">Intenta con otro filtro o término de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogComponent;
