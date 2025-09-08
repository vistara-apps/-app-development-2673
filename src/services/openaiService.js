import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const generateRecommendations = async (userProfile) => {
  // Mock data for demo purposes since we don't have real API key
  const mockRecommendations = [
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

  // If we had a real API key, we would make this call:
  try {
    if (import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_OPENAI_API_KEY !== 'demo-key') {
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: `You are an expert sustainable fashion consultant. Generate 3 personalized eco-friendly clothing recommendations based on the user's style profile. Return a JSON array with each item containing: brandName, itemName, itemUrl, price, category, and ecoImpactSummary (array of objects with type and text).`
          },
          {
            role: "user",
            content: `User Profile:
            - Preferred Brands: ${userProfile.brands}
            - Style Aesthetic: ${userProfile.aesthetic}
            - Preferred Fits: ${userProfile.fits}
            - Color Palette: ${userProfile.colors}
            
            Please recommend 3 sustainable fashion items that match this profile.`
          }
        ],
        temperature: 0.7,
      });

      return JSON.parse(completion.choices[0].message.content);
    }
  } catch (error) {
    console.log('Using mock data for demo');
  }

  // Return mock data with some personalization based on user preferences
  return mockRecommendations.map(item => ({
    ...item,
    itemName: `${userProfile.aesthetic} ${item.itemName}`,
  }));
};