import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import type {
  DesignSystemRouteName,
  DesignSystemStackParamList,
} from '@Types/designSystemNavigation';

import ShowcaseSection from './ShowcaseSection';

export type ShowcaseSectionConfig = {
  title: string;
  description?: string;
  content: React.ReactNode;
};

export type ShowcaseScreenConfig = {
  title: string;
  subtitle?: string;
  sections: ShowcaseSectionConfig[];
};

export type ShowcaseScreenProps =
  NativeStackScreenProps<DesignSystemStackParamList, DesignSystemRouteName>;

export type ShowcaseScreenComponent = React.ComponentType<ShowcaseScreenProps>;

export const createShowcaseScreen = (
  config: ShowcaseScreenConfig,
): ShowcaseScreenComponent => {
  const ShowcaseScreen = ({navigation}: ShowcaseScreenProps): React.JSX.Element => (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={config.title} navigation={navigation} />
      {config.subtitle ? (
        <>
          <TextView text={config.subtitle} variant="bodySmall" muted />
          <Spacer size="md" />
        </>
      ) : null}
      {config.sections.map(section => (
        <ShowcaseSection
          key={section.title}
          title={section.title}
          description={section.description}>
          {section.content}
        </ShowcaseSection>
      ))}
    </ScreenContainer>
  );

  ShowcaseScreen.displayName = `Showcase(${config.title})`;
  return ShowcaseScreen;
};
