import { useState, useMemo } from 'react';
import data from './data.json';
import type { AppData, Material } from './types';

const appData = data as unknown as AppData;

export function useMaterial() {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(appData.materials[0].id);

  const selectedMaterial = useMemo(() =>
    appData.materials.find(m => m.id === selectedMaterialId) || appData.materials[0],
  [selectedMaterialId]);

  return {
    materials: appData.materials,
    selectedMaterial,
    setSelectedMaterialId
  };
}

export function useSimulation(initialDefaults = appData.defaults) {
  const [inputs, setInputs] = useState(initialDefaults);

  const updateInput = (key: keyof typeof inputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const calculate = (material: Material) => {
    const density = Number(material.properties.density.value);

    // Parse time strings "HH:MM:SS" to seconds
    const parseTime = (timeStr: string | number | null) => {
      if (typeof timeStr !== 'string') return 0;
      const parts = timeStr.split(':').map(Number);
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      return 0;
    };

    const ohLayerTimeSec = parseTime(material.properties.oh_layer_time.value);

    // Total Volume = Thickness * Length * Width
    const totalVolumeMm3 = inputs.bead_thickness_mm * inputs.length_mm * inputs.width_mm;
    const totalVolumeCm3 = totalVolumeMm3 / 1000;

    const maxVolumeFlowCm3s = (inputs.printing_limit_kg_h * 1000 / 3600) / density;

    const materialLimitCm3s = (totalVolumeCm3) / ohLayerTimeSec;

    const isPossible = maxVolumeFlowCm3s > materialLimitCm3s;

    const angleRad = inputs.printing_angle * (Math.PI / 180);
    const angleFactor = Math.sin(angleRad);

    // Avoid division by zero
    const effectiveThickness = (inputs.bead_thickness_mm * angleFactor) || 0.001;

    const roughTimeHours = ((inputs.piece_length_m / effectiveThickness) * ohLayerTimeSec) / 3600;

    const price = Number(material.properties.price.value);
    const costPerCm3 = (price / 1000) * density;

    const costPerLayer = totalVolumeCm3 * costPerCm3;

    return {
      density,
      maxVolumeFlowCm3s,
      materialLimitCm3s,
      isPossible,
      roughTimeHours,
      costPerCm3,
      costPerLayer
    };
  };

  return { inputs, updateInput, calculate };
}
