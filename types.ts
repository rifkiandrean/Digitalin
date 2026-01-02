
export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
}

export interface EventDetail {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  mapsUrl: string;
  mapsEmbedUrl?: string;
}

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface WishlistItem {
  name: string;
  description: string;
}

export interface GuestMessage {
  id: string;
  name: string;
  attendance: 'hadir' | 'tidak' | 'ragu';
  message: string;
  timestamp: string;
}

export interface GuestQueueItem {
  id: string;
  name: string;
  phone: string;
  status: 'queued' | 'sent';
  timestamp: string;
}

export interface WeddingData {
  groomName: string;
  brideName: string;
  groomParents: string;
  brideParents: string;
  groomInstagram?: string;
  brideInstagram?: string;
  coupleShortName: string;
  weddingDate: string;
  turutMengundang: string[];
  assets: {
    floralCorner: string; 
    floralCornerMid: string; 
    floralCornerBack: string; 
    floralSide: string; 
    heroImage: string;
    bridePhoto: string;
    groomPhoto: string;
    splashBg: string;
    coupleBg: string;
    eventsBg: string;
    galleryBg: string;
    giftBg: string;
    guestbookBg: string;
  };
  gallery: GalleryItem[];
  events: EventDetail[];
  bankAccounts: BankInfo[];
  wishlist: WishlistItem[];
  audioUrl: string;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  price: number;
  previewImageUrl: string;
  category: 'Modern' | 'Floral' | 'Minimalist' | 'Elegant';
  isPopular?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Website' | 'Undangan' | 'Sistem';
  client: string;
  description: string;
  imageUrl: string;
  tags: string[];
}
