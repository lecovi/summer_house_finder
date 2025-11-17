
import React from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'normal' | 'large';
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, size = 'normal' }) => {
  const sizeClass = size === 'large' ? 'max-w-4xl' : 'max-w-2xl';

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-surface rounded-3xl shadow-2xl w-full ${sizeClass} text-on-surface transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale`}
        onClick={(e) => e.stopPropagation()}
        style={{ animationFillMode: 'forwards' }}
      >
        <div className="flex justify-between items-center p-6 border-b border-outline-variant">
          <h2 className="text-2xl font-normal">{title}</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors text-2xl">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation-name: fade-in-scale; animation-duration: 0.2s; }
      `}</style>
    </div>
  );
};

export default Modal;