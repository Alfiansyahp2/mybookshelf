import { Bookmark } from 'lucide-react'

interface BookStatusInputProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function BookStatusInput({ formData, setFormData }: BookStatusInputProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">Status Membaca</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-walnut mb-1.5">
            <Bookmark className="w-4 h-4 inline mr-1" />
            Status Buku
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
          >
            <option value="unread">Belum Dibaca (Unread)</option>
            <option value="reading">Sedang Dibaca (Reading)</option>
            <option value="finished">Selesai Dibaca (Finished)</option>
            <option value="wishlist">Daftar Keinginan (Wishlist)</option>
            <option value="borrowed">Dipinjamkan ke Orang Lain</option>
          </select>
        </div>

        {/* Lending Info */}
        {formData.status === 'borrowed' && (
          <div className="col-span-2 pt-4 border-t border-walnut/10 space-y-4">
            <h4 className="text-xs font-semibold text-walnut/60 uppercase tracking-wider">Informasi Peminjaman</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-walnut mb-1.5">Dipinjam Oleh</label>
                <input
                  type="text"
                  value={formData.borrowedBy || ''}
                  onChange={(e) => setFormData({ ...formData, borrowedBy: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                  placeholder="Nama Peminjam"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-walnut mb-1.5">Tanggal Dipinjam</label>
                <input
                  type="date"
                  value={formData.borrowedDate || ''}
                  onChange={(e) => setFormData({ ...formData, borrowedDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-walnut mb-1.5">Tenggat Waktu</label>
                <input
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
