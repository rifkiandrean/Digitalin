
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Send, 
  UserPlus, 
  ArrowLeft, 
  MessageSquare, 
  Copy, 
  Check, 
  Phone, 
  Settings2, 
  ExternalLink,
  Loader2,
  Trash2,
  Search,
  Filter as FilterIcon,
  CheckCircle2,
  Clock,
  LayoutGrid,
  ListFilter,
  Users,
  Plus,
  Type,
  MoreVertical
} from 'lucide-react';
import { fetchWeddingData, getDriveMediaUrl, DEFAULT_WEDDING_DATA } from '../../constants';
import { WeddingData, GuestQueueItem } from '../../types';

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
}

const GuestGenerator: React.FC = () => {
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [guestName, setGuestName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Templates State
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<MessageTemplate>>({});

  // Queue & History State
  const [guestQueue, setGuestQueue] = useState<GuestQueueItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'queued' | 'sent'>('all');

  useEffect(() => {
    // Load saved queue & templates from localStorage
    const savedQueue = localStorage.getItem('wedding_guest_queue');
    if (savedQueue) setGuestQueue(JSON.parse(savedQueue));

    const savedTemplates = localStorage.getItem('wedding_msg_templates');
    
    const initData = async () => {
      try {
        const data = await fetchWeddingData();
        const mergedData = { ...DEFAULT_WEDDING_DATA, ...data };
        setWeddingData(mergedData);
        
        const firstEvent = mergedData.events[0];
        const dateStr = firstEvent.date.includes('-') 
          ? new Date(firstEvent.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
          : firstEvent.date;

        if (savedTemplates) {
          const parsed = JSON.parse(savedTemplates);
          setTemplates(parsed);
          setSelectedTemplateId(parsed[0]?.id || "");
        } else {
          const defaultTpl: MessageTemplate = {
            id: '1',
            name: 'Formal',
            content: `Assalamu’alaikum Warahmatullahi Wabarakatuh,\n\nTanpa mengurangi rasa hormat, izinkan kami mengundang Bapak/Ibu/Saudara/i [Nama Tamu] untuk hadir di acara pernikahan kami:\n\n*${mergedData.groomName} & ${mergedData.brideName}*\n\nWaktu: ${dateStr}\nPukul: ${firstEvent.time}\nTempat: ${firstEvent.location}\n\nLink Undangan Digital:\n[Link Undangan]\n\nTerima kasih atas perhatiannya.\n*${mergedData.coupleShortName}*`
          };
          const informalTpl: MessageTemplate = {
            id: '2',
            name: 'Santai',
            content: `Halo [Nama Tamu]! 👋\n\nKami mau mengundang kamu untuk hadir di hari bahagia kami nih!\n\n*${mergedData.coupleShortName} Wedding*\n📅 ${dateStr}\n📍 ${firstEvent.location}\n\nCek info lengkapnya di sini ya:\n[Link Undangan]\n\nSampai jumpa di sana! ✨`
          };
          const list = [defaultTpl, informalTpl];
          setTemplates(list);
          setSelectedTemplateId('1');
          localStorage.setItem('wedding_msg_templates', JSON.stringify(list));
        }
      } catch (err) {
        console.error("Failed to fetch wedding data", err);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // Sync states to storage
  useEffect(() => {
    localStorage.setItem('wedding_guest_queue', JSON.stringify(guestQueue));
  }, [guestQueue]);

  useEffect(() => {
    if (templates.length > 0) {
      localStorage.setItem('wedding_msg_templates', JSON.stringify(templates));
    }
  }, [templates]);

  const handlePickContact = async () => {
    // Check if Contact Picker API is supported
    const supportsContacts = 'contacts' in navigator && 'select' in (navigator as any).contacts;
    
    if (!supportsContacts) {
      alert("Browser Anda belum mendukung fitur ambil kontak langsung. Silakan masukkan nomor secara manual.");
      return;
    }

    try {
      const props = ['name', 'tel'];
      const opts = { multiple: false };
      const contacts = await (navigator as any).contacts.select(props, opts);
      
      if (contacts.length > 0) {
        const contact = contacts[0];
        if (contact.name && contact.name[0]) setGuestName(contact.name[0]);
        if (contact.tel && contact.tel[0]) {
          // Clean phone number
          const cleanPhone = contact.tel[0].replace(/[^0-9]/g, '');
          setPhoneNumber(cleanPhone);
        }
      }
    } catch (err) {
      console.error("Contact picker error:", err);
    }
  };

  const currentTemplate = useMemo(() => {
    return templates.find(t => t.id === selectedTemplateId) || templates[0];
  }, [templates, selectedTemplateId]);

  const getProcessedMessage = (name: string) => {
    if (!currentTemplate) return "";
    const baseUrl = window.location.origin + '/undangan/hani-pupud';
    const guestLink = `${baseUrl}?to=${encodeURIComponent(name || "Tamu Undangan")}`;
    
    return currentTemplate.content
      .replace(/\[Nama Tamu\]/g, name || "Bapak/Ibu/Saudara/i")
      .replace(/\[Link Undangan\]/g, guestLink);
  };

  const handleAddToQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !phoneNumber) {
      alert("Mohon lengkapi nama dan nomor telepon.");
      return;
    }

    const newItem: GuestQueueItem = {
      id: Date.now().toString(),
      name: guestName,
      phone: phoneNumber,
      status: 'queued',
      timestamp: new Date().toLocaleString('id-ID', { 
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
      })
    };

    setGuestQueue([newItem, ...guestQueue]);
    setGuestName("");
    setPhoneNumber("");
  };

  const handleSendWhatsApp = (item: GuestQueueItem) => {
    const finalMessage = getProcessedMessage(item.name);
    let formattedPhone = item.phone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    }
    
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(finalMessage)}`;
    
    // Update status to sent
    setGuestQueue(prev => prev.map(q => 
      q.id === item.id ? { ...q, status: 'sent', timestamp: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) } : q
    ));

    window.open(waUrl, '_blank');
  };

  // Function to delete a guest item from the queue
  const handleDeleteItem = (id: string) => {
    if (confirm("Hapus tamu dari daftar antrean?")) {
      setGuestQueue(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate.name || !editingTemplate.content) return;
    
    if (editingTemplate.id) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? (editingTemplate as MessageTemplate) : t));
    } else {
      const newTpl = { ...editingTemplate, id: Date.now().toString() } as MessageTemplate;
      setTemplates(prev => [...prev, newTpl]);
      setSelectedTemplateId(newTpl.id);
    }
    setShowTemplateEditor(false);
    setEditingTemplate({});
  };

  const handleDeleteTemplate = (id: string) => {
    if (templates.length <= 1) {
      alert("Minimal harus ada satu template.");
      return;
    }
    if (confirm("Hapus template ini?")) {
      const newList = templates.filter(t => t.id !== id);
      setTemplates(newList);
      if (selectedTemplateId === id) setSelectedTemplateId(newList[0].id);
    }
  };

  const filteredQueue = useMemo(() => {
    return guestQueue.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.phone.includes(searchQuery);
      const matchesFilter = filterStatus === 'all' ? true : item.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [guestQueue, searchQuery, filterStatus]);

  const stats = useMemo(() => ({
    total: guestQueue.length,
    sent: guestQueue.filter(i => i.status === 'sent').length,
    queued: guestQueue.filter(i => i.status === 'queued').length,
  }), [guestQueue]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Menghubungkan Database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-20 shadow-2xl relative">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="font-black text-lg text-slate-800 leading-none">Bulk Generator</h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Guest Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => { setEditingTemplate({}); setShowTemplateEditor(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full" title="Tambah Template">
                <Plus size={18} />
            </button>
            <button onClick={() => { if(confirm("Kosongkan daftar?")) setGuestQueue([]); }} className="p-2 text-slate-300 hover:text-red-500" title="Kosongkan Daftar">
                <Trash2 size={18} />
            </button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Template Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pilih Template Pesan</h2>
            <button onClick={() => { setEditingTemplate(currentTemplate); setShowTemplateEditor(true); }} className="text-[9px] font-bold text-indigo-600 flex items-center gap-1">
               <Settings2 size={10} /> Edit Template
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {templates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  selectedTemplateId === tpl.id 
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                  : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                }`}
              >
                {tpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form Section */}
        <section className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Input Tamu Baru</h2>
            <button 
              onClick={handlePickContact}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
            >
              <Users size={12} /> Ambil Kontak
            </button>
          </div>
          
          <form onSubmit={handleAddToQueue} className="space-y-4">
            <div className="space-y-1">
              <input 
                placeholder="Nama Tamu" 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  placeholder="Nomor WA (0812...)" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-4 pl-10 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-mono"
                />
              </div>
              <button 
                type="submit"
                className="bg-indigo-600 text-white px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 active:scale-95 transition-all"
              >
                Simpan
              </button>
            </div>
          </form>
        </section>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-3 gap-2">
            {[
                { label: 'Total', value: stats.total, color: 'text-slate-800' },
                { label: 'Antrean', value: stats.queued, color: 'text-amber-500' },
                { label: 'Terkirim', value: stats.sent, color: 'text-indigo-600' }
            ].map((stat, i) => (
                <div key={i} className="bg-white p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
                    <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</div>
                </div>
            ))}
        </div>

        {/* Filter & Search Section */}
        <div className="space-y-3">
            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                    placeholder="Cari nama atau nomor..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-4 pl-12 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-xs shadow-sm"
                />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {['all', 'queued', 'sent'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status as any)}
                        className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                            filterStatus === status 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                            : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                        }`}
                    >
                        {status === 'all' ? 'Semua' : status === 'sent' ? 'Terkirim' : 'Antrean'}
                    </button>
                ))}
            </div>
        </div>

        {/* Guest List Queue */}
        <div className="space-y-3">
            <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Antrean Pengiriman</h2>
            {filteredQueue.length === 0 ? (
                <div className="bg-white p-12 rounded-[2rem] border border-dashed border-slate-200 text-center flex flex-col items-center">
                    <ListFilter className="text-slate-200 w-12 h-12 mb-4" />
                    <p className="text-slate-400 text-xs font-medium">Belum ada tamu dalam daftar</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredQueue.map((item, idx) => (
                        <div key={item.id} className="bg-white p-4 rounded-[1.8rem] border border-slate-100 shadow-sm flex items-center justify-between group animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-800 text-sm truncate capitalize">{item.name}</h3>
                                    {item.status === 'sent' ? (
                                        <CheckCircle2 size={14} className="text-indigo-600" />
                                    ) : (
                                        <Clock size={14} className="text-amber-500" />
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-[10px] font-medium">
                                    <span className="flex items-center gap-1"><Phone size={10} /> {item.phone}</span>
                                    <span className="flex items-center gap-1"><Clock size={10} /> {item.timestamp}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button 
                                    onClick={() => handleSendWhatsApp(item)}
                                    className={`px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
                                        item.status === 'sent' 
                                        ? 'bg-slate-100 text-slate-400' 
                                        : 'bg-indigo-600 text-white shadow-indigo-100'
                                    }`}
                                >
                                    <Send size={12} /> Kirim
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </main>

      {/* Template Editor Modal */}
      {showTemplateEditor && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[400px] rounded-[2.5rem] p-6 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-lg font-bold">{editingTemplate.id ? 'Edit Template' : 'Template Baru'}</h2>
              {editingTemplate.id && (
                <button onClick={() => handleDeleteTemplate(editingTemplate.id!)} className="text-red-500 p-2"><Trash2 size={18} /></button>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Nama Template</label>
                <input 
                  value={editingTemplate.name || ""}
                  onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})}
                  placeholder="Misal: Formal, Teman, Keluarga"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-bold"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between px-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Isi Pesan</label>
                  <span className="text-[9px] font-bold text-indigo-500">Gunakan [Nama Tamu] & [Link Undangan]</span>
                </div>
                <textarea 
                  value={editingTemplate.content || ""}
                  onChange={e => setEditingTemplate({...editingTemplate, content: e.target.value})}
                  placeholder="Tulis pesan di sini..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 text-sm min-h-[200px] resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setShowTemplateEditor(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveTemplate}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto py-8 text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
        Vell Digital • Bulk Management
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GuestGenerator;
