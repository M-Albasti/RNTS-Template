import {NavigatorScreenParams, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ConfirmationResult} from '@Types/firebaseAuthTypes';
import {LoginTypes} from '@Types/loginTypes';
import {SoundProps} from '@Types/soundProps';
import {VideoProps} from '@Types/videoProps';
import type {DesignSystemStackParamList} from '@Types/designSystemNavigation';

export type DrawerParamList = {
  TabRoot: undefined;
  Profile: undefined;
  AudioStack: undefined;
  VideoStack: undefined;
  PostStack: undefined;
  TodoStack: undefined;
  ChatStack: undefined;
  GameStack: undefined;
  WalletStack: undefined;
  GalleryStack: undefined;
  DesignSystemStack: undefined;
  CameraStack: undefined;
  DeliveryStack: undefined;
  MarketplaceStack: undefined;
  WordPuzzleStack: undefined;
  IslamicStack: undefined;
};

export type RootStackParamList = {
  AuthStack: undefined;
  FirebaseAuthStack: undefined;
  OnBoarding: undefined;
  AuthMethod: undefined;
  LoginOptions: undefined;
  FirebaseLoginMethod: undefined;
  Login: undefined;
  FirebaseEmailLogin: undefined;
  FirebaseEmailRegister: undefined;
  FirebasePhoneLogin: undefined;
  FirebaseSocialLogin: undefined;
  Register: undefined;
  ForgetPassword: undefined;
  ResetPassword: undefined;
  OTP: undefined;
  FirebasePhoneOTP: {
    confirmation: ConfirmationResult;
    loginType: LoginTypes;
  };
  NotFound: undefined;
  Settings: undefined;
  DrawerRoot: NavigatorScreenParams<DrawerParamList> | undefined;
  TabRoot: undefined;
  Home: undefined;
  ServicesHub: undefined;
  Profile: undefined;
  AudioStack: undefined;
  VideoStack: undefined;
  PostStack: undefined;
  TodoStack: undefined;
  ChatStack: undefined;
  GameStack: undefined;
  WalletStack: undefined;
  GalleryStack: undefined;
  DesignSystemStack: undefined;
  CameraStack: undefined;
  DeliveryStack: undefined;
  MarketplaceStack: undefined;
  WordPuzzleStack: undefined;
  IslamicStack: undefined;
  IslamicHub: undefined;
  QuranHub: undefined;
  QuranIndex: undefined;
  QuranList: {mode?: 'mushaf' | 'tafsir'} | undefined;
  QuranReader: {surahNumber: number; ayahNumber?: number};
  /** Ayah-by-ayah study reader with tafsir editions (separate from mushaf pages). */
  QuranTafsirReader: {surahNumber: number; ayahNumber?: number};
  QuranSearch: undefined;
  IslamicUnifiedSearch: undefined;
  AdhkarCategories: undefined;
  /** Hisn chapters for one browse group (Daily, Home, Other, …). */
  AdhkarGroup: {
    groupId: 'daily' | 'home' | 'prayer' | 'travel' | 'protection' | 'other';
    title?: string;
  };
  AdhkarDetail: {categoryId: number; title: string; itemId?: number};
  /**
   * Guided adhkar reader with audio.
   * Require `sessionId` (daily sessions) or `categoryId` (any Hisn category) — not both empty.
   */
  AdhkarReader:
    | {
        sessionId:
          | 'morning'
          | 'evening'
          | 'sleep'
          | 'waking'
          | 'afterPrayer'
          | 'dayNight';
        title?: string;
      }
    | {
        categoryId: number;
        title?: string;
      };
  HadithHub: undefined;
  HadithEditions: {filter: 'all' | 'sahih' | 'weak'; title: string};
  HadithList: {slug: string; title: string; filter?: 'all' | 'sahih' | 'weak'};
  HadithDetail: {hadithId: string; title: string};
  HadithSearch: undefined;
  PrayerTimes: undefined;
  PrayerLocationSetup: undefined;
  Qibla: undefined;
  IslamicSettings: undefined;
  CameraHub: undefined;
  SnapCamera: undefined;
  QrScanner: undefined;
  BarcodeScanner: undefined;
  DeliveryHub: undefined;
  NewDelivery: undefined;
  ActiveOrders: undefined;
  OrderTracking: {orderId: string};
  LiveDeliveryMap: {orderId: string; mode: 'customer' | 'driver'};
  DeliveryHistory: undefined;
  DeliveryDetail: {orderId: string};
  DeliveryDriver: undefined;
  MarketplaceHub: undefined;
  MarketplaceCategories: undefined;
  MarketplaceProducts: {categoryId?: string; searchQuery?: string} | undefined;
  MarketplaceProductDetail: {productId: string};
  MarketplaceCart: undefined;
  MarketplaceCheckout: undefined;
  MarketplaceOrders: undefined;
  MarketplaceOrderDetail: {orderId: string};
  MarketplaceSell: undefined;
  MarketplaceMyListings: undefined;
  MarketplaceSearch: undefined;
  MerchantHub: undefined;
  MerchantProducts: undefined;
  MerchantEditProduct: {productId?: string} | undefined;
  MerchantPromotions: undefined;
  MerchantEditPromotion: {promotionId?: string} | undefined;
  MerchantOrders: undefined;
  MerchantOrderDetail: {orderId: string};
  MerchantStoreSettings: undefined;
  MerchantReviews: undefined;
  PostHub: undefined;
  Feed: undefined;
  PostDetail: {postId: string};
  CreatePost: undefined;
  CreatePoll: undefined;
  SavedPosts: undefined;
  PostSearch: undefined;
  ChatHub: undefined;
  ChatList: undefined;
  ChatRoom: {threadId: string};
  NewChat: undefined;
  ChatInfo: {threadId: string};
  ChatSearch: undefined;
  ChatCallLog: undefined;
  GameHub: undefined;
  LuckySpinner: undefined;
  GameShop: undefined;
  GameLeaderboard: undefined;
  GameHistory: undefined;
  GameAchievements: undefined;
  WordPuzzleHub: undefined;
  WordPuzzleLibrary: {language: 'ar' | 'en'};
  WordPuzzleStageMap: {bookId: string};
  WordPuzzlePlay: {bookId: string; stageId: string};
  WalletHome: undefined;
  WalletTransactions: undefined;
  WalletSend: undefined;
  WalletCards: undefined;
  WalletTopUp: undefined;
  WalletBudget: undefined;
  WalletQRPay: undefined;
  WalletBills: undefined;
  WalletRequest: undefined;
  TransactionDetail: {transactionId: string};
  GalleryHub: undefined;
  GalleryGrid: undefined;
  GalleryAlbums: {albumId?: string} | undefined;
  GalleryFavorites: undefined;
  GallerySearch: undefined;
  GallerySlideshow: {imageId: string};
  GalleryHidden: undefined;
  ImageViewer: {imageId: string};
  TodoHub: undefined;
  TodoList: undefined;
  TodoFocus: undefined;
  Details: undefined;
  PopUp: undefined;
  VideosList: undefined;
  VideoPlayer: {videoDetails: VideoProps};
  RecordVideo: undefined;
  RecordAudio: undefined;
  AudioPlayer: {audioDetails: SoundProps};
  AudiosList: undefined;
} & DesignSystemStackParamList;

// Define a global type for StackNavigationProp
export type AppStackNavigationProp<
  ScreenName extends keyof RootStackParamList,
> = NativeStackNavigationProp<RootStackParamList, ScreenName>;

// Define a global type for RouteProp
export type AppRouteProp<Prop extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  Prop
>;
