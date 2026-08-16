export type GarmentCategory = 'superior' | 'inferior' | 'calzado' | 'accesorios';

export type ModelGender = 'femenino' | 'masculino' | 'neutro';

export interface Garment {
  id: string;
  name: string;
  category: GarmentCategory;
  imageUrl: string;
  thumbnailUrl?: string;
  color: string;
  brand?: string;
  price?: number;
  description?: string;
  // Positioning and scale adjustments for visual fitting simulation
  defaultScale?: number;
  defaultPosition?: { x: number; y: number }; // percentage offset
  zIndexDefault?: number;
  isCustom?: boolean;
}

export interface Model {
  id: string;
  name: string;
  gender: ModelGender;
  imageUrl: string;
  thumbnailUrl: string;
  poseName: string;
  height: string;
  description: string;
  isCustom?: boolean;
}

export interface BackgroundScene {
  id: string;
  name: string;
  category: 'original' | 'estudio' | 'calle' | 'sala' | 'pasarela' | 'naturaleza';
  imageUrl: string;
  thumbnailUrl: string;
  lightingDescription: string;
  ambientTint?: string;
  isOriginal?: boolean;
}

export interface OutfitLayer {
  garment: Garment;
  visible: boolean;
  order: number; // Layer order stack (higher = on top)
  opacity: number;
  scale: number;
  position: { x: number; y: number }; // in px or percentage
}

export interface OutfitPreset {
  id: string;
  name: string;
  description: string;
  tags: string[];
  thumbnailUrl: string;
  modelId: string;
  garmentIds: string[];
  sceneId: string;
}

export interface AIFitAssessment {
  fitScore: number;
  fitStatus: string;
  anatomicalAdjustments: {
    shoulders: string;
    torso: string;
    waist: string;
    proportions: string;
  };
  fabricPhysics: string;
  colorHarmonyAnalysis: string;
  lightingIntegration: string;
  stylingTips: string[];
}

export interface TryOnResult {
  imageUrl: string;
  timestamp: number;
  modelName: string;
  garmentsApplied: string[];
  styleScore: number;
  lightingMatched: boolean;
  isAiGenerative?: boolean;
  aiEngineUsed?: string;
  fitAssessment?: AIFitAssessment;
}

