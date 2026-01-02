
import { WeddingData, GuestMessage, InvitationTemplate } from './types';

/**
 * GOOGLE APPS SCRIPT BACKEND TEMPLATE (Paste this in your Google Apps Script Editor)
 * -----------------------------------------------------------------------------
 * function doPost(e) {
 *   var data = JSON.parse(e.postData.contents);
 *   var ss = SpreadsheetApp.getActiveSpreadsheet();
 *   
 *   if (data.action === 'submit_message') {
 *     var sheet = ss.getSheetByName('guestbook') || ss.insertSheet('guestbook');
 *     // Append header if new sheet
 *     if (sheet.getLastRow() === 0) {
 *       sheet.appendRow(['ID', 'Nama', 'Kehadiran', 'Pesan', 'Timestamp']);
 *     }
 *     sheet.appendRow([data.id, data.name, data.attendance, data.message, data.timestamp]);
 *     return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
 *   }
 *   
 *   if (data.action === 'update_settings') {
 *     var sheet = ss.getSheetByName('settings') || ss.insertSheet('settings');
 *     sheet.clear();
 *     sheet.appendRow(['Data_JSON']);
 *     sheet.appendRow([JSON.stringify(data)]);
 *     return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
 *   }
 * }
 * 
 * function doGet(e) {
 *   var action = e.parameter.action;
 *   var ss = SpreadsheetApp.getActiveSpreadsheet();
 *   
 *   if (action === 'get_messages') {
 *     var sheet = ss.getSheetByName('guestbook');
 *     if (!sheet) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
 *     var rows = sheet.getDataRange().getValues();
 *     var headers = rows.shift();
 *     var messages = rows.map(function(row) {
 *       return { id: row[0], name: row[1], attendance: row[2], message: row[3], timestamp: row[4] };
 *     });
 *     return ContentService.createTextOutput(JSON.stringify(messages)).setMimeType(ContentService.MimeType.JSON);
 *   }
 *   
 *   // Default action: get settings
 *   var sheet = ss.getSheetByName('settings');
 *   if (!sheet) return ContentService.createTextOutput(JSON.stringify({})).setMimeType(ContentService.MimeType.JSON);
 *   var val = sheet.getRange(2, 1).getValue();
 *   return ContentService.createTextOutput(val).setMimeType(ContentService.MimeType.JSON);
 * }
 */

const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwEf3FEoLbhZKguvKmmQGamIxmr0fuw2g8zWd499QyOfLfW3VkP-OlM3yubXjCDP59j/exec";

const DEFAULT_MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.936553835694!2d112.0116847!3d-7.8176885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e785706598379c1%3A0xe5a3637e676100a7!2sMasjid%20Agung%20Kota%20Kediri!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid";

export const DEFAULT_WEDDING_DATA: WeddingData = {
  groomName: "Pupud Ardianto",
  brideName: "Hani Fatimatuzzahra",
  groomParents: "Bapak & Ibu Keluarga Pria",
  brideParents: "Bapak & Ibu Keluarga Wanita",
  groomInstagram: "https://instagram.com/",
  brideInstagram: "https://instagram.com/",
  coupleShortName: "Hani & Pupud",
  weddingDate: "2026-05-16T09:00:00",
  turutMengundang: [
    "Keluarga Besar Bpk. Ahmad",
    "Keluarga Besar Bpk. Yusuf",
    "Segenap Kerabat & Sahabat"
  ],
  assets: {
    floralCorner: "https://i.ibb.co/Lz0xYm8/floral-corner-refined.png",
    floralCornerMid: "https://i.ibb.co/Lz0xYm8/floral-corner-refined.png", 
    floralCornerBack: "https://i.ibb.co/Lz0xYm8/floral-corner-refined.png", 
    floralSide: "https://i.ibb.co/Lz0xYm8/floral-corner-refined.png", 
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1080",
    bridePhoto: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=500",
    groomPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500",
    splashBg: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1080",
    coupleBg: "",
    eventsBg: "",
    galleryBg: "",
    giftBg: "",
    guestbookBg: ""
  },
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600', alt: 'Gallery 1' },
    { id: '2', url: 'https://images.unsplash.com/photo-1519225495810-751783d9a7a9?auto=format&fit=crop&q=80&w=600', alt: 'Gallery 2' },
    { id: '3', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600', alt: 'Gallery 3' },
    { id: '4', url: 'https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&q=80&w=600', alt: 'Gallery 4' },
  ],
  events: [
    {
      title: 'Akad Nikah',
      date: '2026-05-16',
      time: '08.00 - 10.00 WIB',
      location: 'Masjid Raya',
      address: 'Jl. Utama No. 123, Kota Bahagia',
      mapsUrl: 'https://maps.app.goo.gl/sNJBfN491XT8BG2G6',
      mapsEmbedUrl: DEFAULT_MAPS_EMBED
    },
    {
      title: 'Resepsi Pernikahan',
      date: '2026-05-16',
      time: '11.00 - 14.00 WIB',
      location: 'Aula Serbaguna',
      address: 'Jl. Pemuda No. 45, Kota Bahagia',
      mapsUrl: 'https://maps.app.goo.gl/sNJBfN491XT8BG2G6',
      mapsEmbedUrl: DEFAULT_MAPS_EMBED
    }
  ],
  bankAccounts: [
    {
      bankName: "BCA",
      accountNumber: "1234567890",
      accountHolder: "Hani Fatimatuzzahra",
    }
  ],
  wishlist: [
    { name: "Coffee Maker", description: "Untuk menemani pagi kami" }
  ],
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
};

export const getDriveMediaUrl = (url: string, type: 'image' | 'audio' = 'image'): string => {
  if (!url || !url.includes('drive.google.com')) return url;
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    const fileId = fileIdMatch[1];
    if (type === 'image') return `https://lh3.googleusercontent.com/d/${fileId}`;
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
};

export const fetchTemplateCatalog = async (): Promise<InvitationTemplate[]> => {
  if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes("XXXXXXXX")) {
    const saved = localStorage.getItem('vell_invitation_templates');
    return saved ? JSON.parse(saved) : [];
  }

  try {
    const response = await fetch(`${GOOGLE_SHEET_API_URL}?action=get_catalog`);
    if (!response.ok) throw new Error('Failed to fetch catalog');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    const saved = localStorage.getItem('vell_invitation_templates');
    return saved ? JSON.parse(saved) : [];
  }
};

export const saveTemplateCatalogToCloud = async (templates: InvitationTemplate[]) => {
  localStorage.setItem('vell_invitation_templates', JSON.stringify(templates));
  if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes("XXXXXXXX")) return;

  try {
    await fetch(GOOGLE_SHEET_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_catalog', catalog: templates })
    });
  } catch (error) { console.error(error); }
};

export const fetchWeddingData = async (): Promise<WeddingData> => {
  if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes("XXXXXXXX")) {
    const saved = localStorage.getItem('wedding_invitation_data');
    return saved ? JSON.parse(saved) : DEFAULT_WEDDING_DATA;
  }

  try {
    const response = await fetch(GOOGLE_SHEET_API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return (data.groomName ? data : data.settings) || DEFAULT_WEDDING_DATA;
  } catch (error) {
    const saved = localStorage.getItem('wedding_invitation_data');
    return saved ? JSON.parse(saved) : DEFAULT_WEDDING_DATA;
  }
};

export const saveWeddingDataToCloud = async (data: WeddingData) => {
  localStorage.setItem('wedding_invitation_data', JSON.stringify(data));
  if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes("XXXXXXXX")) return;

  try {
    await fetch(GOOGLE_SHEET_API_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_settings', ...data })
    });
  } catch (error) { throw error; }
};

// GUESTBOOK SPECIFIC FUNCTIONS
export const fetchGuestMessages = async (): Promise<GuestMessage[]> => {
    if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes("XXXXXXXX")) return [];

    try {
        const response = await fetch(`${GOOGLE_SHEET_API_URL}?action=get_messages`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : (data.messages || []);
    } catch (error) { return []; }
};

export const sendGuestMessageToCloud = async (message: GuestMessage) => {
    if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes("XXXXXXXX")) return;

    try {
        // Mengirimkan payload dengan action submit_message 
        // Backend Apps Script akan menangkap ini dan menyimpannya di sheet 'guestbook'
        await fetch(GOOGLE_SHEET_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'submit_message',
                sheetName: 'guestbook', // Flag tambahan untuk identifikasi di backend
                ...message
            })
        });
    } catch (error) { throw error; }
};
