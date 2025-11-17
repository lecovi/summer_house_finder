export interface Listing {
  id: string;
  name: string;
  price: number;
  description: string;
  location: string;
  contactLink?: string;
  imageUrls: string[];
  comfortFeatures: string[];
  proximityToCABA: number; // in minutes
  comments: {
    text: string;
    timestamp: string;
  }[];
  score: number;
  scores: {
    price: number;
    comfort: number;
    proximity: number;
  };
  isNew?: boolean;
  propertyType: string;
  capacity: number;
  sources: {
    site: string;
    url:string;
  }[];
  availability: string;
}

export interface Weights {
  price: number;
  comfort: number;
  proximity: number;
}

export interface Settings {
  weights: Weights;
  prompt: string;
  sites: string[];
  apiKey: string;
}

export interface ActivityLog {
  id: string;
  message: string;
  timestamp: string;
}

export type View = 'dashboard' | 'settings' | 'activity';