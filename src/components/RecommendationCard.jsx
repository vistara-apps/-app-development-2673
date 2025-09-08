import React from 'react';
import { ExternalLink, Leaf, Droplets, Recycle, Award } from 'lucide-react';
import EcoTag from './EcoTag';

const RecommendationCard = ({ recommendation }) => {
  const { brandName, itemName, itemUrl, ecoImpactSummary, price, category } = recommendation;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-200 animate-fadeIn">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white mb-1">{itemName}</h4>
          <p className="text-accent font-medium">{brandName}</p>
          <p className="text-sm text-white/70">{category}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white">{price}</p>
        </div>
      </div>

      {/* Eco Impact Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ecoImpactSummary.map((impact, index) => (
          <EcoTag key={index} impact={impact} />
        ))}
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-1 text-sm text-white/70">
          <Leaf className="w-4 h-4" />
          <span>Sustainable Choice</span>
        </div>
        <a
          href={itemUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors text-sm font-medium"
        >
          <span>View Item</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default RecommendationCard;