import React from 'react';
import { Leaf, ExternalLink, DollarSign } from 'lucide-react';

const RecommendationCard = ({ recommendation, variant = 'withImage' }) => {
  const { brandName, itemName, description, ecoImpact, styleMatch, estimatedPrice } = recommendation;

  const handleLearnMore = () => {
    // In a real app, this would link to the actual product page
    window.open(`https://www.google.com/search?q=${brandName} ${itemName}`, '_blank');
  };

  return (
    <div className={`bg-surface rounded-lg shadow-md card-hover animate-slide-up ${
      variant === 'compact' ? 'p-4' : 'p-6'
    }`}>
      {variant === 'withImage' && (
        <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-md mb-4 flex items-center justify-center">
          <Leaf className="w-12 h-12 text-primary/60" />
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{itemName}</h3>
          <p className="text-sm text-accent font-medium">{brandName}</p>
        </div>
        
        <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
        
        <div className="bg-primary/5 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Leaf className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-primary mb-1">Eco Impact</p>
              <p className="text-sm text-text-secondary">{ecoImpact}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-text-secondary">
            <span className="font-medium">Style Match:</span> {styleMatch}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-text-primary">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold">{estimatedPrice}</span>
            </div>
            
            <button
              onClick={handleLearnMore}
              className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              Learn More
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;