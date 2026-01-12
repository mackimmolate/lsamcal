import { useMaterial, useSimulation } from './hooks';
import { cn } from './lib/utils';
import { Calculator, Clock, CircleDollarSign, CheckCircle2, XCircle, Info, Settings2 } from 'lucide-react';

function App() {
  const { materials, selectedMaterial, setSelectedMaterialId } = useMaterial();
  const { inputs, updateInput, calculate } = useSimulation();

  const results = calculate(selectedMaterial);

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">LSAM Material Calculator</h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Compare & Estimate
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar: Material Selection & Inputs */}
          <div className="lg:col-span-4 space-y-6">

            {/* Material Selector */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-gray-500" />
                Material Selection
              </h2>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Choose Material</label>
                <select
                  value={selectedMaterial.id}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  className="w-full rounded-lg border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white"
                >
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800 mt-2">
                  <p className="font-medium">{selectedMaterial.properties.base_polymer.value}</p>
                  <p>{selectedMaterial.properties.reinforcement.value}</p>
                </div>
              </div>
            </section>

            {/* Global Inputs */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Process Parameters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Printing Limit (kg/h)</label>
                  <input
                    type="number"
                    value={inputs.printing_limit_kg_h}
                    onChange={(e) => updateInput('printing_limit_kg_h', Number(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width (mm)</label>
                    <input
                      type="number"
                      value={inputs.width_mm}
                      onChange={(e) => updateInput('width_mm', Number(e.target.value))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Length (mm)</label>
                    <input
                      type="number"
                      value={inputs.length_mm}
                      onChange={(e) => updateInput('length_mm', Number(e.target.value))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bead Thickness (mm)</label>
                  <input
                    type="number"
                    value={inputs.bead_thickness_mm}
                    onChange={(e) => updateInput('bead_thickness_mm', Number(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Printing Angle (degrees)</label>
                  <input
                    type="number"
                    value={inputs.printing_angle}
                    onChange={(e) => updateInput('printing_angle', Number(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Piece Length (m)</label>
                  <input
                    type="number"
                    value={inputs.piece_length_m}
                    onChange={(e) => updateInput('piece_length_m', Number(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Main Content: Results & Details */}
          <div className="lg:col-span-8 space-y-6">

            {/* Feasibility Banner */}
            <div className={cn(
              "rounded-xl p-6 flex items-center gap-4 text-white shadow-sm transition-colors",
              results.isPossible ? "bg-green-600" : "bg-red-600"
            )}>
              {results.isPossible ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
              <div>
                <h2 className="text-2xl font-bold">{results.isPossible ? "Print Possible" : "Print Not Feasible"}</h2>
                <p className="opacity-90">
                  {results.isPossible
                    ? "Material flow requirements are within limits."
                    : `Required flow (${formatNumber(results.materialLimitCm3s)} cm³/s) exceeds max flow (${formatNumber(results.maxVolumeFlowCm3s)} cm³/s).`}
                </p>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Rough Time</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatNumber(results.roughTimeHours)} h</div>
                <div className="text-xs text-gray-500">for {inputs.piece_length_m}m piece</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <CircleDollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">Material Cost</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">€{formatNumber(results.costPerCm3, 4)}</div>
                <div className="text-xs text-gray-500">per cm³</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-medium">Layer Cost</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">€{formatNumber(results.costPerLayer)}</div>
                <div className="text-xs text-gray-500">per full layer</div>
              </div>
            </div>

            {/* Detailed Properties Table */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Material Properties</h3>
                <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded text-gray-600 uppercase tracking-wide">{selectedMaterial.name}</span>
              </div>
              <div className="divide-y divide-gray-200">
                <PropertyRow label="Price" value={selectedMaterial.properties.price.value} unit="EUR/kg" />
                <PropertyRow label="Density" value={selectedMaterial.properties.density.value} unit="g/cc" />
                <PropertyRow label="Tensile Strength (X/Z)" value={selectedMaterial.properties.tensile_strength.value} unit="MPa" />
                <PropertyRow label="Tensile Modulus" value={selectedMaterial.properties.tensile_modulus.value} unit="GPa" />
                <PropertyRow label="Flexural Strength" value={selectedMaterial.properties.flexural_strength.value} unit="MPa" />
                <PropertyRow label="Compressive Strength" value={selectedMaterial.properties.compressive_strength.value} unit="MPa" />
                <PropertyRow label="HDT @ 1.82 MPa" value={selectedMaterial.properties.hdt.value} />
                <PropertyRow label="Tg (Tan Delta)" value={selectedMaterial.properties.tg.value} />
                <PropertyRow label="CTE X" value={selectedMaterial.properties.cte_x.value} unit="ppm/°C" />
                <PropertyRow label="CTE Z" value={selectedMaterial.properties.cte_z.value} unit="ppm/°C" />
                <PropertyRow label="Vertical Layer Time" value={selectedMaterial.properties.vert_layer_time.value} unit="min" />
                <PropertyRow label="Overhang Layer Time" value={selectedMaterial.properties.oh_layer_time.value} unit="min" />
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}

function PropertyRow({ label, value, unit }: { label: string, value: string | number | null, unit?: string }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="grid grid-cols-2 px-6 py-3 hover:bg-gray-50 transition-colors">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-sm font-medium text-gray-900 text-right">
        {value} {unit && <span className="text-gray-500 ml-1">{unit}</span>}
      </div>
    </div>
  );
}

export default App;
