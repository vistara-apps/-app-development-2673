import React from 'react';
import { Droplets, Recycle, Leaf, Award } from 'lucide-react';

const EcoTag = ({ impact }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'water': return <Droplets className="w-3 h-3" />;
      case 'recycled': return <Recycle className="w-3 h-3" />;
      case 'organic': return <Leaf className="w-3 h-3" />;
      case 'certified': return <Award className="w-3 h-3" />;
      default: return <Leaf className="w-3 h-3" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'water': return 'bg-blue-500/20 text-blue-300';
      case 'recycled': return 'bg-green-500/20 text-green-300';
      case 'organic': return 'bg-emerald-500/20 text-emerald-300';
      case 'certified': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-accent/20 text-accent';
    }
  };

  return (
    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getColor(impact.type)}`}>
      {getIcon(impact.type)}
      <span>{impact.text}</span>
    </div>
  );
};

export default EcoTag;