import React, {useMemo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {
  addTodo,
  removeTodo,
  setPriority,
  setTodoFilter,
  toggleTodo,
} from '@redux/slices/todosSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {TodoFilter, TodoItem, TodoPriority} from '@Types/todoTypes';

interface TodoListProps {
  navigation: AppStackNavigationProp<'TodoList'>;
}

const FILTERS: TodoFilter[] = ['all', 'active', 'done', 'high'];
const PRIORITIES: TodoPriority[] = ['low', 'medium', 'high'];

const TodoList = ({navigation}: TodoListProps): React.JSX.Element => {
  const {items, filter} = useAppSelector(state => state.todos);
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      list: {flex: tokens.layout.flex.fill},
      row: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
      meta: {flex: tokens.layout.flex.fill, gap: tokens.spacing.xxs},
      done: {textDecorationLine: 'line-through' as const, opacity: 0.6},
      filters: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.xs},
      high: {color: tokens.colors.error},
      medium: {color: tokens.colors.warning},
    }),
  );

  const filtered = useMemo(() => {
    if (filter === 'active') return items.filter(i => !i.done);
    if (filter === 'done') return items.filter(i => i.done);
    if (filter === 'high') return items.filter(i => i.priority === 'high' && !i.done);
    return items;
  }, [filter, items]);

  const createTodo = () => {
    if (!title.trim()) return;
    dispatch(
      addTodo({
        id: Date.now().toString(),
        title: title.trim(),
        done: false,
        priority: 'medium',
        category: category.trim() || 'Personal',
        dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
      }),
    );
    setTitle('');
  };

  const cyclePriority = (id: string, current: TodoPriority) => {
    const idx = PRIORITIES.indexOf(current);
    dispatch(setPriority({id, priority: PRIORITIES[(idx + 1) % PRIORITIES.length]}));
  };

  const renderItem = ({item}: {item: TodoItem}) => (
    <Card>
      <View style={styles.row}>
        <TouchableIcon
          iconType="Ionicons"
          name={item.done ? 'checkbox' : 'square-outline'}
          size={24}
          onPress={() => dispatch(toggleTodo(item.id))}
        />
        <View style={styles.meta}>
          <TextView text={item.title} variant="body" style={item.done ? styles.done : undefined} />
          <TextView
            text={`${item.category}${item.dueDate ? ` · due ${item.dueDate}` : ''}`}
            variant="caption"
            muted
          />
          <Pressable onPress={() => cyclePriority(item.id, item.priority)}>
            <TextView
              text={`Priority: ${item.priority}`}
              variant="caption"
              style={item.priority === 'high' ? styles.high : item.priority === 'medium' ? styles.medium : undefined}
            />
          </Pressable>
        </View>
        <TouchableIcon
          iconType="Ionicons"
          name="trash-outline"
          size={22}
          onPress={() => dispatch(removeTodo(item.id))}
        />
      </View>
    </Card>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Task list" onBack={() => navigation.goBack()} />
      <View style={styles.filters}>
        {FILTERS.map(f => (
          <Button
            key={f}
            label={f}
            size="sm"
            variant={filter === f ? 'primary' : 'outline'}
            onPress={() => dispatch(setTodoFilter(f))}
          />
        ))}
      </View>
      <Spacer size="md" />
      <TextInputView placeholder="Add a task..." value={title} onChangeText={setTitle} />
      <Spacer size="xs" />
      <TextInputView placeholder="Category" value={category} onChangeText={setCategory} />
      <Spacer size="sm" />
      <Button label="Add task" fullWidth onPress={createTodo} />
      <Spacer size="md" />
      <FlashList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
      />
    </ScreenContainer>
  );
};

export default TodoList;
