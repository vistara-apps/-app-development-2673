# EcoStyle Match 🌱👗

> Discover eco-friendly fashion that perfectly matches your style.

EcoStyle Match is a sustainable fashion recommendation platform that helps users find stylish, eco-friendly clothing by matching their personal style preferences with sustainable brands. Built as a Base Mini App with crypto wallet integration and AI-powered recommendations.

![EcoStyle Match Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=EcoStyle+Match+Preview)

## ✨ Features

### 🎯 Core Features
- **Style Profile Creation**: Input preferred brands, fits, aesthetics, and color palettes
- **AI-Powered Recommendations**: Personalized eco-friendly clothing suggestions using OpenAI
- **Eco-Impact Transparency**: Clear environmental impact information for each recommendation
- **Wallet Integration**: Seamless crypto payments with RainbowKit
- **Bundle Pricing**: $0.50 per recommendation or $5 for 12 recommendations

### 🔧 Technical Features
- **React + Vite**: Modern frontend development
- **Tailwind CSS**: Responsive design system
- **Supabase**: Database and real-time features
- **OpenAI Integration**: AI-powered fashion recommendations
- **Crypto Payments**: x402-axios for wallet-based payments
- **Error Boundaries**: Robust error handling
- **Analytics**: User interaction tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/-app-development-2673.git
   cd -app-development-2673
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   VITE_OPENAI_API_KEY=your-openai-api-key
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up Supabase database**
   
   Run these SQL commands in your Supabase SQL editor:
   ```sql
   -- User Profiles Table
   CREATE TABLE user_profiles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id TEXT UNIQUE NOT NULL,
     style_preferences JSONB NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Recommendations Table
   CREATE TABLE recommendations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id TEXT NOT NULL,
     recommendations JSONB NOT NULL,
     is_paid BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- User Analytics Table
   CREATE TABLE user_analytics (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id TEXT NOT NULL,
     action TEXT NOT NULL,
     metadata JSONB DEFAULT '{}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Indexes for better performance
   CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
   CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
   CREATE INDEX idx_recommendations_created_at ON recommendations(created_at);
   CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);
   CREATE INDEX idx_user_analytics_action ON user_analytics(action);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Architecture

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

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ErrorBoundary.jsx
│   ├── EcoTag.jsx
│   ├── PaymentModal.jsx
│   ├── ProfileForm.jsx
│   └── RecommendationCard.jsx
├── hooks/              # Custom React hooks
│   └── usePaymentContext.js
├── services/           # API and business logic
│   ├── openaiService.js
│   ├── paymentService.js
│   └── supabaseService.js
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles

docs/
└── API_DOCUMENTATION.md  # Comprehensive API docs
```

## 🎨 Design System

### Colors
- **Primary**: `hsl(130, 70%, 45%)` - Eco-friendly green
- **Accent**: `hsl(170, 80%, 50%)` - Vibrant teal
- **Background**: Gradient from `#667eea` to `#764ba2`
- **Surface**: Glass morphism with backdrop blur

### Components
- **Glass Cards**: Translucent containers with blur effects
- **Eco Tags**: Color-coded environmental impact indicators
- **Gradient Backgrounds**: Smooth color transitions
- **Responsive Grid**: Mobile-first design approach

## 💰 Business Model

### Pricing Structure
- **Single Recommendations**: $0.50 per recommendation
- **Bundle Pricing**: $5.00 for 12 recommendations (save $1.00)
- **Credit System**: Bundle purchases provide credits for future use

### Revenue Streams
1. **Micro-transactions**: Pay-per-recommendation model
2. **Bundle Sales**: Discounted bulk purchases
3. **Future**: Affiliate commissions from sustainable brands

## 🔌 API Integration

### OpenAI Service
```javascript
import { generateRecommendations } from './services/openaiService';

const recommendations = await generateRecommendations({
  brands: "Patagonia, Everlane",
  aesthetic: "Minimalist",
  fits: "Relaxed",
  colors: "Neutral tones"
});
```

### Supabase Service
```javascript
import { UserProfileService } from './services/supabaseService';

// Save user profile
await UserProfileService.upsertProfile(userId, profileData);

// Get user profile
const profile = await UserProfileService.getProfile(userId);
```

### Payment Service
```javascript
import { usePaymentService } from './services/paymentService';

const { calculatePricing, processPayment } = usePaymentService();

// Calculate pricing options
const pricing = await calculatePricing(userId, 3);

// Process payment
const result = await processPayment(userId, 3, 'bundle', paymentHandler);
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Individual component and service testing
- **Integration Tests**: API integration and data flow
- **E2E Tests**: Complete user journey testing

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
1. Configure production environment variables
2. Set up production Supabase instance
3. Configure OpenAI API access
4. Set up payment gateway
5. Deploy to hosting platform (Vercel, Netlify, etc.)

### Docker Support
```bash
# Build Docker image
docker build -t ecostyle-match .

# Run container
docker run -p 3000:3000 ecostyle-match
```

## 🔒 Security

### Data Protection
- API keys stored in environment variables
- User data encrypted at rest in Supabase
- Payments handled by secure gateway
- CORS configured for production domains

### Privacy
- User data anonymized in analytics
- GDPR compliant data handling
- User consent for data collection
- Right to data deletion

## 📊 Analytics

### Tracked Events
- User session starts
- Profile creation/updates
- Recommendation generations
- Payment completions
- Error occurrences

### Analytics Service
```javascript
import { AnalyticsService } from './services/supabaseService';

// Track user action
await AnalyticsService.trackAction(userId, 'recommendation_clicked', {
  brandName: 'Patagonia',
  category: 'Tops'
});
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Conventional commits for clear history

## 📚 Documentation

- **[API Documentation](docs/API_DOCUMENTATION.md)**: Comprehensive API reference
- **Inline Comments**: Detailed code documentation
- **Component Props**: TypeScript-style prop documentation

## 🐛 Troubleshooting

### Common Issues

**Wallet Connection Issues**
```bash
# Clear browser cache and cookies
# Ensure wallet extension is installed and unlocked
# Check network configuration
```

**API Rate Limits**
```bash
# OpenAI API has rate limits based on your plan
# Implement exponential backoff for retries
# Consider caching responses
```

**Database Connection**
```bash
# Verify Supabase URL and API key
# Check Row Level Security policies
# Ensure tables are created correctly
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI**: AI-powered recommendation engine
- **Supabase**: Database and real-time features
- **RainbowKit**: Wallet connection interface
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

## 📞 Support

- **Documentation**: This README and API docs
- **Issues**: [GitHub Issues](https://github.com/vistara-apps/-app-development-2673/issues)
- **Discussions**: [GitHub Discussions](https://github.com/vistara-apps/-app-development-2673/discussions)
- **Email**: support@ecostyle-match.com

---

**Made with 💚 for sustainable fashion**
