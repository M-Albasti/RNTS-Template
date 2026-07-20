import React, {useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';

import {setSearchQuery} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MarketplaceSearch'>};

const MarketplaceSearch = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');

  const search = () => {
    dispatch(setSearchQuery(query));
    navigation.navigate('MarketplaceProducts', {searchQuery: query.trim()});
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('marketplace.search')} navigation={navigation} />
      <TextInputView
        label={t('marketplace.searchLabel')}
        value={query}
        onChangeText={setQuery}
        placeholder={t('marketplace.searchPlaceholder')}
        autoFocus
      />
      <Spacer size="lg" />
      <Button label={t('common.search')} fullWidth onPress={search} />
    </ScreenContainer>
  );
};

export default MarketplaceSearch;
