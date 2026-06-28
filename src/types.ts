export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface OfficeInfo {
  name: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  services: string[];
}

export interface JobAd {
  id: string;
  type: 'employer' | 'seeker' | 'external';
  name: string;
  phone: string;
  specialty: string;
  country: string;
  details: string;
  salary?: string;
  experience?: string;
  timestamp: string;
  image?: string;
  title?: string;
  url?: string;
}

export interface MarketAd {
  id: string;
  type: 'sell' | 'buy';
  category: string;
  title: string;
  details: string;
  price: string;
  location: string;
  name: string;
  phone: string;
  timestamp: string;
  image?: string;
}
