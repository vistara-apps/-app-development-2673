import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * User Profile Service
 * Manages user style preferences and profile data
 */
export class UserProfileService {
  /**
   * Create or update user profile
   * @param {string} userId - Farcaster ID or wallet address
   * @param {Object} profileData - User style preferences
   * @returns {Promise<Object>} Created/updated profile
   */
  static async upsertProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          style_preferences: profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error upserting profile:', error);
      // Return mock data for demo
      return {
        user_id: userId,
        style_preferences: profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  /**
   * Get user profile by ID
   * @param {string} userId - User identifier
   * @returns {Promise<Object|null>} User profile or null
   */
  static async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }
}

/**
 * Recommendation Service
 * Manages recommendation history and analytics
 */
export class RecommendationService {
  /**
   * Save recommendation batch
   * @param {string} userId - User identifier
   * @param {Array} recommendations - Array of recommendation objects
   * @param {boolean} isPaid - Whether this was a paid request
   * @returns {Promise<Object>} Saved recommendation batch
   */
  static async saveRecommendations(userId, recommendations, isPaid = false) {
    try {
      const { data, error } = await supabase
        .from('recommendations')
        .insert({
          user_id: userId,
          recommendations: recommendations,
          is_paid: isPaid,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving recommendations:', error);
      // Return mock data for demo
      return {
        id: Date.now(),
        user_id: userId,
        recommendations: recommendations,
        is_paid: isPaid,
        created_at: new Date().toISOString()
      };
    }
  }

  /**
   * Get user's recommendation history
   * @param {string} userId - User identifier
   * @param {number} limit - Number of records to fetch
   * @returns {Promise<Array>} Array of recommendation batches
   */
  static async getRecommendationHistory(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recommendation history:', error);
      return [];
    }
  }

  /**
   * Get user's recommendation count for bundle pricing
   * @param {string} userId - User identifier
   * @returns {Promise<number>} Total paid recommendations count
   */
  static async getPaidRecommendationCount(userId) {
    try {
      const { count, error } = await supabase
        .from('recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_paid', true);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching recommendation count:', error);
      return 0;
    }
  }
}

/**
 * Analytics Service
 * Tracks user interactions and app usage
 */
export class AnalyticsService {
  /**
   * Track user action
   * @param {string} userId - User identifier
   * @param {string} action - Action name
   * @param {Object} metadata - Additional action data
   */
  static async trackAction(userId, action, metadata = {}) {
    try {
      await supabase
        .from('user_analytics')
        .insert({
          user_id: userId,
          action: action,
          metadata: metadata,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking action:', error);
      // Fail silently for analytics
    }
  }
}

/**
 * Database Schema Creation (for reference)
 * Run these SQL commands in your Supabase SQL editor:
 * 
 * -- User Profiles Table
 * CREATE TABLE user_profiles (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id TEXT UNIQUE NOT NULL,
 *   style_preferences JSONB NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Recommendations Table
 * CREATE TABLE recommendations (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id TEXT NOT NULL,
 *   recommendations JSONB NOT NULL,
 *   is_paid BOOLEAN DEFAULT FALSE,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- User Analytics Table
 * CREATE TABLE user_analytics (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id TEXT NOT NULL,
 *   action TEXT NOT NULL,
 *   metadata JSONB DEFAULT '{}',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Indexes for better performance
 * CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
 * CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
 * CREATE INDEX idx_recommendations_created_at ON recommendations(created_at);
 * CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);
 * CREATE INDEX idx_user_analytics_action ON user_analytics(action);
 */
