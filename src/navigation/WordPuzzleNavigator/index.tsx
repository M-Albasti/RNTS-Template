import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import WordPuzzleHub from '@screens/wordPuzzle/wordPuzzleHub';
import WordPuzzleLibrary from '@screens/wordPuzzle/wordPuzzleLibrary';
import WordPuzzleStageMap from '@screens/wordPuzzle/wordPuzzleStageMap';
import WordPuzzlePlay from '@screens/wordPuzzle/wordPuzzlePlay';

import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {RootStackParamList} from '@Types/appNavigation';

import {styles} from './styles';

const WordPuzzleStack = createNativeStackNavigator<RootStackParamList>();

const WordPuzzleNavigator = (): React.JSX.Element => (
  <WordPuzzleStack.Navigator
    initialRouteName="WordPuzzleHub"
    layout={({children}) => (
      <ErrorBoundary>
        <Suspense
          fallback={
            <TextView text="Loading..." style={styles.fallbackText} containerStyle={styles.fallback} />
          }>
          <View style={styles.container}>{children}</View>
        </Suspense>
      </ErrorBoundary>
    )}
    screenOptions={{headerShown: false}}>
    <WordPuzzleStack.Screen name="WordPuzzleHub" component={WordPuzzleHub} />
    <WordPuzzleStack.Screen name="WordPuzzleLibrary" component={WordPuzzleLibrary} />
    <WordPuzzleStack.Screen name="WordPuzzleStageMap" component={WordPuzzleStageMap} />
    <WordPuzzleStack.Screen name="WordPuzzlePlay" component={WordPuzzlePlay} />
  </WordPuzzleStack.Navigator>
);

export default WordPuzzleNavigator;
