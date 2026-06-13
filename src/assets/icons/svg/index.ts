export type {SvgIconProps} from './types';
export {resolveSvgIconProps} from './resolveSvgIconProps';

export {default as HomeIcon} from './HomeIcon';
export {default as SettingsIcon} from './SettingsIcon';
export {default as UserIcon} from './UserIcon';
export {default as ChatIcon} from './ChatIcon';
export {default as WalletIcon} from './WalletIcon';
export {default as FeedIcon} from './FeedIcon';
export {default as TodoIcon} from './TodoIcon';
export {default as GameIcon} from './GameIcon';
export {default as GalleryIcon} from './GalleryIcon';
export {default as AudioIcon} from './AudioIcon';
export {default as VideoIcon} from './VideoIcon';
export {default as SearchIcon} from './SearchIcon';
export {default as BackIcon} from './BackIcon';
export {default as MenuIcon} from './MenuIcon';
export {default as HeartIcon} from './HeartIcon';
export {default as SendIcon} from './SendIcon';
export {default as LogoutIcon} from './LogoutIcon';
export {default as SunIcon} from './SunIcon';
export {default as MoonIcon} from './MoonIcon';

import AudioIcon from './AudioIcon';
import BackIcon from './BackIcon';
import ChatIcon from './ChatIcon';
import FeedIcon from './FeedIcon';
import GalleryIcon from './GalleryIcon';
import GameIcon from './GameIcon';
import HeartIcon from './HeartIcon';
import HomeIcon from './HomeIcon';
import LogoutIcon from './LogoutIcon';
import MenuIcon from './MenuIcon';
import MoonIcon from './MoonIcon';
import SearchIcon from './SearchIcon';
import SendIcon from './SendIcon';
import SettingsIcon from './SettingsIcon';
import SunIcon from './SunIcon';
import TodoIcon from './TodoIcon';
import UserIcon from './UserIcon';
import VideoIcon from './VideoIcon';
import WalletIcon from './WalletIcon';

/** Map of icon names to standalone SVG components. */
export const AppSvgIcons = {
  home: HomeIcon,
  settings: SettingsIcon,
  user: UserIcon,
  chat: ChatIcon,
  wallet: WalletIcon,
  feed: FeedIcon,
  todo: TodoIcon,
  game: GameIcon,
  gallery: GalleryIcon,
  audio: AudioIcon,
  video: VideoIcon,
  search: SearchIcon,
  back: BackIcon,
  menu: MenuIcon,
  heart: HeartIcon,
  send: SendIcon,
  logout: LogoutIcon,
  sun: SunIcon,
  moon: MoonIcon,
} as const;

export type AppSvgIconName = keyof typeof AppSvgIcons;
