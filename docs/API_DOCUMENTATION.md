# EcoStyle Match API Documentation

## Overview

EcoStyle Match is a sustainable fashion recommendation platform that helps users discover eco-friendly clothing that matches their personal style preferences. This document outlines the complete API structure, services, and integration points.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Services      │    │   External APIs │
│   (React)       │◄──►│   Layer         │◄──►│                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                      │                      │
├─ Components          ├─ OpenAI Service     ├─ OpenAI API
├─ Hooks               ├─ Supabase Service   ├─ Supabase
├─ Context             ├─ Payment Service    ├─ Farcaster/Neynar
└─ Utils               └─ Analytics Service  └─ Payment Gateway
```

## Core Services

### 1. OpenAI Service (`src/services/openaiService.js`)

Handles AI-powered fashion recommendations using OpenAI's API.

#### `generateRecommendations(userProfile)`

**Purpose**: Generate personalized eco-friendly fashion recommendations

**Parameters**:
- `userProfile` (Object): User's style preferences
  - `brands` (string): Preferred fashion brands
  - `aesthetic` (string): Style aesthetic preference
  - `fits` (string): Preferred clothing fits
  - `colors` (string): Color palette preferences

**Returns**: `Promise<Array<RecommendationObject>>`

**RecommendationObject Structure**:
```javascript
{
  brandName: string,
  itemName: string,
  itemUrl: string,
  price: string,
  category: string,
  ecoImpactSummary: Array<{
    type: 'water' | 'recycled' | 'organic' | 'certified',
    text: string
  }>
}
```

**Example Usage**:
```javascript
import { generateRecommendations } from './services/openaiService';

const userProfile = {
  brands: "Patagonia, Everlane",
  aesthetic: "Minimalist",
  fits: "Relaxed",
  colors: "Neutral tones"
};

const recommendations = await generateRecommendations(userProfile);
```

### 2. Supabase Service (`src/services/supabaseService.js`)

Manages data persistence and user management.

#### UserProfileService

##### `upsertProfile(userId, profileData)`

**Purpose**: Create or update user style profile

**Parameters**:
- `userId` (string): Unique user identifier (Farcaster ID or wallet address)
- `profileData` (Object): User's style preferences

**Returns**: `Promise<ProfileObject>`

##### `getProfile(userId)`

**Purpose**: Retrieve user's style profile

**Parameters**:
- `userId` (string): User identifier

**Returns**: `Promise<ProfileObject | null>`

#### RecommendationService

##### `saveRecommendations(userId, recommendations, isPaid)`

**Purpose**: Save recommendation batch to database

**Parameters**:
- `userId` (string): User identifier
- `recommendations` (Array): Array of recommendation objects
- `isPaid` (boolean): Whether this was a paid request

**Returns**: `Promise<RecommendationBatchObject>`

##### `getRecommendationHistory(userId, limit)`

**Purpose**: Get user's recommendation history

**Parameters**:
- `userId` (string): User identifier
- `limit` (number): Number of records to fetch (default: 10)

**Returns**: `Promise<Array<RecommendationBatchObject>>`

##### `getPaidRecommendationCount(userId)`

**Purpose**: Get total count of paid recommendations for bundle pricing

**Parameters**:
- `userId` (string): User identifier

**Returns**: `Promise<number>`

#### AnalyticsService

##### `trackAction(userId, action, metadata)`

**Purpose**: Track user interactions for analytics

**Parameters**:
- `userId` (string): User identifier
- `action` (string): Action name
- `metadata` (Object): Additional action data

**Returns**: `Promise<void>`

### 3. Payment Service (`src/services/paymentService.js`)

Handles payment logic, bundle pricing, and recommendation credits.

#### PaymentService

##### `calculatePricing(userId, requestedCount)`

**Purpose**: Calculate pricing options for recommendations

**Parameters**:
- `userId` (string): User identifier
- `requestedCount` (number): Number of recommendations requested

**Returns**: `Promise<PricingObject>`

**PricingObject Structure**:
```javascript
{
  requestedCount: number,
  paidCount: number,
  remainingInBundle: number,
  canUseBundlePrice: boolean,
  singlePrice: number,
  bundlePrice: number,
  savings: number,
  recommendedOption: 'single' | 'bundle'
}
```

##### `processPayment(userId, count, paymentType, paymentHandler)`

**Purpose**: Process payment for recommendations

**Parameters**:
- `userId` (string): User identifier
- `count` (number): Number of recommendations
- `paymentType` (string): 'single' or 'bundle'
- `paymentHandler` (Function): Payment processing function

**Returns**: `Promise<PaymentResultObject>`

##### `checkBundleCredits(userId)`

**Purpose**: Check remaining bundle credits

**Parameters**:
- `userId` (string): User identifier

**Returns**: `Promise<CreditsObject>`

**CreditsObject Structure**:
```javascript
{
  bundlesPurchased: number,
  creditsUsed: number,
  remainingCredits: number,
  hasCredits: boolean
}
```

## Database Schema

### Tables

#### user_profiles
```sql
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  style_preferences JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### recommendations
```sql
CREATE TABLE recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  recommendations JSONB NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### user_analytics
```sql
CREATE TABLE user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## React Hooks

### usePaymentContext (`src/hooks/usePaymentContext.js`)

**Purpose**: Handle wallet-based payments using x402-axios

**Returns**:
- `createSession()`: Function to create payment session

**Example Usage**:
```javascript
import { usePaymentContext } from './hooks/usePaymentContext';

const { createSession } = usePaymentContext();

const handlePayment = async () => {
  try {
    const result = await createSession();
    console.log('Payment successful:', result);
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

### usePaymentService (`src/services/paymentService.js`)

**Purpose**: Provide payment functionality with bundle pricing logic

**Returns**:
- `calculatePricing(userId, count)`: Calculate pricing options
- `processPayment(userId, count, paymentType, paymentHandler)`: Process payment
- `checkCredits(userId)`: Check bundle credits
- `getPricingDisplay(pricing)`: Get display-friendly pricing info
- `SINGLE_PRICE`: Single recommendation price constant
- `BUNDLE_PRICE`: Bundle price constant
- `BUNDLE_SIZE`: Bundle size constant

## Components

### Core Components

#### ProfileForm
**Props**:
- `onSubmit` (Function): Callback when form is submitted
- `loading` (boolean): Loading state

**Variants**:
- `editMode`: Editable form state
- `viewMode`: Read-only display state

#### RecommendationCard
**Props**:
- `recommendation` (Object): Recommendation data

**Variants**:
- `withImage`: Display with product image
- `compact`: Condensed display format

#### EcoTag
**Props**:
- `impact` (Object): Environmental impact data

**Variants**:
- `positive`: Positive environmental impact
- `neutral`: Neutral impact display

#### PaymentModal
**Props**:
- `isOpen` (boolean): Modal visibility
- `onClose` (Function): Close callback
- `onPayment` (Function): Payment callback
- `loading` (boolean): Payment processing state
- `userId` (string): User identifier
- `requestedCount` (number): Number of recommendations requested

#### ErrorBoundary
**Props**:
- `children` (ReactNode): Child components to wrap

**Features**:
- Catches JavaScript errors in component tree
- Displays fallback UI with retry options
- Logs errors for debugging
- Tracks errors in analytics

## External API Integrations

### OpenAI API
- **Endpoint**: `/v1/chat/completions`
- **Purpose**: Generate AI-powered fashion recommendations
- **Authentication**: API Key via headers
- **Rate Limits**: Varies by plan

### Supabase
- **Endpoints**: 
  - `/rest/v1/user_profiles`
  - `/rest/v1/recommendations`
  - `/rest/v1/user_analytics`
- **Purpose**: Data persistence and real-time features
- **Authentication**: API Key + Row Level Security

### Farcaster (Neynar API)
- **Endpoints**: 
  - `/users/{userId}`
  - `/casts`
- **Purpose**: User authentication and social features
- **Authentication**: API Key

### Payment Gateway (x402-axios)
- **Base URL**: `https://payments.vistara.dev`
- **Endpoint**: `/api/payment`
- **Purpose**: Crypto wallet payments
- **Authentication**: Wallet signatures

## Environment Variables

```bash
# OpenAI Configuration
VITE_OPENAI_API_KEY=your-openai-api-key

# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Farcaster Configuration (optional)
VITE_NEYNAR_API_KEY=your-neynar-api-key

# Analytics (optional)
VITE_GA_TRACKING_ID=your-google-analytics-id
```

## Error Handling

### Error Types

1. **Network Errors**: API connectivity issues
2. **Authentication Errors**: Invalid API keys or wallet connection
3. **Validation Errors**: Invalid user input
4. **Payment Errors**: Payment processing failures
5. **Rate Limit Errors**: API quota exceeded

### Error Handling Strategy

```javascript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  // Log error
  console.error('API Error:', error);
  
  // Track in analytics
  AnalyticsService.trackAction(userId, 'error', {
    error: error.message,
    stack: error.stack
  });
  
  // Return fallback or throw user-friendly error
  throw new Error('Something went wrong. Please try again.');
}
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Components loaded on demand
2. **Memoization**: React.memo for expensive components
3. **Debouncing**: User input debounced for API calls
4. **Caching**: API responses cached with React Query
5. **Bundle Splitting**: Code split by routes

### Monitoring

- Error tracking with ErrorBoundary
- Performance metrics with Web Vitals
- User analytics with custom events
- API response times monitoring

## Security

### Data Protection

1. **API Keys**: Stored in environment variables
2. **User Data**: Encrypted at rest in Supabase
3. **Payments**: Handled by secure payment gateway
4. **CORS**: Configured for production domains only

### Privacy

- User data anonymized in analytics
- GDPR compliant data handling
- User consent for data collection
- Right to data deletion

## Deployment

### Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build
npm run preview
```

### Environment Setup

1. Configure environment variables
2. Set up Supabase database
3. Configure OpenAI API access
4. Set up payment gateway
5. Deploy to hosting platform

## Testing

### Test Coverage

- Unit tests for services
- Integration tests for API calls
- Component tests with React Testing Library
- E2E tests with Playwright

### Test Commands

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## Support

For technical support or questions about the API:

- **Documentation**: This file and inline code comments
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Email**: support@ecostyle-match.com
