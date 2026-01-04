
import React, { useState } from 'react';
import { Save, RefreshCw, User, Calendar, Image as ImageIcon, Gift, Music, ArrowLeft, Loader2, Plus, Trash2, Link as LinkIcon, Copy, Check, Camera, Settings } from 'lucide-react';
import { WeddingData, BankInfo, GalleryItem } from '../types';
import { saveWeddingDataToCloud, DEFAULT_WEDDING_DATA, getDriveMediaUrl } from '../constants';

interface DashboardProps {
  data: WeddingData;
  onUpdate: (newData: WeddingData) => void;
  onClose: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onUpdate, onClose }) => {
  const [formData, setFormData] = useState<WeddingData>(data);
  const [activeTab, setActiveTab] = useState<'mempelai' | 'acara' | 'setingan' | 'hadiah' | 'tamu'>('mempelai');
  const [isSaving, setIsSaving] = useState(false);
  
  const [guestNameInput, setGuestNameInput] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveWeddingDataToCloud(formData);
      onUpdate(formData);
      alert('Data berhasil disinkronkan ke Spreadsheet!');
    } catch (error) {
      console.error("Failed to save:", error);
      alert('Terjadi kesalahan saat menyimpan ke cloud. Pastikan koneksi internet stabil.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (path: string, value: any) => {
    const newData = { ...formData };
    const keys = path.split('.');
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const addBankAccount = () => {
    const newAccount: BankInfo = {
      bankName: "",
      accountNumber: "",
      accountHolder: ""
    };
    updateField('bankAccounts', [...formData.bankAccounts, newAccount]);
  };

  const removeBankAccount = (index: number) => {
    if (formData.bankAccounts.length <= 1) {
      alert("Minimal harus ada satu rekening.");
      return;
    }
    const newBanks = formData.bankAccounts.filter((_, i) => i !== index);
    updateField('bankAccounts', newBanks);
  };

  const addGalleryImage = () => {
    const newImage: GalleryItem = {
      id: Date.now().toString(),
      url: "",
      alt: `Gallery Photo ${formData.gallery.length + 1}`
    };
    updateField('gallery', [...formData.gallery, newImage]);
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    updateField('gallery', newGallery);
  };

  const updateGalleryUrl = (index: number, url: string) => {
    const newGallery = [...formData.gallery];
    newGallery[index].url = url;
    updateField('gallery', newGallery);
  };

  const addTurutMengundang = () => {
    updateField('turutMengundang', [...(formData.turutMengundang || []), ""]);
  };

  const removeTurutMengundang = (index: number) => {
    const newList = formData.turutMengundang.filter((_, i) => i !== index);
    updateField('turutMengundang', newList);
  };

  const updateTurutMengundang = (index: number, value: string) => {
    const newList = [...formData.turutMengundang];
    newList[index] = value;
    updateField('turutMengundang', newList);
  };

  const generateLink = () => {
    if (!guestNameInput.trim()) return;
    const baseUrl = window.location.href.split('?')[0];
    const link = `${baseUrl}?to=${encodeURIComponent(guestNameInput.trim())}`;
    setGeneratedLink(link);
    setIsCopied(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all flex-shrink-0 ${
        activeTab === id ? 'border-blue-900 text-blue-900 bg-blue-50' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon size={16} />
      <span className="font-medium text-xs">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-end sm:items-center pointer-events-none">
      <div className="w-full max-w-[480px] h-full bg-slate-50 flex flex-col font-sans overflow-hidden pointer-events-auto shadow-2xl relative">
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Dashboard Spreadsheet</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={isSaving}
              onClick={() => { if(confirm('Reset ke data awal? Ini akan menghapus data di cloud.')) { setFormData(DEFAULT_WEDDING_DATA); } }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
              title="Reset Data"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-lg text-xs font-semibold disabled:bg-slate-400 disabled:shadow-none`}
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </header>

        <nav className="bg-white border-b flex px-4 overflow-x-auto scrollbar-hide">
          <TabButton id="mempelai" label="Mempelai" icon={User} />
          <TabButton id="acara" label="Acara" icon={Calendar} />
          <TabButton id="setingan" label="Setingan" icon={Settings} />
          <TabButton id="hadiah" label="Hadiah" icon={Gift} />
          <TabButton id="tamu" label="Tamu" icon={LinkIcon} />
        </nav>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100">
          <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border">
            
            {activeTab === 'mempelai' && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">Informasi Mempelai</h2>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Nama Lengkap Pria</label>
                    <input value={formData.groomName} onChange={e => updateField('groomName', e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Nama Orang Tua Pria</label>
                    <input placeholder="Contoh: Bapak Ahmad & Ibu Siti" value={formData.groomParents} onChange={e => updateField('groomParents', e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Instagram Pria (Link)</label>
                    <input placeholder="https://instagram.com/username" value={formData.groomInstagram || ''} onChange={e => updateField('groomInstagram', e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <hr className="my-2" />
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Nama Lengkap Wanita</label>
                    <input value={formData.brideName} onChange={e => updateField('brideName', e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Nama Orang Tua Wanita</label>
                    <input placeholder="Contoh: Bapak Yusuf & Ibu Aminah" value={formData.brideParents} onChange={e => updateField('brideParents', e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Instagram Wanita (Link)</label>
                    <input placeholder="https://instagram.com/username" value={formData.brideInstagram || ''} onChange={e => updateField('brideInstagram', e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <hr className="my-2" />
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Nama Panggilan Gabungan</label>
                    <input value={formData.coupleShortName} onChange={e => updateField('coupleShortName', e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Tanggal Utama Countdown (Kalender)</label>
                    <input type="datetime-local" value={formData.weddingDate.substring(0, 16)} onChange={e => updateField('weddingDate', e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>

                  <div className="space-y-4 pt-4 border-t mt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase text-slate-500">Turut Mengundang</label>
                      <button 
                        onClick={addTurutMengundang}
                        className="p-1 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {formData.turutMengundang?.map((name, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          value={name} 
                          onChange={e => updateTurutMengundang(idx, e.target.value)} 
                          placeholder="Contoh: Keluarga Bpk. Ahmad" 
                          className="flex-1 p-2 border rounded-lg text-sm" 
                        />
                        <button onClick={() => removeTurutMengundang(idx)} className="p-2 text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'acara' && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">Rincian Acara</h2>
                {formData.events.map((event, idx) => (
                  <div key={idx} className="space-y-4 p-4 bg-slate-50 rounded-2xl border">
                    <h3 className="font-bold text-blue-900 uppercase text-[10px] tracking-widest">{event.title}</h3>
                    <div className="grid gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Judul Acara</label>
                        <input placeholder="Judul Acara" value={event.title} onChange={e => {
                          const newEvents = [...formData.events];
                          newEvents[idx].title = e.target.value;
                          updateField('events', newEvents);
                        }} className="w-full p-3 border rounded-lg bg-white text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Acara (Pilih Tanggal)</label>
                        <input 
                          type="date" 
                          value={event.date.includes('-') ? event.date : ""} 
                          onChange={e => {
                            const newEvents = [...formData.events];
                            newEvents[idx].date = e.target.value;
                            updateField('events', newEvents);
                          }} 
                          className="w-full p-3 border rounded-lg bg-white text-sm" 
                        />
                        {!event.date.includes('-') && (
                           <input 
                            placeholder="Atau ketik manual..." 
                            value={event.date} 
                            onChange={e => {
                              const newEvents = [...formData.events];
                              newEvents[idx].date = e.target.value;
                              updateField('events', newEvents);
                            }} 
                            className="w-full p-3 border rounded-lg bg-white text-xs mt-1" 
                           />
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Waktu/Jam</label>
                        <input placeholder="Waktu" value={event.time} onChange={e => {
                          const newEvents = [...formData.events];
                          newEvents[idx].time = e.target.value;
                          updateField('events', newEvents);
                        }} className="w-full p-3 border rounded-lg bg-white text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lokasi</label>
                        <input placeholder="Lokasi" value={event.location} onChange={e => {
                          const newEvents = [...formData.events];
                          newEvents[idx].location = e.target.value;
                          updateField('events', newEvents);
                        }} className="w-full p-3 border rounded-lg bg-white text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Lengkap</label>
                        <input placeholder="Alamat Lengkap" value={event.address} onChange={e => {
                          const newEvents = [...formData.events];
                          newEvents[idx].address = e.target.value;
                          updateField('events', newEvents);
                        }} className="w-full p-3 border rounded-lg bg-white text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Link Navigasi Peta (Google Maps)</label>
                        <input placeholder="https://maps.app.goo.gl/..." value={event.mapsUrl} onChange={e => {
                          const newEvents = [...formData.events];
                          newEvents[idx].mapsUrl = e.target.value;
                          updateField('events', newEvents);
                        }} className="w-full p-3 border rounded-lg bg-white text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Link Embed Peta (Iframe URL)</label>
                        <input placeholder="https://www.google.com/maps/embed?pb=..." value={event.mapsEmbedUrl} onChange={e => {
                          const newEvents = [...formData.events];
                          newEvents[idx].mapsEmbedUrl = e.target.value;
                          updateField('events', newEvents);
                        }} className="w-full p-3 border rounded-lg bg-white text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'setingan' && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="space-y-6">
                    <h2 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">Aset Gambar & Audio</h2>
                    <div className="grid gap-3">
                    {(Object.entries(formData.assets) as [string, string][]).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <input 
                          value={value} 
                          onChange={e => updateField(`assets.${key}`, e.target.value)} 
                          placeholder="Masukkan link Google Drive atau URL..."
                          className="w-full p-3 border rounded-xl text-xs font-mono focus:ring-1 focus:ring-blue-900" 
                        />
                        {value && value.startsWith('http') && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden border mt-1">
                                <img src={getDriveMediaUrl(value)} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        </div>
                    ))}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Link Musik (MP3)</label>
                        <input value={formData.audioUrl} onChange={e => updateField('audioUrl', e.target.value)} className="w-full p-3 border rounded-xl text-xs font-mono focus:ring-1 focus:ring-blue-900" />
                    </div>
                    </div>
                </div>

                <div className="space-y-6 pt-4 border-t">
                    <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-base font-bold text-slate-800">Foto Galeri</h2>
                    <button 
                        onClick={addGalleryImage}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100 transition-all text-[10px] font-bold uppercase"
                    >
                        <Plus size={12} />
                        <span>Tambah</span>
                    </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                    {formData.gallery.map((img, idx) => (
                        <div key={idx} className="relative group p-2 border rounded-xl bg-slate-50 transition-all hover:border-blue-200">
                        <button 
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute top-1 right-1 z-10 p-1.5 bg-white/80 rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                            title="Hapus Foto"
                        >
                            <Trash2 size={12} />
                        </button>
                        
                        <div className="aspect-square rounded-lg overflow-hidden bg-white mb-2 border">
                            {img.url ? (
                                <img src={getDriveMediaUrl(img.url)} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon size={24} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <input 
                            placeholder="Link Google Drive/URL" 
                            value={img.url} 
                            onChange={e => updateGalleryUrl(idx, e.target.value)} 
                            className="w-full p-2 border rounded-lg bg-white text-[10px] font-mono focus:ring-1 focus:ring-blue-500" 
                            />
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'hadiah' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-base font-bold text-slate-800">Rekening & Hadiah</h2>
                  <button 
                    onClick={addBankAccount}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100 transition-all text-[10px] font-bold uppercase"
                  >
                    <Plus size={12} />
                    <span>Tambah</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.bankAccounts.map((bank, idx) => (
                    <div key={idx} className="relative group p-4 border rounded-2xl bg-slate-50 transition-all hover:border-blue-200">
                      <button 
                        onClick={() => removeBankAccount(idx)}
                        className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                        title="Hapus Rekening"
                      >
                        <Trash2 size={14} />
                      </button>
                      
                      <div className="grid gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Bank</label>
                          <input placeholder="Contoh: BCA" value={bank.bankName} onChange={e => {
                            const newBanks = [...formData.bankAccounts];
                            newBanks[idx].bankName = e.target.value;
                            updateField('bankAccounts', newBanks);
                          }} className="w-full p-2.5 border rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor Rekening</label>
                          <input placeholder="1234567890" value={bank.accountNumber} onChange={e => {
                            const newBanks = [...formData.bankAccounts];
                            newBanks[idx].accountNumber = e.target.value;
                            updateField('bankAccounts', newBanks);
                          }} className="w-full p-2.5 border rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Atas Nama</label>
                          <input placeholder="Nama Pemilik" value={bank.accountHolder} onChange={e => {
                            const newBanks = [...formData.bankAccounts];
                            newBanks[idx].accountHolder = e.target.value;
                            updateField('bankAccounts', newBanks);
                          }} className="w-full p-2.5 border rounded-lg bg-white text-sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tamu' && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">Generator Link Undangan</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Nama Tamu</label>
                    <input 
                      placeholder="Masukkan nama tamu..." 
                      value={guestNameInput} 
                      onChange={e => {
                        setGuestNameInput(e.target.value);
                        setGeneratedLink(""); 
                      }}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    />
                  </div>
                  
                  <button 
                    onClick={generateLink}
                    disabled={!guestNameInput}
                    className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-800 transition-all disabled:opacity-50"
                  >
                    Buat Link
                  </button>

                  {generatedLink && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Link untuk {guestNameInput}</p>
                      <div className="flex gap-2">
                        <input 
                          readOnly 
                          value={generatedLink} 
                          className="flex-1 p-2 border rounded-lg text-xs bg-white text-slate-600 font-mono"
                        />
                        <button 
                          onClick={copyLink}
                          className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                          title="Salin"
                        >
                          {isCopied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
        
        <footer className="bg-white border-t px-4 py-2 text-center text-[8px] text-slate-400 uppercase tracking-widest flex justify-between items-center">
          <span>Spreadsheet Sync</span>
          <span>v1.5 Mobile</span>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
