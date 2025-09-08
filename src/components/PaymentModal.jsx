import React, { useState, useEffect } from 'react';
import { X, CreditCard, Loader2, Star, Gift } from 'lucide-react';
import { usePaymentService } from '../services/paymentService';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  onPayment, 
  loading = false, 
  userId,
  requestedCount = 1 
}) => {
  const [selectedOption, setSelectedOption] = useState('single');
  const [pricing, setPricing] = useState(null);
  const [credits, setCredits] = useState(null);
  const { calculatePricing, checkCredits, getPricingDisplay } = usePaymentService();

  useEffect(() => {
    if (isOpen && userId) {
      loadPricingData();
    }
  }, [isOpen, userId, requestedCount]);

  const loadPricingData = async () => {
    try {
      const [pricingData, creditsData] = await Promise.all([
        calculatePricing(userId, requestedCount),
        checkCredits(userId)
      ]);
      
      setPricing(pricingData);
      setCredits(creditsData);
      setSelectedOption(pricingData.recommendedOption);
    } catch (error) {
      console.error('Error loading pricing data:', error);
    }
  };

  if (!isOpen) return null;

  const handlePayment = () => {
    onPayment(selectedOption, selectedOption === 'bundle' ? 12 : requestedCount);
  };

  const displayPricing = pricing ? getPricingDisplay(pricing) : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg max-w-lg w-full p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-primary">Get More Recommendations</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Credits Display */}
        {credits?.hasCredits && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">
                You have {credits.remainingCredits} bundle credits remaining!
              </span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Use your existing credits or purchase more below.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Pricing Options */}
          {displayPricing && (
            <div className="space-y-3">
              {/* Single Purchase Option */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedOption === 'single' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOption('single')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedOption === 'single' 
                        ? 'border-primary bg-primary' 
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === 'single' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">
                        {displayPricing.single.description}
                      </h4>
                      <p className="text-sm text-text-secondary">
                        {displayPricing.single.perItem}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-text-primary">
                    {displayPricing.single.price}
                  </span>
                </div>
              </div>

              {/* Bundle Option */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all relative ${
                  selectedOption === 'bundle' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOption('bundle')}
              >
                {displayPricing.bundle.recommended && (
                  <div className="absolute -top-2 left-4 bg-accent text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Best Value</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedOption === 'bundle' 
                        ? 'border-primary bg-primary' 
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === 'bundle' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">
                        {displayPricing.bundle.description}
                      </h4>
                      <p className="text-sm text-text-secondary">
                        {displayPricing.bundle.perItem} • {displayPricing.bundle.savings}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-text-primary">
                    {displayPricing.bundle.price}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* What you'll get */}
          <div className="bg-primary/5 rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-2">What you'll get:</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Personalized eco-friendly fashion recommendations</li>
              <li>• Detailed environmental impact information</li>
              <li>• Direct links to purchase sustainable items</li>
              <li>• Style matching based on your preferences</li>
            </ul>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                {selectedOption === 'bundle' 
                  ? `Pay ${displayPricing?.bundle.price || '$5.00'} for Bundle`
                  : `Pay ${displayPricing?.single.price || '$0.50'}`
                }
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
