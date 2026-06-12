import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import PostHub from '@screens/posts/postHub';
import Feed from '@screens/posts/feed';
import PostDetail from '@screens/posts/postDetail';
import CreatePost from '@screens/posts/createPost';
import CreatePoll from '@screens/posts/createPoll';
import SavedPosts from '@screens/posts/savedPosts';
import PostSearch from '@screens/posts/postSearch';

import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {RootStackParamList} from '@Types/appNavigation';

import {styles} from './styles';

const PostStack = createNativeStackNavigator<RootStackParamList>();

const PostNavigator = (): React.JSX.Element => {
  return (
    <PostStack.Navigator
      initialRouteName="PostHub"
      layout={({children}) => (
        <ErrorBoundary>
          <Suspense fallback={<TextView text={'Loading...'} style={styles.fallbackText} containerStyle={styles.fallback} />}>
            <View style={styles.container}>{children}</View>
          </Suspense>
        </ErrorBoundary>
      )}
      screenOptions={{headerShown: false}}>
      <PostStack.Screen name="PostHub" component={PostHub} />
      <PostStack.Screen name="Feed" component={Feed} />
      <PostStack.Screen name="PostDetail" component={PostDetail} />
      <PostStack.Screen name="CreatePost" component={CreatePost} />
      <PostStack.Screen name="CreatePoll" component={CreatePoll} />
      <PostStack.Screen name="SavedPosts" component={SavedPosts} />
      <PostStack.Screen name="PostSearch" component={PostSearch} />
    </PostStack.Navigator>
  );
};

export default PostNavigator;
