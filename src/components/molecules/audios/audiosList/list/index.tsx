//* packages import
import React, {useCallback} from 'react';
import {FlashList} from '@shopify/flash-list';

//* components import
import AudioListItem from '@atoms/AudioListItem';

//* constants import
import {SoundProps} from '@constants/sounds';

interface AudiosListProps {
  audiosData: SoundProps[];
  onAudioItemPress: (value: SoundProps) => void;
}

interface RenderItemProps {
  item: SoundProps;
  index: number;
}

const List = (props: AudiosListProps): React.JSX.Element => {
  const renderItem = useCallback(({item, index}: RenderItemProps) => {
    return (
      <AudioListItem
        title={item.title}
        artist={item.artist}
        artwork={item.artwork}
        onAudioItemPress={() => props.onAudioItemPress(item)}
      />
    );
  }, []);

  return (
    <FlashList
      data={props.audiosData}
      renderItem={renderItem}
      estimatedItemSize={70}
      keyExtractor={item => item?.id?.toString()}
      removeClippedSubviews
      showsVerticalScrollIndicator={false}
    />
  );
};

export default List;
