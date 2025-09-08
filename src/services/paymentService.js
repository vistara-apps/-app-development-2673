import { RecommendationService } from './supabaseService';

/**
 * Payment Service
 * Handles payment logic, bundle pricing, and recommendation credits
 */
export class PaymentService {
  // Pricing constants
  static SINGLE_RECOMMENDATION_PRICE = 0.50;
  static BUNDLE_PRICE = 5.00;
  static BUNDLE_SIZE = 12;

  /**
   * Calculate pricing for recommendations
   * @param {string} userId - User identifier
   * @param {number} requestedCount - Number of recommendations requested
   * @returns {Promise<Object>} Pricing information
   */
  static async calculatePricing(userId, requestedCount = 1) {
    try {
      const paidCount = await RecommendationService.getPaidRecommendationCount(userId);
      
      // Check if user qualifies for bundle pricing
      const remainingInBundle = this.BUNDLE_SIZE - (paidCount % this.BUNDLE_SIZE);
      const canUseBundlePrice = remainingInBundle >= requestedCount;
      
      let pricing = {
        requestedCount,
        paidCount,
        remainingInBundle,
        canUseBundlePrice,
        singlePrice: this.SINGLE_RECOMMENDATION_PRICE * requestedCount,
        bundlePrice: this.BUNDLE_PRICE,
        savings: 0,
        recommendedOption: 'single'
      };

      // Calculate savings and recommend best option
      if (canUseBundlePrice && requestedCount >= 3) {
        pricing.savings = (this.SINGLE_RECOMMENDATION_PRICE * this.BUNDLE_SIZE) - this.BUNDLE_PRICE;
        pricing.recommendedOption = 'bundle';
      }

      return pricing;
    } catch (error) {
      console.error('Error calculating pricing:', error);
      // Return default pricing
      return {
        requestedCount,
        paidCount: 0,
        remainingInBundle: this.BUNDLE_SIZE,
        canUseBundlePrice: true,
        singlePrice: this.SINGLE_RECOMMENDATION_PRICE * requestedCount,
        bundlePrice: this.BUNDLE_PRICE,
        savings: 1.00,
        recommendedOption: requestedCount >= 3 ? 'bundle' : 'single'
      };
    }
  }

  /**
   * Process payment for recommendations
   * @param {string} userId - User identifier
   * @param {number} count - Number of recommendations
   * @param {string} paymentType - 'single' or 'bundle'
   * @param {Function} paymentHandler - Payment processing function
   * @returns {Promise<Object>} Payment result
   */
  static async processPayment(userId, count, paymentType, paymentHandler) {
    try {
      const pricing = await this.calculatePricing(userId, count);
      const amount = paymentType === 'bundle' ? pricing.bundlePrice : pricing.singlePrice;
      
      // Process payment
      const paymentResult = await paymentHandler(amount);
      
      // Track payment success
      return {
        success: true,
        amount,
        paymentType,
        count: paymentType === 'bundle' ? this.BUNDLE_SIZE : count,
        paymentResult
      };
    } catch (error) {
      console.error('Payment processing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if user has remaining bundle credits
   * @param {string} userId - User identifier
   * @returns {Promise<Object>} Credit information
   */
  static async checkBundleCredits(userId) {
    try {
      const paidCount = await RecommendationService.getPaidRecommendationCount(userId);
      const bundlesPurchased = Math.floor(paidCount / this.BUNDLE_SIZE);
      const creditsUsed = paidCount % this.BUNDLE_SIZE;
      const remainingCredits = bundlesPurchased > 0 ? this.BUNDLE_SIZE - creditsUsed : 0;
      
      return {
        bundlesPurchased,
        creditsUsed,
        remainingCredits,
        hasCredits: remainingCredits > 0
      };
    } catch (error) {
      console.error('Error checking bundle credits:', error);
      return {
        bundlesPurchased: 0,
        creditsUsed: 0,
        remainingCredits: 0,
        hasCredits: false
      };
    }
  }

  /**
   * Get pricing display information
   * @param {Object} pricing - Pricing object from calculatePricing
   * @returns {Object} Display-friendly pricing info
   */
  static getPricingDisplay(pricing) {
    return {
      single: {
        price: `$${pricing.singlePrice.toFixed(2)}`,
        description: `${pricing.requestedCount} recommendation${pricing.requestedCount > 1 ? 's' : ''}`,
        perItem: `$${this.SINGLE_RECOMMENDATION_PRICE.toFixed(2)} each`
      },
      bundle: {
        price: `$${pricing.bundlePrice.toFixed(2)}`,
        description: `${this.BUNDLE_SIZE} recommendations`,
        perItem: `$${(this.BUNDLE_PRICE / this.BUNDLE_SIZE).toFixed(2)} each`,
        savings: `Save $${pricing.savings.toFixed(2)}!`,
        recommended: pricing.recommendedOption === 'bundle'
      }
    };
  }
}

/**
 * Payment Hook for React Components
 * Provides payment functionality with bundle pricing logic
 */
export const usePaymentService = () => {
  const calculatePricing = async (userId, count = 1) => {
    return await PaymentService.calculatePricing(userId, count);
  };

  const processPayment = async (userId, count, paymentType, paymentHandler) => {
    return await PaymentService.processPayment(userId, count, paymentType, paymentHandler);
  };

  const checkCredits = async (userId) => {
    return await PaymentService.checkBundleCredits(userId);
  };

  const getPricingDisplay = (pricing) => {
    return PaymentService.getPricingDisplay(pricing);
  };

  return {
    calculatePricing,
    processPayment,
    checkCredits,
    getPricingDisplay,
    SINGLE_PRICE: PaymentService.SINGLE_RECOMMENDATION_PRICE,
    BUNDLE_PRICE: PaymentService.BUNDLE_PRICE,
    BUNDLE_SIZE: PaymentService.BUNDLE_SIZE
  };
};
