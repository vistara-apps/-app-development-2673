import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Leaf, Sparkles, Heart, Star, Award } from 'lucide-react';
import ProfileForm from './components/ProfileForm';
import RecommendationCard from './components/RecommendationCard';
import PaymentModal from './components/PaymentModal';
import ErrorBoundary from './components/ErrorBoundary';
import { usePaymentContext } from './hooks/usePaymentContext';
import { generateRecommendations } from './services/openaiService';
import { UserProfileService, RecommendationService, AnalyticsService } from './services/supabaseService';
import { usePaymentService } from './services/paymentService';

function App() {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [credits, setCredits] = useState(null);
  const { address } = useAccount();
  const { createSession } = usePaymentContext();
  const { checkCredits } = usePaymentService();

  // Load user profile and credits on wallet connection
  useEffect(() => {
    if (address) {
      loadUserData();
    }
  }, [address]);

  const loadUserData = async () => {
    if (!address) return;
    
    try {
      // Load existing profile
      const profile = await UserProfileService.getProfile(address);
      if (profile) {
        setUser(profile.style_preferences);
      }

      // Load credits
      const creditsData = await checkCredits(address);
      setCredits(creditsData);

      // Track user session
      await AnalyticsService.trackAction(address, 'session_start');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleProfileSubmit = async (profileData) => {
    setUser(profileData);
    
    // Save profile to database
    if (address) {
      try {
        await UserProfileService.upsertProfile(address, profileData);
        await AnalyticsService.trackAction(address, 'profile_created', profileData);
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
    
    await getRecommendations(profileData, true);
  };

  const getRecommendations = async (profile, isFree = false) => {
    if (!address) return;
    
    setLoading(true);
    try {
      // Check if user has credits first
      if (!isFree && credits?.hasCredits) {
        // Use existing credits
        const newRecommendations = await generateRecommendations(profile);
        setRecommendations(newRecommendations);
        
        // Save recommendations
        await RecommendationService.saveRecommendations(address, newRecommendations, true);
        
        // Refresh credits
        const updatedCredits = await checkCredits(address);
        setCredits(updatedCredits);
        
        await AnalyticsService.trackAction(address, 'recommendations_generated', {
          count: newRecommendations.length,
          usedCredits: true
        });
      } else {
        // Generate recommendations
        const newRecommendations = await generateRecommendations(profile);
        setRecommendations(newRecommendations);
        
        // Save recommendations
        await RecommendationService.saveRecommendations(address, newRecommendations, !isFree);
        
        await AnalyticsService.trackAction(address, 'recommendations_generated', {
          count: newRecommendations.length,
          isFree
        });
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      await AnalyticsService.trackAction(address, 'error', {
        action: 'generate_recommendations',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetMoreRecommendations = () => {
    if (!address) return;
    setShowPaymentModal(true);
  };

  const handlePayment = async (paymentType, count) => {
    if (!address) return;
    
    try {
      setLoading(true);
      
      // Process payment
      await createSession();
      
      // Generate new recommendations
      await getRecommendations(user, false);
      
      // Close modal
      setShowPaymentModal(false);
      
      await AnalyticsService.trackAction(address, 'payment_completed', {
        paymentType,
        count,
        amount: paymentType === 'bundle' ? 5.00 : 0.50
      });
    } catch (error) {
      console.error('Payment failed:', error);
      await AnalyticsService.trackAction(address, 'payment_failed', {
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="gradient-bg min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Leaf className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">EcoStyle Match</h1>
          </div>
          <ConnectButton />
        </header>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover eco-friendly fashion that perfectly matches your style
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Get personalized recommendations for sustainable clothing that aligns with your unique style preferences.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Form Section */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-accent" />
              <h3 className="text-xl font-semibold text-white">Your Style Profile</h3>
            </div>
            
            {!user ? (
              <ProfileForm onSubmit={handleProfileSubmit} loading={loading} />
            ) : (
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Current Profile</h4>
                  <div className="text-sm text-white/80 space-y-1">
                    <p><strong>Brands:</strong> {user.brands}</p>
                    <p><strong>Style:</strong> {user.aesthetic}</p>
                    <p><strong>Fits:</strong> {user.fits}</p>
                    <p><strong>Colors:</strong> {user.colors}</p>
                  </div>
                </div>
                <button
                  onClick={() => setUser(null)}
                  className="w-full px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Recommendations Section */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-semibold text-white">Your Recommendations</h3>
              </div>
              {recommendations.length > 0 && address && (
                <div className="flex items-center space-x-2">
                  {credits?.hasCredits && (
                    <span className="text-xs text-white/70 bg-green-500/20 px-2 py-1 rounded">
                      {credits.remainingCredits} credits
                    </span>
                  )}
                  <button
                    onClick={handleGetMoreRecommendations}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors text-sm"
                  >
                    {credits?.hasCredits ? 'Use Credit' : 'Get More ($0.50)'}
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <RecommendationCard key={index} recommendation={rec} />
                ))}
              </div>
            ) : user ? (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-white/60 mx-auto mb-4" />
                <p className="text-white/80">Your recommendations will appear here</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="w-12 h-12 text-white/60 mx-auto mb-4" />
                <p className="text-white/80">Complete your style profile to get personalized recommendations</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPayment={handlePayment}
          loading={loading}
          userId={address}
          requestedCount={3}
        />

        {/* Footer */}
        <footer className="mt-16 text-center text-white/60">
          <p>Sustainable fashion recommendations powered by AI</p>
        </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
