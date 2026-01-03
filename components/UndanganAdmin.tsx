
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Plus, Trash2, Edit2, Save, X, Image as ImageIcon, ArrowLeft, Tag, DollarSign, Package, Star, CloudIcon, RefreshCw, Loader2, CheckCircle2, Settings2 } from 'lucide-react';
import { InvitationTemplate } from '../types';
import { saveTemplateCatalogToCloud, fetchTemplateCatalog } from '../constants';

const UndanganAdmin: React.FC = () => {
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<InvitationTemplate>>({
    name: '',
    price: 0,
    category: 'Modern',
    previewImageUrl: ''
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTemplateCatalog();
      if (data && data.length > 0) {
        setTemplates(data);
      }
    };
    loadData();
  }, []);

  const saveToStorage = (data: InvitationTemplate[]) => {
    localStorage.setItem('vell_invitation_templates', JSON.stringify(data));
    setTemplates(data);
  };

  const handleSyncToCloud = async () => {
    if (templates.length === 0) {
      alert("Tidak ada data untuk disinkronkan.");
      return;
    }
    
    setIsSyncing(true);
    setSyncSuccess(false);
    
    try {
      await saveTemplateCatalogToCloud(templates);
      // Tunggu sejenak agar UI terasa natural
      setTimeout(() => {
        setIsSyncing(false);
        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 3000);
      }, 1000);
    } catch (error) {
      setIsSyncing(false);
      alert("Gagal sinkronisasi ke spreadsheet. Pastikan URL API benar.");
    }
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.previewImageUrl) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    let newList: InvitationTemplate[];
    if (editingId) {
      newList = templates.map(t => t.id === editingId ? { ...t, ...form } as InvitationTemplate : t);
    } else {
      const newTemplate: InvitationTemplate = {
        id: Date.now().toString(),
        name: form.name!,
        price: Number(form.price),
        category: form.category as any,
        previewImageUrl: form.previewImageUrl!,
        isPopular: false
      };
      newList = [...templates, newTemplate];
    }

    saveToStorage(newList);
    resetForm();
  };

  const resetForm = () => {
    setForm({ name: '', price: 0, category: 'Modern', previewImageUrl: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus template ini dari daftar lokal? (Klik 'Sync to Cloud' setelahnya untuk memperbarui database)")) {
      saveToStorage(templates.filter(t => t.id !== id));
    }
  };

  const handleEdit = (t: InvitationTemplate) => {
    setForm(t);
    setEditingId(t.id);
    setIsAdding(true);
  };

  const togglePopular = (id: string) => {
    saveToStorage(templates.map(t => t.id === id ? { ...t, isPopular: !t.isPopular } : t));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <a href="/undangan" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </a>
          <div className="flex items-center gap-2">
            <LayoutDashboard size={20} className="text-indigo-600" />
            <h1 className="font-bold text-lg">Admin Katalog</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSyncToCloud}
            disabled={isSyncing}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              syncSuccess 
              ? 'bg-green-50 text-green-600' 
              : isSyncing 
                ? 'bg-slate-100 text-slate-400' 
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
            }`}
          >
            {isSyncing ? <Loader2 size={16} className="animate-spin" /> : syncSuccess ? <CheckCircle2 size={16} /> : <CloudIcon size={16} />}
            {isSyncing ? 'Syncing...' : syncSuccess ? 'Synced!' : 'Sync to Cloud'}
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md"
          >
            <Plus size={16} /> Tambah Desain
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Helper Note */}
        <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-4">
           {/* Fix: Added missing Settings2 import from lucide-react */}
           <div className="bg-white p-2 rounded-lg text-indigo-600 shadow-sm"><Settings2 size={20} className="w-5 h-5" /></div>
           <div>
              <p className="text-xs font-bold text-indigo-900 mb-1">Catatan Penting:</p>
              <p className="text-[10px] text-indigo-700 leading-relaxed">
                Data yang Anda tambahkan/edit di sini disimpan di browser Anda terlebih dahulu. <br/>
                Pastikan menekan tombol <b>"Sync to Cloud"</b> untuk memperbarui database Spreadsheet utama agar perubahan muncul di halaman katalog pelanggan.
              </p>
           </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Package size={24} /></div>
              <div>
                <div className="text-2xl font-black">{templates.length}</div>
                <div className="text-xs text-slate-400 uppercase font-bold">Total Desain</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Tag size={24} /></div>
              <div>
                <div className="text-2xl font-black">{templates.filter(t => t.isPopular).length}</div>
                <div className="text-xs text-slate-400 uppercase font-bold">Terpopuler</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${syncSuccess ? 'bg-green-50 text-green-600' : 'bg-emerald-50 text-emerald-600'}`}>
                <CloudIcon size={24} />
              </div>
              <div>
                <div className="text-2xl font-black">{syncSuccess ? 'Updated' : 'Connected'}</div>
                <div className="text-xs text-slate-400 uppercase font-bold">Database Status</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        {isAdding && (
          <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editingId ? 'Edit Desain' : 'Tambah Desain Baru'}</h2>
                <button onClick={resetForm} className="p-2 text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Nama Desain</label>
                  <input 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Contoh: Eternal Blue" 
                    className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Harga (Rp)</label>
                    <input 
                      type="number"
                      value={form.price} 
                      onChange={e => setForm({...form, price: Number(e.target.value)})}
                      placeholder="150000" 
                      className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Kategori</label>
                    <select 
                      value={form.category} 
                      onChange={e => setForm({...form, category: e.target.value as any})}
                      className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                    >
                      <option>Modern</option>
                      <option>Floral</option>
                      <option>Minimalist</option>
                      <option>Elegant</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">URL Gambar Preview</label>
                  <input 
                    value={form.previewImageUrl} 
                    onChange={e => setForm({...form, previewImageUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/..." 
                    className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 text-xs font-mono"
                  />
                </div>
                {form.previewImageUrl && (
                  <div className="h-32 w-full rounded-xl overflow-hidden border">
                    <img src={form.previewImageUrl} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
                
                <button 
                  onClick={handleSave}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all mt-4 shadow-lg active:scale-95"
                >
                  <Save size={18} /> Simpan Lokal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Templates Table/Grid */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Preview</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Info Desain</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Popular</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {templates.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-16 rounded-lg overflow-hidden border">
                      <img src={t.previewImageUrl} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.category} • Rp {t.price.toLocaleString('id-ID')}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => togglePopular(t.id)}
                      className={`p-2 rounded-full transition-colors ${t.isPopular ? 'text-amber-500 bg-amber-50' : 'text-slate-200 hover:text-slate-400'}`}
                    >
                      <Star size={20} fill={t.isPopular ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(t)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400 italic">Belum ada data template. Silakan tambah data baru.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UndanganAdmin;
