import React, { useState } from 'react';
import { User, Palette, Shirt, Heart } from 'lucide-react';

const ProfileForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    brands: '',
    aesthetic: '',
    fits: '',
    colors: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const presetOptions = {
    aesthetic: ['Minimalist', 'Bohemian', 'Classic', 'Streetwear', 'Vintage', 'Modern'],
    fits: ['Relaxed', 'Fitted', 'Oversized', 'Tailored', 'Loose', 'Slim'],
    colors: ['Neutral tones', 'Earth colors', 'Pastels', 'Bold colors', 'Monochrome', 'Jewel tones']
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Favorite Brands */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-white font-medium">
          <User className="w-4 h-4" />
          <span>Favorite Brands</span>
        </label>
        <input
          type="text"
          value={formData.brands}
          onChange={(e) => handleChange('brands', e.target.value)}
          placeholder="e.g., Patagonia, Everlane, Reformation"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
      </div>

      {/* Aesthetic Style */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-white font-medium">
          <Palette className="w-4 h-4" />
          <span>Style Aesthetic</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presetOptions.aesthetic.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleChange('aesthetic', option)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                formData.aesthetic === option
                  ? 'bg-accent text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={formData.aesthetic}
          onChange={(e) => handleChange('aesthetic', e.target.value)}
          placeholder="Or describe your style..."
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
        />
      </div>

      {/* Preferred Fits */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-white font-medium">
          <Shirt className="w-4 h-4" />
          <span>Preferred Fits</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presetOptions.fits.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleChange('fits', option)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                formData.fits === option
                  ? 'bg-accent text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Color Preferences */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-white font-medium">
          <Heart className="w-4 h-4" />
          <span>Color Palette</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presetOptions.colors.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleChange('colors', option)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                formData.colors === option
                  ? 'bg-accent text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.brands || !formData.aesthetic || !formData.fits || !formData.colors}
        className="w-full px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating Recommendations...' : 'Get My Eco-Style Matches'}
      </button>
    </form>
  );
};

export default ProfileForm;