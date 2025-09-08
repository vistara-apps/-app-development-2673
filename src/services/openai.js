import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'sk-test-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateRecommendations(styleProfile) {
  try {
    const prompt = `Based on this style profile, recommend 3 eco-friendly fashion items:
    
    Style Preferences:
    - Brands: ${styleProfile.brands}
    - Fits: ${styleProfile.fits}
    - Aesthetics: ${styleProfile.aesthetics}
    - Colors: ${styleProfile.colors}
    
    For each recommendation, provide:
    1. Brand name (focus on sustainable/eco-friendly brands)
    2. Item name and description
    3. Brief eco-impact (water saved, recycled materials, etc.)
    4. Style match explanation
    
    Format as JSON array with fields: brandName, itemName, description, ecoImpact, styleMatch, estimatedPrice`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are an expert sustainable fashion curator. Provide recommendations in the exact JSON format requested.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    
    // Try to parse JSON from the response
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log('Failed to parse AI response as JSON, using fallback');
    }
    
    // Fallback recommendations if AI fails
    return getFallbackRecommendations(styleProfile);
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    return getFallbackRecommendations(styleProfile);
  }
}

function getFallbackRecommendations(styleProfile) {
  const fallbackItems = [
    {
      brandName: "Patagonia",
      itemName: "Organic Cotton T-Shirt",
      description: "Classic fit tee made from 100% organic cotton",
      ecoImpact: "Saves 2,500L water vs conventional cotton",
      styleMatch: `Matches your preference for ${styleProfile.aesthetics} style`,
      estimatedPrice: "$35"
    },
    {
      brandName: "Everlane",
      itemName: "ReNew Fleece Hoodie", 
      description: "Cozy hoodie made from recycled plastic bottles",
      ecoImpact: "Made from 25 recycled plastic bottles",
      styleMatch: `Perfect for your ${styleProfile.fits} fit preference`,
      estimatedPrice: "$68"
    },
    {
      brandName: "Reformation",
      itemName: "Sustainable Denim Jeans",
      description: "High-waisted jeans with eco-friendly wash",
      ecoImpact: "Uses 70% less water in production",
      styleMatch: `Complements your ${styleProfile.colors} color palette`,
      estimatedPrice: "$128"
    }
  ];
  
  return fallbackItems;
}