import React from 'react';
import type { SearchProgress } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';
import { SparklesIcon, CheckCircleIcon, ExclamationTriangleIcon } from './common/Icons';

interface SearchProgressModalProps {
  progress: SearchProgress;
  onClose: () => void;
}

const SearchProgressModal: React.FC<SearchProgressModalProps> = ({ progress, onClose }) => {
  if (!progress.open) {
    return null;
  }

  const getTitle = () => {
    switch (progress.status) {
      case 'searching': return 'Investigando Anuncios';
      case 'done': return 'Investigación Completada';
      case 'error': return 'Error en la Investigación';
    }
  };
  
  const renderContent = () => {
    switch (progress.status) {
      case 'searching':
        return (
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="text-lg text-on-surface-variant">{progress.message}</p>
            {progress.sites && progress.sites.length > 0 && (
                <div className="mt-6 text-left">
                    <h4 className="font-medium text-on-surface mb-2">Sitios a consultar:</h4>
                    <ul className="space-y-2">
                        {progress.sites.map(site => (
                            <li key={site} className="flex items-center gap-3 bg-surface-variant p-2 rounded-md text-sm text-on-surface-variant truncate">
                                <SparklesIcon className="w-4 h-4 text-secondary flex-shrink-0" />
                                <span className="truncate">{site}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
        );
      case 'done':
        const summary = progress.summary as { new: number; updated: number };
        return (
          <div className="text-center">
            <CheckCircleIcon className="w-20 h-20 text-primary mx-auto mb-4" />
            <p className="text-xl font-medium text-on-surface mb-2">{progress.message}</p>
            <p className="text-on-surface-variant">
              Se encontraron <span className="font-bold text-on-surface">{summary.new}</span> nuevos anuncios y se actualizaron <span className="font-bold text-on-surface">{summary.updated}</span>.
            </p>
          </div>
        );
      case 'error':
        return (
           <div className="text-center">
            <ExclamationTriangleIcon className="w-20 h-20 text-error mx-auto mb-4" />
            <p className="text-xl font-medium text-on-surface mb-2">{progress.message}</p>
            <p className="text-error bg-error-container/30 p-3 rounded-lg text-sm">{progress.summary as string}</p>
          </div>
        );
    }
  };
  
  const renderFooter = () => (
    <div className="mt-6 flex justify-end">
      {progress.status !== 'searching' && (
         <Button onClick={onClose} variant="filled">
           Cerrar
         </Button>
      )}
    </div>
  );

  return (
    <Modal title={getTitle()} onClose={onClose}>
      <div>
        {renderContent()}
        {renderFooter()}
      </div>
    </Modal>
  );
};

export default SearchProgressModal;
