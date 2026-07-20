import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveTodoHubStyles} from './styles/resolveTodoHubStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface TodoHubProps {
  navigation: AppStackNavigationProp<'TodoHub'>;
}

const TodoHub = ({navigation}: TodoHubProps): React.JSX.Element => {
  const {t} = useTranslation();
  const items = useAppSelector(state => state.todos.items);
  const open = items.filter(i => !i.done).length;
  const high = items.filter(i => !i.done && i.priority === 'high').length;
  const styles = useThemedStyles(resolveTodoHubStyles);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('todos.title')}
        showBack={false}
        showDrawer
        navigation={navigation}
        rightActions={[
          {
            key: 'list',
            iconName: 'list-outline',
            onPress: () => navigation.navigate('TodoList'),
            accessibilityLabel: t('todos.list', {defaultValue: 'Todo list'}),
          },
          {
            key: 'focus',
            iconName: 'timer-outline',
            onPress: () => navigation.navigate('TodoFocus'),
            accessibilityLabel: t('todos.focusMode'),
          },
        ]}
      />
      <View style={styles.hero}>
        <Heading text={t('todos.stayOrganized')} level="h2" />
        <View style={styles.stats}>
          <View style={styles.statChip}>
            <TextView text={`${open}`} variant="h3" align="center" />
            <TextView text={t('home.todos')} variant="caption" muted align="center" />
          </View>
          <View style={styles.statChip}>
            <TextView text={`${high}`} variant="h3" align="center" />
            <TextView text={t('todos.highPriority')} variant="caption" muted align="center" />
          </View>
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
