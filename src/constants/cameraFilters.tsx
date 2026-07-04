export type CameraFilterId =
  | 'none'
  | 'dog'
  | 'cat'
  | 'crown'
  | 'hearts'
  | 'glasses'
  | 'bunny';

export type CameraFilter = {
  id: CameraFilterId;
  labelKey: string;
  preview: string;
};

export const CAMERA_FILTERS: CameraFilter[] = [
  {id: 'none', labelKey: 'camera.filters.none', preview: '🙂'},
  {id: 'dog', labelKey: 'camera.filters.dog', preview: '🐶'},
  {id: 'cat', labelKey: 'camera.filters.cat', preview: '🐱'},
  {id: 'bunny', labelKey: 'camera.filters.bunny', preview: '🐰'},
  {id: 'crown', labelKey: 'camera.filters.crown', preview: '👑'},
  {id: 'hearts', labelKey: 'camera.filters.hearts', preview: '💖'},
  {id: 'glasses', labelKey: 'camera.filters.glasses', preview: '😎'},
];

export const QR_CODE_TYPES = ['qr'] as const;

export const BARCODE_CODE_TYPES = [
  'ean-13',
  'ean-8',
  'code-128',
  'code-39',
  'upc-a',
  'upc-e',
  'itf',
  'pdf-417',
] as const;
