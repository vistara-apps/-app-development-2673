import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Leaf, Sparkles, Heart, Star, Award } from 'lucide-react';
import ProfileForm from './components/ProfileForm';
import RecommendationCard from './components/RecommendationCard';
import { usePaymentContext } from './hooks/usePaymentContext';
import { generateRecommendations } from './services/openaiService';

function App() {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { createSession } = usePaymentContext();

  const handleProfileSubmit = async (profileData) => {
    setUser(profileData);
    await getRecommendations(profileData, true);
  };

  const getRecommendations = async (profile, isFree = false) => {
    setLoading(true);
    try {
      const newRecommendations = await generateRecommendations(profile);
      setRecommendations(newRecommendations);
      setShowPaywall(false);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetMoreRecommendations = async () => {
    try {
      await createSession();
      await getRecommendations(user);
    } catch (error) {
      console.error('Payment failed:', error);
      setShowPaywall(true);
    }
  };

  return (
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
              {recommendations.length > 0 && (
                <button
                  onClick={handleGetMoreRecommendations}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors text-sm"
                >
                  Get More ($0.50)
                </button>
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

        {/* Paywall Modal */}
        {showPaywall && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Get More Recommendations</h3>
              <p className="text-gray-600 mb-6">
                Unlock personalized eco-friendly fashion recommendations for just $0.50.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowPaywall(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGetMoreRecommendations}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                >
                  Pay $0.50
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-white/60">
          <p>Sustainable fashion recommendations powered by AI</p>
        </footer>
      </div>
    </div>
  );
}

export default App;