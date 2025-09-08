import React, { useState } from 'react';
import { User, Palette, Shirt, Heart } from 'lucide-react';

const ProfileForm = ({ onSubmit, editMode = true }) => {
  const [preferences, setPreferences] = useState({
    brands: '',
    fits: '',
    aesthetics: '',
    colors: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  const handleInputChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!editMode) {
    return (
      <div className="bg-surface rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Your Style Profile</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-text-secondary">Brands:</span>
            <span className="text-text-primary">{preferences.brands}</span>
          </div>
          <div className="flex items-center gap-3">
            <Shirt className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-text-secondary">Fits:</span>
            <span className="text-text-primary">{preferences.fits}</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-text-secondary">Aesthetics:</span>
            <span className="text-text-primary">{preferences.aesthetics}</span>
          </div>
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-text-secondary">Colors:</span>
            <span className="text-text-primary">{preferences.colors}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg p-6 shadow-md animate-fade-in">
      <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-3">
        <User className="w-6 h-6 text-primary" />
        Create Your Style Profile
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Favorite Brands
          </label>
          <input
            type="text"
            placeholder="e.g., Nike, Zara, Uniqlo"
            value={preferences.brands}
            onChange={(e) => handleInputChange('brands', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Preferred Fits
          </label>
          <input
            type="text"
            placeholder="e.g., oversized, slim, relaxed"
            value={preferences.fits}
            onChange={(e) => handleInputChange('fits', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Style Aesthetics
          </label>
          <input
            type="text"
            placeholder="e.g., minimalist, streetwear, bohemian"
            value={preferences.aesthetics}
            onChange={(e) => handleInputChange('aesthetics', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Color Palette
          </label>
          <input
            type="text"
            placeholder="e.g., earth tones, pastels, monochrome"
            value={preferences.colors}
            onChange={(e) => handleInputChange('colors', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-opacity-90 transition-all transform hover:scale-[1.02] shadow-md"
        >
          Save Profile & Get Recommendations
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;