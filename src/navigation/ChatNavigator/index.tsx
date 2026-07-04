import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ChatHub from '@screens/chat/chatHub';
import ChatList from '@screens/chat/chatList';
import ChatRoom from '@screens/chat/chatRoom';
import NewChat from '@screens/chat/newChat';
import ChatInfo from '@screens/chat/chatInfo';
import ChatSearch from '@screens/chat/chatSearch';
import ChatCallLog from '@screens/chat/chatCallLog';

import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {RootStackParamList} from '@Types/appNavigation';

import {styles} from './styles';

const ChatStack = createNativeStackNavigator<RootStackParamList>();

const ChatNavigator = (): React.JSX.Element => {
  return (
    <ChatStack.Navigator
      initialRouteName="ChatHub"
      layout={({children}) => (
        <ErrorBoundary>
          <Suspense fallback={<TextView text={'Loading...'} style={styles.fallbackText} containerStyle={styles.fallback} />}>
            <View style={styles.container}>{children}</View>
          </Suspense>
        </ErrorBoundary>
      )}
      screenOptions={{headerShown: false}}>
      <ChatStack.Screen name="ChatHub" component={ChatHub} />
      <ChatStack.Screen name="ChatList" component={ChatList} />
      <ChatStack.Screen name="ChatRoom" component={ChatRoom} />
      <ChatStack.Screen name="NewChat" component={NewChat} />
      <ChatStack.Screen name="ChatInfo" component={ChatInfo} />
      <ChatStack.Screen name="ChatSearch" component={ChatSearch} />
      <ChatStack.Screen name="ChatCallLog" component={ChatCallLog} />
    </ChatStack.Navigator>
  );
};

export default ChatNavigator;
