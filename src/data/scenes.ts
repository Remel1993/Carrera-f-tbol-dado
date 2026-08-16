import { BackgroundScene, OutfitPreset } from '../types';

export const DEFAULT_SCENES: BackgroundScene[] = [
  {
    id: 'scene-original',
    name: 'Conservar Fondo Original',
    category: 'original',
    imageUrl: '', // dynamically uses the model's photo background
    thumbnailUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=200&h=150&q=80',
    lightingDescription: 'Mantiene exactamente la habitación, calle o escenario original de la foto subida',
    ambientTint: '',
    isOriginal: true,
  },
  {
    id: 'scene-studio',
    name: 'Estudio Minimalista',
    category: 'estudio',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&h=150&q=80',
    lightingDescription: 'Luz difusa de softbox frontal, sombras suaves y fondo neutral neutro',
    ambientTint: 'rgba(248, 250, 252, 0.2)'
  },
  {
    id: 'scene-street',
    name: 'Calle Soho Vanguardia',
    category: 'calle',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&h=150&q=80',
    lightingDescription: 'Luz natural de día con reflejos cálidos de arquitectura urbana y adoquines',
    ambientTint: 'rgba(251, 146, 60, 0.1)'
  },
  {
    id: 'scene-lounge',
    name: 'Sala de Diseño Loft',
    category: 'sala',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=200&h=150&q=80',
    lightingDescription: 'Iluminación cálida indirecta de lámparas escandinavas y ventanales amplios',
    ambientTint: 'rgba(254, 243, 199, 0.15)'
  },
  {
    id: 'scene-runway',
    name: 'Pasarela Fashion Week',
    category: 'pasarela',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=200&h=150&q=80',
    lightingDescription: 'Focos cenitales de alta potencia con contraluz dramático e iluminación de pasarela',
    ambientTint: 'rgba(192, 132, 252, 0.15)'
  }
];

export const DEFAULT_PRESETS: OutfitPreset[] = [
  {
    id: 'preset-executive',
    name: 'Executive Sartorial',
    description: 'Blazer navy con camisa popelín, pantalón plisado y mocasines pulidos.',
    tags: ['Formal', 'Negocios', 'Elegante'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=200&h=200&q=80',
    modelId: 'model-male-1',
    garmentIds: ['garment-sup-1', 'garment-sup-3', 'garment-inf-1', 'garment-cal-3', 'garment-acc-3'],
    sceneId: 'scene-studio'
  },
  {
    id: 'preset-urban-chic',
    name: 'Urban Streetwear',
    description: 'Cazadora de cuero con sudadera oversize, jeans selvedge y sneakers minimalistas.',
    tags: ['Urbano', 'Casual', 'Tendencia'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=200&h=200&q=80',
    modelId: 'model-neutral-1',
    garmentIds: ['garment-sup-2', 'garment-sup-5', 'garment-inf-2', 'garment-cal-1', 'garment-acc-1'],
    sceneId: 'scene-street'
  },
  {
    id: 'preset-parisienne',
    name: 'Parisienne Allure',
    description: 'Jersey de cachemira con falda midi satinada, botines chelsea y bolso de piel.',
    tags: ['Lujo Silencioso', 'Noche', 'Sofisticado'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=200&h=200&q=80',
    modelId: 'model-female-1',
    garmentIds: ['garment-sup-4', 'garment-inf-4', 'garment-cal-2', 'garment-acc-2'],
    sceneId: 'scene-lounge'
  }
];
