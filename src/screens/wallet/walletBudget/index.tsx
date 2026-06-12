import React from 'react';
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
import {contributeToGoal} from '@redux/slices/walletSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface WalletBudgetProps {
  navigation: AppStackNavigationProp<'WalletBudget'>;
}

const WalletBudget = ({navigation}: WalletBudgetProps): React.JSX.Element => {
  const {budgetCategories, savingsGoals, balance} = useAppSelector(state => state.wallet);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      row: {...tokens.layout.presets.rowBetween},
      bar: {
        height: 8,
        backgroundColor: tokens.colors.surfaceSecondary,
        borderRadius: tokens.radius.full,
        overflow: tokens.layout.overflow.hidden,
        marginTop: tokens.spacing.xs,
      },
      fill: {height: '100%', backgroundColor: tokens.colors.primary},
      over: {backgroundColor: tokens.colors.error},
    }),
  );

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title="Budget & goals" onBack={() => navigation.goBack()} />
      <Heading text="Monthly budgets" level="h3" />
      <Spacer size="sm" />
      {budgetCategories.map(cat => {
        const pct = Math.min(100, (cat.spent / cat.limit) * 100);
        const over = cat.spent > cat.limit;
        return (
          <View key={cat.id}>
            <Card>
              <View style={styles.row}>
                <Heading text={cat.name} level="h3" />
                <TextView text={`$${cat.spent} / $${cat.limit}`} variant="bodySmall" />
              </View>
              <View style={styles.bar}>
                <View style={[styles.fill, over && styles.over, {width: `${pct}%` as `${number}%`}]} />
              </View>
            </Card>
            <Spacer size="sm" />
          </View>
        );
      })}
      <Spacer size="lg" />
      <Heading text="Savings goals" level="h3" />
      <Spacer size="sm" />
      {savingsGoals.map(goal => (
        <View key={goal.id}>
          <Card>
            <View style={styles.row}>
              <Heading text={goal.title} level="h3" />
              <TextView text={`$${goal.saved} / $${goal.target}`} variant="bodySmall" />
            </View>
            <Spacer size="sm" />
            <Button
              label="Add $50"
              size="sm"
              disabled={balance < 50}
              onPress={() => dispatch(contributeToGoal({goalId: goal.id, amount: 50}))}
            />
          </Card>
          <Spacer size="sm" />
        </View>
      ))}
    </ScreenContainer>
  );
};

export default WalletBudget;
