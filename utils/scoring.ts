
import type { Listing, Weights } from './types';

export const calculateScores = (listings: Listing[], weights: Weights): Listing[] => {
  if (listings.length === 0) return [];

  const maxPrice = Math.max(...listings.map(l => l.price), 1);
  const maxComfortFeatures = Math.max(...listings.map(l => l.comfortFeatures.length), 1);
  const maxProximity = Math.max(...listings.map(l => l.proximityToCABA), 1);

  return listings.map(listing => {
    const priceScore = (1 - listing.price / maxPrice) * 100;
    const comfortScore = (listing.comfortFeatures.length / maxComfortFeatures) * 100;
    const proximityScore = (1 - listing.proximityToCABA / maxProximity) * 100;

    const normalizedPrice = priceScore * (weights.price / 100);
    const normalizedComfort = comfortScore * (weights.comfort / 100);
    const normalizedProximity = proximityScore * (weights.proximity / 100);

    const totalScore = Math.round(normalizedPrice + normalizedComfort + normalizedProximity);

    return {
      ...listing,
      score: totalScore,
      scores: {
        price: Math.round(priceScore),
        comfort: Math.round(comfortScore),
        proximity: Math.round(proximityScore),
      }
    };
  });
};
