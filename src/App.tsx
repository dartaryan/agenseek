function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Agenseek - BMAD Learning Hub
          </h1>
          <p className="text-gray-600 font-sans">
            TailwindCSS configured with Emerald theme ✨
          </p>
        </div>

        {/* Color Palette Test */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Emerald Color Palette
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-primary text-white p-4 rounded-lg text-center">
              <p className="font-semibold">Primary</p>
              <p className="text-sm">#10B981</p>
            </div>
            <div className="bg-secondary text-gray-800 p-4 rounded-lg text-center">
              <p className="font-semibold">Secondary</p>
              <p className="text-sm">#6EE7B7</p>
            </div>
            <div className="bg-accent text-white p-4 rounded-lg text-center">
              <p className="font-semibold">Accent</p>
              <p className="text-sm">#2DD4BF</p>
            </div>
          </div>
        </div>

        {/* Emerald Shades Test */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Emerald Shades (50-950)
          </h2>
          <div className="grid grid-cols-11 gap-2">
            <div className="bg-emerald-50 h-16 rounded flex items-center justify-center text-xs">50</div>
            <div className="bg-emerald-100 h-16 rounded flex items-center justify-center text-xs">100</div>
            <div className="bg-emerald-200 h-16 rounded flex items-center justify-center text-xs">200</div>
            <div className="bg-emerald-300 h-16 rounded flex items-center justify-center text-xs">300</div>
            <div className="bg-emerald-400 h-16 rounded flex items-center justify-center text-xs text-white">400</div>
            <div className="bg-emerald-500 h-16 rounded flex items-center justify-center text-xs text-white">500</div>
            <div className="bg-emerald-600 h-16 rounded flex items-center justify-center text-xs text-white">600</div>
            <div className="bg-emerald-700 h-16 rounded flex items-center justify-center text-xs text-white">700</div>
            <div className="bg-emerald-800 h-16 rounded flex items-center justify-center text-xs text-white">800</div>
            <div className="bg-emerald-900 h-16 rounded flex items-center justify-center text-xs text-white">900</div>
            <div className="bg-emerald-950 h-16 rounded flex items-center justify-center text-xs text-white">950</div>
          </div>
        </div>

        {/* Font Test */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Fredoka Font Test
          </h2>
          <div className="space-y-2">
            <p className="text-3xl font-light">Fredoka Light (300)</p>
            <p className="text-3xl font-normal">Fredoka Regular (400)</p>
            <p className="text-3xl font-medium">Fredoka Medium (500)</p>
            <p className="text-3xl font-semibold">Fredoka Semibold (600)</p>
            <p className="text-3xl font-bold">Fredoka Bold (700)</p>
          </div>
        </div>

        {/* RTL Test */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            RTL Layout Test
          </h2>
          <p className="text-gray-600 mb-2">
            This text should be aligned to the right in RTL mode.
          </p>
          <div className="flex gap-4">
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
              Primary Button
            </button>
            <button className="bg-secondary text-gray-800 px-6 py-2 rounded-lg hover:bg-emerald-400 transition-colors">
              Secondary Button
            </button>
          </div>
        </div>

        {/* Status Check */}
        <div className="bg-emerald-50 border-2 border-primary rounded-xl p-6 text-center">
          <p className="text-xl font-semibold text-primary">
            ✅ Story 1.2: TailwindCSS Configuration Complete!
          </p>
          <p className="text-gray-600 mt-2">
            Emerald theme, Fredoka font, and RTL layout are working correctly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
