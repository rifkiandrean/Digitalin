
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
    floralCorner: string; // Bunga Utama (Depan)
    floralCornerMid: string; // Bunga Tengah
    floralCornerBack: string; // Bunga Belakang
    floralSide: string; // Bunga Samping (Baru)
    heroImage: string;
    bridePhoto: string;
    groomPhoto: string;
    splashBg: string;
    coupleBg: string;
    eventsBg: string;
    galleryBg: string;
    giftBg: string;
  };
  gallery: GalleryItem[];
  events: EventDetail[];
  bankAccounts: BankInfo[];
  wishlist: WishlistItem[];
  audioUrl: string;
}
