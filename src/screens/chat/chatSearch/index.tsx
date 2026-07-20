import React, {useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {setChatSearchQuery} from '@redux/slices/chatSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveChatSearchStyles} from './styles/resolveChatSearchStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface ChatSearchProps {
  navigation: AppStackNavigationProp<'ChatSearch'>;
}

const ChatSearch = ({navigation}: ChatSearchProps): React.JSX.Element => {
  const {t} = useTranslation();
  const query = useAppSelector(state => state.chat.searchQuery);
  const threads = useAppSelector(state => state.chat.threads);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(resolveChatSearchStyles);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return threads.flatMap(thread =>
      thread.messages
        .filter(m => m.text.toLowerCase().includes(q))
        .map(m => ({threadName: thread.name, threadId: thread.id, message: m})),
    );
  }, [query, threads]);

  return (
    <ScreenContainer>
      <ScreenHeader title={t('chat.searchMessages')} navigation={navigation} />
      <TextInputView
        placeholder={t('chat.searchInConversations')}
        value={query}
        onChangeText={text => dispatch(setChatSearchQuery(text))}
      />
      <Spacer size="md" />
      {results.length === 0 ? (
        <View style={styles.empty}>
          <TextView text={t('chat.typeToSearch')} muted align="center" />
        </View>
      ) : (
        <FlashList
          data={results}
          style={styles.list}
          keyExtractor={item => item.message.id}
          ItemSeparatorComponent={() => <Spacer size="sm" />}
          renderItem={({item}) => (
            <Pressable onPress={() => navigation.navigate('ChatRoom', {threadId: item.threadId})}>
              <Card>
                <View style={styles.hit}>
                  <TextView text={item.threadName} variant="bodySmall" muted />
                  <TextView text={item.message.text} variant="body" />
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default ChatSearch;
