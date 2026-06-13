import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface TodoHubProps {
  navigation: AppStackNavigationProp<'TodoHub'>;
}

const TodoHub = ({navigation}: TodoHubProps): React.JSX.Element => {
  const {t} = useTranslation();
  const items = useAppSelector(state => state.todos.items);
  const open = items.filter(i => !i.done).length;
  const high = items.filter(i => !i.done && i.priority === 'high').length;
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      hero: {
        ...tokens.layout.presets.columnCenter,
        backgroundColor: tokens.colors.primaryMuted,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
      },
      grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
      stats: {...tokens.layout.presets.rowBetween, width: '100%'},
    }),
  );

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('todos.title')} showBack={false} />
      <View style={styles.hero}>
        <Heading text={t('todos.stayOrganized')} level="h2" align="center" />
        <Spacer size="xs" />
        <View style={styles.stats}>
          <TextView text={t('home.openTasks', {count: open})} variant="bodySmall" />
          <TextView text={`${high} high priority`} variant="bodySmall" />
        </View>
      </View>
      <Spacer size="lg" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('todos.taskList')}
          subtitle={t('todos.taskListSubtitle')}
          iconType="Ionicons"
          iconName="list-outline"
          onPress={() => navigation.navigate('TodoList')}
        />
        <FeatureHubCard
          title={t('todos.focusTimer')}
          subtitle={t('todos.focusSubtitle')}
          iconType="Ionicons"
          iconName="timer-outline"
          onPress={() => navigation.navigate('TodoFocus')}
        />
      </View>
    </ScreenContainer>
  );
};

export default TodoHub;
