import { Calendar, ShoppingBag, MapPin } from 'lucide-react'

interface BookPurchaseInputProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function BookPurchaseInput({ formData, setFormData }: BookPurchaseInputProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">Informasi Perolehan</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Purchase/Gift Toggle */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-walnut mb-1.5">Jenis Perolehan</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, acquisitionType: 'purchased' })}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                formData.acquisitionType === 'purchased'
                  ? 'bg-walnut text-white shadow'
                  : 'bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20'
              }`}
            >
              Beli Sendiri
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, acquisitionType: 'gift' })}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                formData.acquisitionType === 'gift'
                  ? 'bg-walnut text-white shadow'
                  : 'bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20'
              }`}
            >
              Hadiah
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, acquisitionType: 'borrowed' })}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                formData.acquisitionType === 'borrowed'
                  ? 'bg-walnut text-white shadow'
                  : 'bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20'
              }`}
            >
              Pinjam
            </button>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-walnut mb-1.5">
            <Calendar className="w-4 h-4 inline mr-1" />
            {formData.acquisitionType === 'gift' ? 'Tanggal Diterima' : formData.acquisitionType === 'borrowed' ? 'Tanggal Pinjam' : 'Tanggal Beli'}
          </label>
          <input
            type="date"
            value={formData.purchaseDate || ''}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
            className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
          />
        </div>

        {/* Price - Only show if purchased */}
        {formData.acquisitionType === 'purchased' && (
          <div>
            <label className="block text-sm font-medium text-walnut mb-1.5 flex items-center">
              <ShoppingBag className="w-4 h-4 inline mr-1" /> Harga Beli
            </label>
            <div className="flex relative">
              <select
                value={formData.purchaseCurrency || 'IDR'}
                onChange={(e) => setFormData({ ...formData, purchaseCurrency: e.target.value })}
                className="absolute left-1 top-1.5 bottom-1.5 bg-transparent border-r border-walnut/20 text-walnut/80 text-sm focus:outline-none px-2 rounded-l-lg z-10"
              >
                <option value="IDR">Rp</option>
                <option value="USD">$</option>
                <option value="EUR">€</option>
                <option value="GBP">£</option>
                <option value="JPY">¥</option>
              </select>
              <input
                type="number"
                step={formData.purchaseCurrency === 'IDR' || formData.purchaseCurrency === 'JPY' ? '1' : '0.01'}
                min="0"
                value={formData.purchasePrice || ''}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="w-full pl-16 pr-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                placeholder="0"
              />
            </div>
          </div>
        )}

        {/* Location / Shop - Only show if purchased */}
        {formData.acquisitionType === 'purchased' && (
          <div>
            <label className="block text-sm font-medium text-walnut mb-1.5 flex items-center">
              <MapPin className="w-4 h-4 inline mr-1" /> Tempat Beli
            </label>
            <input
              type="text"
              value={formData.purchaseLocation || ''}
              onChange={(e) => setFormData({ ...formData, purchaseLocation: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
              placeholder="Nama Toko (opsional)"
            />
          </div>
        )}

        {/* Gift From */}
        {formData.acquisitionType === 'gift' && (
          <div>
            <label className="block text-sm font-medium text-walnut mb-1.5">🎁 Hadiah Dari</label>
            <input
              type="text"
              value={formData.giftFrom || ''}
              onChange={(e) => setFormData({ ...formData, giftFrom: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
              placeholder="Nama pengirim hadiah"
            />
          </div>
        )}

        {/* Borrowed From */}
        {formData.acquisitionType === 'borrowed' && (
          <div>
            <label className="block text-sm font-medium text-walnut mb-1.5">👤 Pinjam Dari</label>
            <input
              type="text"
              value={formData.borrowedFrom || ''}
              onChange={(e) => setFormData({ ...formData, borrowedFrom: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
              placeholder="Nama teman atau perpustakaan"
            />
          </div>
        )}
      </div>
    </div>
  )
}
