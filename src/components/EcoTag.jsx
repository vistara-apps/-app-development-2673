import React from 'react';
import { Leaf, Award } from 'lucide-react';

const EcoTag = ({ variant = 'positive', children, icon }) => {
  const variants = {
    positive: 'bg-primary/10 text-primary border-primary/20',
    neutral: 'bg-accent/10 text-accent border-accent/20'
  };

  const IconComponent = icon || (variant === 'positive' ? Leaf : Award);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${variants[variant]}`}>
      <IconComponent className="w-3 h-3" />
      {children}
    </div>
  );
};

export default EcoTag;