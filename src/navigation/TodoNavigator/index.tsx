import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import TodoHub from '@screens/todos/todoHub';
import TodoList from '@screens/todos/todoList';
import TodoFocus from '@screens/todos/todoFocus';

import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {RootStackParamList} from '@Types/appNavigation';

import {styles} from './styles';

const TodoStack = createNativeStackNavigator<RootStackParamList>();

const TodoNavigator = (): React.JSX.Element => {
  return (
    <TodoStack.Navigator
      initialRouteName="TodoHub"
      layout={({children}) => (
        <ErrorBoundary>
          <Suspense fallback={<TextView text={'Loading...'} style={styles.fallbackText} containerStyle={styles.fallback} />}>
            <View style={styles.container}>{children}</View>
          </Suspense>
        </ErrorBoundary>
      )}
      screenOptions={{headerShown: false}}>
      <TodoStack.Screen name="TodoHub" component={TodoHub} />
      <TodoStack.Screen name="TodoList" component={TodoList} />
      <TodoStack.Screen name="TodoFocus" component={TodoFocus} />
    </TodoStack.Navigator>
  );
};

export default TodoNavigator;
