// ============================================================================
// SERVICE CARD COMPONENT - viitinhcortes
// ============================================================================

import { Service } from '../types';
import { Clock, Star } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onClick?: (service: Service) => void;
  selected?: boolean;
}

export function ServiceCard({ service, onClick, selected }: ServiceCardProps) {
  return (
    <button
      onClick={() => onClick?.(service)}
      className={`
        w-full text-left p-6 rounded-2xl transition-all duration-200
        ${selected 
          ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-2 border-amber-500 shadow-lg shadow-amber-500/20 scale-105' 
          : 'bg-gray-800/50 border border-gray-700 hover:border-amber-500/50 hover:scale-102'
        }
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            {service.nome}
          </h3>
          <p className="text-sm text-gray-400">
            {service.descricao}
          </p>
        </div>
        
        {service.destaque && (
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-semibold">TOP</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>{service.duracao_minutos} min</span>
        </div>
        
        <div className="text-2xl font-bold text-amber-400">
          R$ {service.preco.toFixed(2)}
        </div>
      </div>
    </button>
  );
}
