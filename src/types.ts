export interface MaterialProperty {
  label: string;
  value: string | number | null;
  unit: string;
}

export interface MaterialProperties {
  price: MaterialProperty;
  base_polymer: MaterialProperty;
  reinforcement: MaterialProperty;
  density: MaterialProperty;
  tensile_strength: MaterialProperty;
  tensile_modulus: MaterialProperty;
  flexural_strength: MaterialProperty;
  compressive_strength: MaterialProperty;
  hdt: MaterialProperty;
  tg: MaterialProperty;
  cte_x: MaterialProperty;
  cte_z: MaterialProperty;
  vert_layer_time: MaterialProperty;
  vert_temp: MaterialProperty;
  oh_layer_time: MaterialProperty;
  oh_temp: MaterialProperty;
}

export interface Material {
  id: string;
  name: string;
  properties: MaterialProperties;
}

export interface SimulationDefaults {
  printing_limit_kg_h: number;
  width_mm: number;
  length_mm: number;
  bead_thickness_mm: number;
  printing_angle: number;
  piece_length_m: number;
}

export interface AppData {
  materials: Material[];
  defaults: SimulationDefaults;
}
