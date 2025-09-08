import React, { useState } from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onPayment, loading = false }) => {
  const [paymentMethod, setPaymentMethod] = useState('wallet');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-primary">Get More Recommendations</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-primary/5 rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-2">What you'll get:</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• 3 new personalized eco-fashion recommendations</li>
              <li>• Detailed environmental impact information</li>
              <li>• Direct links to purchase sustainable items</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-text-primary">Total</span>
              <span className="text-xl font-bold text-primary">$0.50</span>
            </div>
            <p className="text-xs text-text-secondary">
              Pay with your connected wallet for instant access
            </p>
          </div>
          
          <button
            onClick={onPayment}
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
                Pay $0.50 with Wallet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;