/**
 * Test Utilities for EcoStyle Match
 * Provides mock data and helper functions for testing
 */

// Mock user profile data
export const mockUserProfile = {
  brands: "Patagonia, Everlane, Reformation",
  aesthetic: "Minimalist",
  fits: "Relaxed",
  colors: "Neutral tones"
};

// Mock recommendation data
export const mockRecommendations = [
  {
    brandName: "Patagonia",
    itemName: "Organic Cotton Long-Sleeve Shirt",
    itemUrl: "https://patagonia.com/product/organic-cotton-shirt",
    price: "$49",
    category: "Tops",
    ecoImpactSummary: [
      { type: "organic", text: "100% Organic Cotton" },
      { type: "water", text: "70% Less Water" },
      { type: "certified", text: "Fair Trade Certified" }
    ]
  },
  {
    brandName: "Everlane",
    itemName: "Recycled Wool Sweater",
    itemUrl: "https://everlane.com/products/recycled-wool-sweater",
    price: "$98",
    category: "Sweaters",
    ecoImpactSummary: [
      { type: "recycled", text: "80% Recycled Wool" },
      { type: "water", text: "50% Less Water" },
      { type: "certified", text: "GOTS Certified" }
    ]
  },
  {
    brandName: "Reformation",
    itemName: "Sustainable Linen Dress",
    itemUrl: "https://reformation.com/products/linen-dress",
    price: "$158",
    category: "Dresses",
    ecoImpactSummary: [
      { type: "organic", text: "Organic Linen" },
      { type: "water", text: "60% Water Savings" },
      { type: "recycled", text: "Eco-Friendly Dyes" }
    ]
  }
];

// Mock wallet address
export const mockWalletAddress = "0x1234567890123456789012345678901234567890";

// Mock pricing data
export const mockPricing = {
  requestedCount: 3,
  paidCount: 5,
  remainingInBundle: 7,
  canUseBundlePrice: true,
  singlePrice: 1.50,
  bundlePrice: 5.00,
  savings: 1.00,
  recommendedOption: 'bundle'
};

// Mock credits data
export const mockCredits = {
  bundlesPurchased: 1,
  creditsUsed: 5,
  remainingCredits: 7,
  hasCredits: true
};

// Test helper functions
export const createMockEvent = (overrides = {}) => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  target: { value: '' },
  ...overrides
});

export const createMockComponent = (props = {}) => ({
  props,
  children: [],
  type: 'div'
});

// Mock API responses
export const mockApiResponses = {
  openai: {
    success: mockRecommendations,
    error: new Error('OpenAI API Error')
  },
  supabase: {
    profile: {
      user_id: mockWalletAddress,
      style_preferences: mockUserProfile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    recommendations: {
      id: 'rec-123',
      user_id: mockWalletAddress,
      recommendations: mockRecommendations,
      is_paid: true,
      created_at: new Date().toISOString()
    }
  },
  payment: {
    success: {
      success: true,
      amount: 0.50,
      paymentType: 'single',
      count: 1,
      paymentResult: { transactionId: 'tx-123' }
    },
    error: {
      success: false,
      error: 'Payment failed'
    }
  }
};

// Mock localStorage
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Mock environment variables
export const mockEnvVars = {
  VITE_OPENAI_API_KEY: 'test-openai-key',
  VITE_SUPABASE_URL: 'https://test.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'test-supabase-key'
};

// Test data generators
export const generateMockUser = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  address: mockWalletAddress,
  profile: mockUserProfile,
  ...overrides
});

export const generateMockRecommendation = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  brandName: "Test Brand",
  itemName: "Test Item",
  itemUrl: "https://test.com/item",
  price: "$99",
  category: "Test Category",
  ecoImpactSummary: [
    { type: "organic", text: "Test Impact" }
  ],
  ...overrides
});

// Async test helpers
export const waitFor = (condition, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, 100);
      }
    };
    
    check();
  });
};

export const flushPromises = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

// Mock service implementations
export const mockServices = {
  openai: {
    generateRecommendations: jest.fn().mockResolvedValue(mockRecommendations)
  },
  supabase: {
    UserProfileService: {
      upsertProfile: jest.fn().mockResolvedValue(mockApiResponses.supabase.profile),
      getProfile: jest.fn().mockResolvedValue(mockApiResponses.supabase.profile)
    },
    RecommendationService: {
      saveRecommendations: jest.fn().mockResolvedValue(mockApiResponses.supabase.recommendations),
      getRecommendationHistory: jest.fn().mockResolvedValue([mockApiResponses.supabase.recommendations]),
      getPaidRecommendationCount: jest.fn().mockResolvedValue(5)
    },
    AnalyticsService: {
      trackAction: jest.fn().mockResolvedValue()
    }
  },
  payment: {
    PaymentService: {
      calculatePricing: jest.fn().mockResolvedValue(mockPricing),
      processPayment: jest.fn().mockResolvedValue(mockApiResponses.payment.success),
      checkBundleCredits: jest.fn().mockResolvedValue(mockCredits)
    }
  }
};

// Component test helpers
export const renderWithProviders = (component, options = {}) => {
  // This would be implemented with React Testing Library
  // and any necessary providers (React Query, etc.)
  return {
    ...component,
    rerender: jest.fn(),
    unmount: jest.fn()
  };
};

export const createMockRouter = (initialRoute = '/') => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  pathname: initialRoute,
  query: {},
  asPath: initialRoute
});

// Error simulation helpers
export const simulateNetworkError = () => {
  return Promise.reject(new Error('Network Error'));
};

export const simulateApiError = (status = 500, message = 'Internal Server Error') => {
  const error = new Error(message);
  error.status = status;
  return Promise.reject(error);
};

// Performance testing helpers
export const measurePerformance = async (fn, iterations = 100) => {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  return {
    average: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    times
  };
};

export default {
  mockUserProfile,
  mockRecommendations,
  mockWalletAddress,
  mockPricing,
  mockCredits,
  createMockEvent,
  createMockComponent,
  mockApiResponses,
  mockLocalStorage,
  mockEnvVars,
  generateMockUser,
  generateMockRecommendation,
  waitFor,
  flushPromises,
  mockServices,
  renderWithProviders,
  createMockRouter,
  simulateNetworkError,
  simulateApiError,
  measurePerformance
};
