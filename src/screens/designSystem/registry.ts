import React from 'react';

import type {DesignSystemRouteName} from '@Types/designSystemNavigation';

import DSAppSvgIcon from './atoms/DSAppSvgIcon';
import DSAudioListItem from './atoms/DSAudioListItem';
import DSRating from './atoms/DSRating';
import DSButton from './atoms/DSButton';
import DSCard from './atoms/DSCard';
import DSErrorFallback from './atoms/DSErrorFallback';
import DSFeatureHubCard from './atoms/DSFeatureHubCard';
import DSIcon from './atoms/DSIcon';
import DSLayoutPrimitives from './atoms/DSLayoutPrimitives';
import DSModalLayout from './atoms/DSModalLayout';
import DSOTPInput from './atoms/DSOTPInput';
import DSScreenHeader from './atoms/DSScreenHeader';
import DSTextInputView from './atoms/DSTextInputView';
import DSTouchableIcon from './atoms/DSTouchableIcon';
import DSTouchableText from './atoms/DSTouchableText';
import DSTouchableTextIcon from './atoms/DSTouchableTextIcon';
import DSTypography from './atoms/DSTypography';
import DSVideoListItem from './atoms/DSVideoListItem';
import DSVideoView from './atoms/DSVideoView';

import DSAudioPlayback from './molecules/DSAudioPlayback';
import DSAudioPlayerContent from './molecules/DSAudioPlayerContent';
import DSAudioPlayerControllers from './molecules/DSAudioPlayerControllers';
import DSAudioPlayerHeader from './molecules/DSAudioPlayerHeader';
import DSAudioProgressBar from './molecules/DSAudioProgressBar';
import DSAudioRecording from './molecules/DSAudioRecording';
import DSAudioSubmit from './molecules/DSAudioSubmit';
import DSAudiosListButtons from './molecules/DSAudiosListButtons';
import DSAudiosListList from './molecules/DSAudiosListList';
import DSEmailOrPhoneTextInput from './molecules/DSEmailOrPhoneTextInput';
import DSLoginButton from './molecules/DSLoginButton';
import DSLoginRegisterButton from './molecules/DSLoginRegisterButton';
import DSOtpResendButton from './molecules/DSOtpResendButton';
import DSOtpResendText from './molecules/DSOtpResendText';
import DSOtpSendButton from './molecules/DSOtpSendButton';
import DSOtpText from './molecules/DSOtpText';
import DSOtpTextInput from './molecules/DSOtpTextInput';
import DSPasswordTextInput from './molecules/DSPasswordTextInput';
import DSPostCard from './molecules/DSPostCard';
import DSRegisterButton from './molecules/DSRegisterButton';
import DSRegisterLoginButton from './molecules/DSRegisterLoginButton';
import DSVideoCameraView from './molecules/DSVideoCameraView';
import DSVideoContainer from './molecules/DSVideoContainer';
import DSVideoPlayerButtons from './molecules/DSVideoPlayerButtons';
import DSVideosListButtons from './molecules/DSVideosListButtons';
import DSVideosListList from './molecules/DSVideosListList';

import DSAudioPlayerView from './organisms/DSAudioPlayerView';
import DSAudiosListWithButtons from './organisms/DSAudiosListWithButtons';
import DSAuthMethodsButtons from './organisms/DSAuthMethodsButtons';
import DSFirebaseLoginMethodsButtons from './organisms/DSFirebaseLoginMethodsButtons';
import DSLoginFooter from './organisms/DSLoginFooter';
import DSLoginForm from './organisms/DSLoginForm';
import DSLoginHeader from './organisms/DSLoginHeader';
import DSOTPFooter from './organisms/DSOTPFooter';
import DSOTPForm from './organisms/DSOTPForm';
import DSOTPHeader from './organisms/DSOTPHeader';
import DSRecordAudioView from './organisms/DSRecordAudioView';
import DSRegisterFooter from './organisms/DSRegisterFooter';
import DSRegisterForm from './organisms/DSRegisterForm';
import DSRegisterHeader from './organisms/DSRegisterHeader';
import DSVideoCameraModal from './organisms/DSVideoCameraModal';
import DSVideoPlayerView from './organisms/DSVideoPlayerView';
import DSVideoWithButtons from './organisms/DSVideoWithButtons';
import DSVideosListWithButtons from './organisms/DSVideosListWithButtons';

import DSAudioPlayerTemplate from './templates/DSAudioPlayerTemplate';
import DSAudiosListTemplate from './templates/DSAudiosListTemplate';
import DSAuthMethodTemplate from './templates/DSAuthMethodTemplate';
import DSFirebaseLoginMethodTemplate from './templates/DSFirebaseLoginMethodTemplate';
import DSForgetPasswordTemplate from './templates/DSForgetPasswordTemplate';
import DSLoginOptionsTemplate from './templates/DSLoginOptionsTemplate';
import DSLoginTemplate from './templates/DSLoginTemplate';
import DSMockOtpTemplate from './templates/DSMockOtpTemplate';
import DSOTPTemplate from './templates/DSOTPTemplate';
import DSRecordAudioTemplate from './templates/DSRecordAudioTemplate';
import DSRecordVideoTemplate from './templates/DSRecordVideoTemplate';
import DSRegisterTemplate from './templates/DSRegisterTemplate';
import DSResetPasswordTemplate from './templates/DSResetPasswordTemplate';
import DSVideoPlayerTemplate from './templates/DSVideoPlayerTemplate';
import DSVideosListTemplate from './templates/DSVideosListTemplate';

import DSTheme from './theme/ThemeShowcase';

import type {ShowcaseScreenComponent} from './shared/createShowcaseScreen';

export type DesignSystemRegistryItem = {
  route: DesignSystemRouteName;
  title: string;
  category: 'theme' | 'atoms' | 'molecules' | 'organisms' | 'templates';
  component: ShowcaseScreenComponent;
};

const designSystemRegistryUnsorted: DesignSystemRegistryItem[] = [
  {route: 'DSTheme', title: 'Theme', category: 'theme', component: DSTheme},

  {route: 'DSAppSvgIcon', title: 'App SVG Icon', category: 'atoms', component: DSAppSvgIcon},
  {route: 'DSAudioListItem', title: 'Audio List Item', category: 'atoms', component: DSAudioListItem},
  {route: 'DSButton', title: 'Button', category: 'atoms', component: DSButton},
  {route: 'DSCard', title: 'Card', category: 'atoms', component: DSCard},
  {route: 'DSErrorFallback', title: 'Error Fallback', category: 'atoms', component: DSErrorFallback},
  {route: 'DSFeatureHubCard', title: 'Feature Hub Card', category: 'atoms', component: DSFeatureHubCard},
  {route: 'DSIcon', title: 'Icon', category: 'atoms', component: DSIcon},
  {route: 'DSLayoutPrimitives', title: 'Layout Primitives', category: 'atoms', component: DSLayoutPrimitives},
  {route: 'DSModalLayout', title: 'Modal Layout', category: 'atoms', component: DSModalLayout},
  {route: 'DSOTPInput', title: 'OTP Input', category: 'atoms', component: DSOTPInput},
  {route: 'DSRating', title: 'Rating', category: 'atoms', component: DSRating},
  {route: 'DSScreenHeader', title: 'Screen Header', category: 'atoms', component: DSScreenHeader},
  {route: 'DSTextInputView', title: 'Text Input View', category: 'atoms', component: DSTextInputView},
  {route: 'DSTouchableIcon', title: 'Touchable Icon', category: 'atoms', component: DSTouchableIcon},
  {route: 'DSTouchableText', title: 'Touchable Text', category: 'atoms', component: DSTouchableText},
  {route: 'DSTouchableTextIcon', title: 'Touchable Text Icon', category: 'atoms', component: DSTouchableTextIcon},
  {route: 'DSTypography', title: 'Typography', category: 'atoms', component: DSTypography},
  {route: 'DSVideoListItem', title: 'Video List Item', category: 'atoms', component: DSVideoListItem},
  {route: 'DSVideoView', title: 'Video View', category: 'atoms', component: DSVideoView},

  {route: 'DSAudioPlayback', title: 'Audio Playback', category: 'molecules', component: DSAudioPlayback},
  {route: 'DSAudioPlayerContent', title: 'Audio Player Content', category: 'molecules', component: DSAudioPlayerContent},
  {route: 'DSAudioPlayerControllers', title: 'Audio Player Controllers', category: 'molecules', component: DSAudioPlayerControllers},
  {route: 'DSAudioPlayerHeader', title: 'Audio Player Header', category: 'molecules', component: DSAudioPlayerHeader},
  {route: 'DSAudioProgressBar', title: 'Audio Progress Bar', category: 'molecules', component: DSAudioProgressBar},
  {route: 'DSAudioRecording', title: 'Audio Recording', category: 'molecules', component: DSAudioRecording},
  {route: 'DSAudioSubmit', title: 'Audio Submit', category: 'molecules', component: DSAudioSubmit},
  {route: 'DSAudiosListButtons', title: 'Audios List Buttons', category: 'molecules', component: DSAudiosListButtons},
  {route: 'DSAudiosListList', title: 'Audios List', category: 'molecules', component: DSAudiosListList},
  {route: 'DSEmailOrPhoneTextInput', title: 'Email Or Phone Input', category: 'molecules', component: DSEmailOrPhoneTextInput},
  {route: 'DSLoginButton', title: 'Login Button', category: 'molecules', component: DSLoginButton},
  {route: 'DSLoginRegisterButton', title: 'Login Register Button', category: 'molecules', component: DSLoginRegisterButton},
  {route: 'DSOtpResendButton', title: 'OTP Resend Button', category: 'molecules', component: DSOtpResendButton},
  {route: 'DSOtpResendText', title: 'OTP Resend Text', category: 'molecules', component: DSOtpResendText},
  {route: 'DSOtpSendButton', title: 'OTP Send Button', category: 'molecules', component: DSOtpSendButton},
  {route: 'DSOtpText', title: 'OTP Text', category: 'molecules', component: DSOtpText},
  {route: 'DSOtpTextInput', title: 'OTP Text Input', category: 'molecules', component: DSOtpTextInput},
  {route: 'DSPasswordTextInput', title: 'Password Input', category: 'molecules', component: DSPasswordTextInput},
  {route: 'DSPostCard', title: 'Post Card', category: 'molecules', component: DSPostCard},
  {route: 'DSRegisterButton', title: 'Register Button', category: 'molecules', component: DSRegisterButton},
  {route: 'DSRegisterLoginButton', title: 'Register Login Button', category: 'molecules', component: DSRegisterLoginButton},
  {route: 'DSVideoCameraView', title: 'Video Camera View', category: 'molecules', component: DSVideoCameraView},
  {route: 'DSVideoContainer', title: 'Video Container', category: 'molecules', component: DSVideoContainer},
  {route: 'DSVideoPlayerButtons', title: 'Video Player Buttons', category: 'molecules', component: DSVideoPlayerButtons},
  {route: 'DSVideosListButtons', title: 'Videos List Buttons', category: 'molecules', component: DSVideosListButtons},
  {route: 'DSVideosListList', title: 'Videos List', category: 'molecules', component: DSVideosListList},

  {route: 'DSAudioPlayerView', title: 'Audio Player View', category: 'organisms', component: DSAudioPlayerView},
  {route: 'DSAudiosListWithButtons', title: 'Audios List With Buttons', category: 'organisms', component: DSAudiosListWithButtons},
  {route: 'DSAuthMethodsButtons', title: 'Auth Methods Buttons', category: 'organisms', component: DSAuthMethodsButtons},
  {route: 'DSFirebaseLoginMethodsButtons', title: 'Firebase Login Methods', category: 'organisms', component: DSFirebaseLoginMethodsButtons},
  {route: 'DSLoginFooter', title: 'Login Footer', category: 'organisms', component: DSLoginFooter},
  {route: 'DSLoginForm', title: 'Login Form', category: 'organisms', component: DSLoginForm},
  {route: 'DSLoginHeader', title: 'Login Header', category: 'organisms', component: DSLoginHeader},
  {route: 'DSOTPFooter', title: 'OTP Footer', category: 'organisms', component: DSOTPFooter},
  {route: 'DSOTPForm', title: 'OTP Form', category: 'organisms', component: DSOTPForm},
  {route: 'DSOTPHeader', title: 'OTP Header', category: 'organisms', component: DSOTPHeader},
  {route: 'DSRecordAudioView', title: 'Record Audio View', category: 'organisms', component: DSRecordAudioView},
  {route: 'DSRegisterFooter', title: 'Register Footer', category: 'organisms', component: DSRegisterFooter},
  {route: 'DSRegisterForm', title: 'Register Form', category: 'organisms', component: DSRegisterForm},
  {route: 'DSRegisterHeader', title: 'Register Header', category: 'organisms', component: DSRegisterHeader},
  {route: 'DSVideoCameraModal', title: 'Video Camera Modal', category: 'organisms', component: DSVideoCameraModal},
  {route: 'DSVideoPlayerView', title: 'Video Player View', category: 'organisms', component: DSVideoPlayerView},
  {route: 'DSVideoWithButtons', title: 'Video With Buttons', category: 'organisms', component: DSVideoWithButtons},
  {route: 'DSVideosListWithButtons', title: 'Videos List With Buttons', category: 'organisms', component: DSVideosListWithButtons},

  {route: 'DSAudioPlayerTemplate', title: 'Audio Player Template', category: 'templates', component: DSAudioPlayerTemplate},
  {route: 'DSAudiosListTemplate', title: 'Audios List Template', category: 'templates', component: DSAudiosListTemplate},
  {route: 'DSAuthMethodTemplate', title: 'Auth Method Template', category: 'templates', component: DSAuthMethodTemplate},
  {route: 'DSFirebaseLoginMethodTemplate', title: 'Firebase Login Template', category: 'templates', component: DSFirebaseLoginMethodTemplate},
  {route: 'DSForgetPasswordTemplate', title: 'Forget Password Template', category: 'templates', component: DSForgetPasswordTemplate},
  {route: 'DSLoginOptionsTemplate', title: 'Login Options Template', category: 'templates', component: DSLoginOptionsTemplate},
  {route: 'DSLoginTemplate', title: 'Login Template', category: 'templates', component: DSLoginTemplate},
  {route: 'DSMockOtpTemplate', title: 'Mock OTP Template', category: 'templates', component: DSMockOtpTemplate},
  {route: 'DSOTPTemplate', title: 'OTP Template', category: 'templates', component: DSOTPTemplate},
  {route: 'DSRecordAudioTemplate', title: 'Record Audio Template', category: 'templates', component: DSRecordAudioTemplate},
  {route: 'DSRecordVideoTemplate', title: 'Record Video Template', category: 'templates', component: DSRecordVideoTemplate},
  {route: 'DSRegisterTemplate', title: 'Register Template', category: 'templates', component: DSRegisterTemplate},
  {route: 'DSResetPasswordTemplate', title: 'Reset Password Template', category: 'templates', component: DSResetPasswordTemplate},
  {route: 'DSVideoPlayerTemplate', title: 'Video Player Template', category: 'templates', component: DSVideoPlayerTemplate},
  {route: 'DSVideosListTemplate', title: 'Videos List Template', category: 'templates', component: DSVideosListTemplate},
];

const categoryOrder: DesignSystemRegistryItem['category'][] = [
  'theme',
  'atoms',
  'molecules',
  'organisms',
  'templates',
];

export const designSystemRegistry: DesignSystemRegistryItem[] = [
  ...categoryOrder.flatMap(category =>
    designSystemRegistryUnsorted
      .filter(item => item.category === category)
      .sort((a, b) => a.title.localeCompare(b.title)),
  ),
];

export const designSystemRoutes = Object.fromEntries(
  designSystemRegistry.map(item => [item.route, item.component]),
) as Record<DesignSystemRouteName, ShowcaseScreenComponent>;
