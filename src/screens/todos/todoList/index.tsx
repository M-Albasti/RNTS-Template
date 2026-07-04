import React, {useMemo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

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
import {resolveTodoListStyles} from './styles/resolveTodoListStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {TodoFilter, TodoItem, TodoPriority} from '@Types/todoTypes';

interface TodoListProps {
  navigation: AppStackNavigationProp<'TodoList'>;
}

const FILTERS: TodoFilter[] = ['all', 'active', 'done', 'high'];
const PRIORITIES: TodoPriority[] = ['low', 'medium', 'high'];

const FILTER_KEYS: Record<TodoFilter, string> = {
  all: 'todos.filterAll',
  active: 'todos.filterActive',
  done: 'todos.filterDone',
  high: 'todos.filterHigh',
};

const TodoList = ({navigation}: TodoListProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {items, filter} = useAppSelector(state => state.todos);
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(t('todos.personal'));
  const styles = useThemedStyles(resolveTodoListStyles);

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
        category: category.trim() || t('todos.personal'),
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
            text={`${item.category}${
              item.dueDate ? ` · ${t('todos.due', {date: item.dueDate})}` : ''
            }`}
            variant="caption"
            muted
          />
          <Pressable onPress={() => cyclePriority(item.id, item.priority)}>
            <TextView
              text={t('todos.priority', {priority: item.priority})}
              variant="caption"
              style={
                item.priority === 'high'
                  ? styles.high
                  : item.priority === 'medium'
                    ? styles.medium
                    : undefined
              }
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
      <ScreenHeader title={t('todos.taskListScreen')} onBack={() => navigation.goBack()} />
      <View style={styles.filters}>
        {FILTERS.map(f => (
          <Button
            key={f}
            label={t(FILTER_KEYS[f])}
            size="sm"
            variant={filter === f ? 'primary' : 'outline'}
            onPress={() => dispatch(setTodoFilter(f))}
          />
        ))}
      </View>
      <Spacer size="md" />
      <TextInputView
        placeholder={t('todos.addTaskPlaceholder')}
        value={title}
        onChangeText={setTitle}
      />
      <Spacer size="xs" />
      <TextInputView
        placeholder={t('todos.category')}
        value={category}
        onChangeText={setCategory}
      />
      <Spacer size="sm" />
      <Button label={t('todos.addTask')} fullWidth onPress={createTodo} />
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
