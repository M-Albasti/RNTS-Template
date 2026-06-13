import {NavigatorScreenParams, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {FirebaseAuthTypes} from '@react-native-firebase/auth';
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
    confirmation: FirebaseAuthTypes.ConfirmationResult;
    loginType: LoginTypes;
  };
  NotFound: undefined;
  Settings: undefined;
  DrawerRoot: NavigatorScreenParams<DrawerParamList> | undefined;
  TabRoot: undefined;
  Home: undefined;
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
