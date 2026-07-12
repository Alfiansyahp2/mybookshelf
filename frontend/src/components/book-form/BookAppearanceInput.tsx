interface BookAppearanceInputProps {
  formData: any;
  setFormData: (data: any) => void;
}

const colorPalettes = [
  { name: 'Classic Brown', colors: ['#8B7355', '#6B5344', '#5C4532'] },
  { name: 'Navy Blue', colors: ['#1E3A5F', '#2A4A7F', '#3D5A8F'] },
  { name: 'Forest Green', colors: ['#2D5A3D', '#3A7B4F', '#4A8B5F'] },
  { name: 'Burgundy Red', colors: ['#7A1C1C', '#9B2C2C', '#BF3E3E'] },
  { name: 'Royal Purple', colors: ['#4A2374', '#6B3491', '#8B45AB'] },
  { name: 'Charcoal Gray', colors: ['#2C3E50', '#34495E', '#4A5A6A'] },
  { name: 'Ocean Blue', colors: ['#1A5F7A', '#2E86AB', '#4793AF'] },
  { name: 'Sunset Orange', colors: ['#D4621A', '#E67E22', '#F39C12'] },
  { name: 'Emerald Green', colors: ['#27AE60', '#2ECC71', '#58D68D'] },
  { name: 'Pure White', colors: ['#F5F5F5', '#E0E0E0', '#CCCCCC'] },
  { name: 'Midnight Black', colors: ['#2A2A2A', '#1A1A1A', '#0D0D0D'] },
  { name: 'Vibrant Yellow', colors: ['#F4D03F', '#F1C40F', '#D4AC0D'] },
  { name: 'Soft Pink', colors: ['#FADBD8', '#F5B7B1', '#F1948A'] },
  { name: 'Custom', colors: ['#8B7355', '#6B5344', '#5C4532'] }
]

export default function BookAppearanceInput({ formData, setFormData }: BookAppearanceInputProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">Tampilan Buku</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-walnut mb-1.5">Tinggi Buku</label>
          <select
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
          >
            <option value="short">Pendek</option>
            <option value="medium">Sedang</option>
            <option value="tall">Tinggi</option>
          </select>
        </div>

        {/* Thickness */}
        <div>
          <label className="block text-sm font-medium text-walnut mb-1.5">Ketebalan Buku</label>
          <select
            value={formData.thickness}
            onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
            className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
          >
            <option value="thin">Tipis</option>
            <option value="regular">Biasa</option>
            <option value="thick">Tebal</option>
          </select>
        </div>

        {/* Color Palette Picker */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-walnut mb-1.5">Warna Punggung Buku (Spine)</label>
          <div className="space-y-3">
            {/* Predefined Palettes */}
            <div className="flex flex-wrap gap-2">
              {colorPalettes.map((palette) => (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, color1: palette.colors[0], color2: palette.colors[1], color3: palette.colors[2] })}
                  className={`px-3 py-2 rounded-lg border-2 transition-all ${
                    formData.color1 === palette.colors[0] && formData.color2 === palette.colors[1] && formData.color3 === palette.colors[2]
                      ? 'border-walnut bg-walnut/10 shadow-md'
                      : 'border-walnut/20 hover:border-walnut/40 bg-cream'
                  }`}
                  title={palette.name}
                >
                  <div className="flex gap-1">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-walnut/70 ml-1">{palette.name}</span>
                </button>
              ))}
            </div>

            {/* Custom Color Preview */}
            <div className="flex items-center gap-2 p-3 bg-cream rounded-xl border border-walnut/20">
              <span className="text-sm text-walnut/60">Saat Ini:</span>
              <div className="flex gap-1">
                <input
                  type="color"
                  value={formData.color1}
                  onChange={(e) => setFormData({ ...formData, color1: e.target.value })}
                  className="w-8 h-8 p-0 border-0 rounded-lg shadow-sm cursor-pointer hover:scale-110 transition-transform"
                  title="Warna Terang"
                />
                <input
                  type="color"
                  value={formData.color2}
                  onChange={(e) => setFormData({ ...formData, color2: e.target.value })}
                  className="w-8 h-8 p-0 border-0 rounded-lg shadow-sm cursor-pointer hover:scale-110 transition-transform"
                  title="Warna Sedang"
                />
                <input
                  type="color"
                  value={formData.color3}
                  onChange={(e) => setFormData({ ...formData, color3: e.target.value })}
                  className="w-8 h-8 p-0 border-0 rounded-lg shadow-sm cursor-pointer hover:scale-110 transition-transform"
                  title="Warna Gelap"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
