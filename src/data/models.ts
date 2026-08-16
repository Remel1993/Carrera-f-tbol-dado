import { Model } from '../types';

export const DEFAULT_MODELS: Model[] = [
  {
    id: 'model-female-1',
    name: 'Elena Rostova',
    gender: 'femenino',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=300&q=80',
    poseName: 'Pose Frontal Estudio',
    height: '1.76 m',
    description: 'Silueta esbelta, pose vertical simétrica ideal para vestidos, tops y blazers.'
  },
  {
    id: 'model-male-1',
    name: 'Mateo Chen',
    gender: 'masculino',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&h=300&q=80',
    poseName: 'Pose Frontal Atlética',
    height: '1.83 m',
    description: 'Complexión atlética regular, óptima para camisas, trajes, chaquetas y calzado formal/urbano.'
  },
  {
    id: 'model-neutral-1',
    name: 'Alex Vance',
    gender: 'neutro',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&h=300&q=80',
    poseName: 'Pose Neutra Vanguardista',
    height: '1.78 m',
    description: 'Estilo contemporáneo fluido, ideal para streetwear oversize y prendas unisex.'
  }
];
