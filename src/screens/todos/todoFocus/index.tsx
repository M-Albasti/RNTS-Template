import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {setFocusMinutes} from '@redux/slices/todosSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface TodoFocusProps {
  navigation: AppStackNavigationProp<'TodoFocus'>;
}

const TodoFocus = ({navigation}: TodoFocusProps): React.JSX.Element => {
  const focusMinutes = useAppSelector(state => state.todos.focusMinutes);
  const openTasks = useAppSelector(state => state.todos.items.filter(i => !i.done).length);
  const dispatch = useAppDispatch();
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [running, setRunning] = useState(false);
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      timer: {...tokens.layout.presets.center, padding: tokens.spacing.xxl},
      time: {...tokens.typography.h1, ...tokens.layout.presets.textCenter},
      actions: {gap: tokens.spacing.sm},
    }),
  );

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const reset = () => {
    setRunning(false);
    setSecondsLeft(focusMinutes * 60);
  };

  return (
    <ScreenContainer scroll centered alignContent="center">
      <ScreenHeader title="Focus mode" onBack={() => navigation.goBack()} />
      <Card constrained>
        <TextView text={`${openTasks} tasks waiting`} align="center" muted />
        <Spacer size="lg" />
        <View style={styles.timer}>
          <TextView
            text={`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`}
            style={styles.time}
          />
        </View>
        <Spacer size="md" />
        <View style={styles.actions}>
          <Button label={running ? 'Pause' : 'Start focus'} fullWidth onPress={() => setRunning(!running)} />
          <Button label="Reset" variant="outline" fullWidth onPress={reset} />
          <Button label="25 min" variant="ghost" onPress={() => { dispatch(setFocusMinutes(25)); setSecondsLeft(25 * 60); }} />
          <Button label="15 min" variant="ghost" onPress={() => { dispatch(setFocusMinutes(15)); setSecondsLeft(15 * 60); }} />
        </View>
      </Card>
    </ScreenContainer>
  );
};

export default TodoFocus;
