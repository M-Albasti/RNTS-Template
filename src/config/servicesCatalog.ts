import type {DrawerParamList} from '@Types/appNavigation';
import type {FontsFamily} from '@Types/fontsFamily';

export type ServiceCategoryId =
  | 'social'
  | 'commerce'
  | 'media'
  | 'tools'
  | 'account';

export type ServiceCatalogItem = {
  id: string;
  route: keyof DrawerParamList;
  category: ServiceCategoryId;
  titleKey: string;
  subtitleKey: string;
  iconType: FontsFamily;
  iconName: string;
  accent?: string;
  keywords: string[];
};

export const SERVICE_CATEGORIES: ServiceCategoryId[] = [
  'social',
  'commerce',
  'media',
  'tools',
  'account',
];

export const SERVICES_CATALOG: ServiceCatalogItem[] = [
  {
    id: 'feed',
    route: 'PostStack',
    category: 'social',
    titleKey: 'services.items.feed.title',
    subtitleKey: 'services.items.feed.subtitle',
    iconType: 'Ionicons',
    iconName: 'newspaper-outline',
    keywords: ['feed', 'posts', 'social', 'community', 'تغذية', 'منشورات'],
  },
  {
    id: 'chat',
    route: 'ChatStack',
    category: 'social',
    titleKey: 'services.items.chat.title',
    subtitleKey: 'services.items.chat.subtitle',
    iconType: 'Ionicons',
    iconName: 'chatbubbles-outline',
    keywords: ['chat', 'messages', 'دردشة', 'رسائل'],
  },
  {
    id: 'todo',
    route: 'TodoStack',
    category: 'social',
    titleKey: 'services.items.todo.title',
    subtitleKey: 'services.items.todo.subtitle',
    iconType: 'Ionicons',
    iconName: 'checkbox-outline',
    keywords: ['todo', 'tasks', 'productivity', 'مهام'],
  },
  {
    id: 'delivery',
    route: 'DeliveryStack',
    category: 'commerce',
    titleKey: 'services.items.delivery.title',
    subtitleKey: 'services.items.delivery.subtitle',
    iconType: 'MaterialCommunityIcons',
    iconName: 'truck-delivery-outline',
    keywords: ['delivery', 'courier', 'توصيل', 'سائق'],
  },
  {
    id: 'marketplace',
    route: 'MarketplaceStack',
    category: 'commerce',
    titleKey: 'services.items.marketplace.title',
    subtitleKey: 'services.items.marketplace.subtitle',
    iconType: 'Ionicons',
    iconName: 'storefront-outline',
    keywords: ['market', 'shop', 'store', 'سوق', 'متجر'],
  },
  {
    id: 'wallet',
    route: 'WalletStack',
    category: 'commerce',
    titleKey: 'services.items.wallet.title',
    subtitleKey: 'services.items.wallet.subtitle',
    iconType: 'Ionicons',
    iconName: 'wallet-outline',
    keywords: ['wallet', 'money', 'pay', 'محفظة', 'دفع'],
  },
  {
    id: 'video',
    route: 'VideoStack',
    category: 'media',
    titleKey: 'services.items.video.title',
    subtitleKey: 'services.items.video.subtitle',
    iconType: 'Ionicons',
    iconName: 'videocam-outline',
    keywords: ['video', 'record', 'فيديو'],
  },
  {
    id: 'audio',
    route: 'AudioStack',
    category: 'media',
    titleKey: 'services.items.audio.title',
    subtitleKey: 'services.items.audio.subtitle',
    iconType: 'Ionicons',
    iconName: 'musical-notes-outline',
    keywords: ['audio', 'music', 'sound', 'صوت'],
  },
  {
    id: 'gallery',
    route: 'GalleryStack',
    category: 'media',
    titleKey: 'services.items.gallery.title',
    subtitleKey: 'services.items.gallery.subtitle',
    iconType: 'Ionicons',
    iconName: 'images-outline',
    keywords: ['gallery', 'photos', 'images', 'معرض', 'صور'],
  },
  {
    id: 'game',
    route: 'GameStack',
    category: 'media',
    titleKey: 'services.items.game.title',
    subtitleKey: 'services.items.game.subtitle',
    iconType: 'MaterialCommunityIcons',
    iconName: 'slot-machine',
    keywords: ['game', 'spin', 'coins', 'لعبة', 'عجلة'],
  },
  {
    id: 'camera',
    route: 'CameraStack',
    category: 'tools',
    titleKey: 'services.items.camera.title',
    subtitleKey: 'services.items.camera.subtitle',
    iconType: 'Ionicons',
    iconName: 'camera-outline',
    keywords: ['camera', 'qr', 'barcode', 'كاميرا', 'باركود'],
  },
  {
    id: 'designSystem',
    route: 'DesignSystemStack',
    category: 'tools',
    titleKey: 'services.items.designSystem.title',
    subtitleKey: 'services.items.designSystem.subtitle',
    iconType: 'Ionicons',
    iconName: 'color-palette-outline',
    keywords: ['design', 'ui', 'tokens', 'تصميم'],
  },
  {
    id: 'profile',
    route: 'Profile',
    category: 'account',
    titleKey: 'services.items.profile.title',
    subtitleKey: 'services.items.profile.subtitle',
    iconType: 'Ionicons',
    iconName: 'person-circle-outline',
    keywords: ['profile', 'account', 'ملف', 'حساب'],
  },
];

export const filterServicesCatalog = (
  query: string,
  category: ServiceCategoryId | 'all',
): ServiceCatalogItem[] => {
  const normalized = query.trim().toLowerCase();
  return SERVICES_CATALOG.filter(item => {
    const matchesCategory = category === 'all' || item.category === category;
    if (!normalized) {
      return matchesCategory;
    }
    const haystack = [
      item.id,
      item.route,
      item.category,
      ...item.keywords,
    ]
      .join(' ')
      .toLowerCase();
    return matchesCategory && haystack.includes(normalized);
  });
};
