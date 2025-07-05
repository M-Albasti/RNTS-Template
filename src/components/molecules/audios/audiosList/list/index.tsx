//* packages import
import React, {memo, useCallback} from 'react';
import {FlashList} from '@shopify/flash-list';

//* components import
import AudioListItem from '@atoms/AudioListItem';

//* types import
import {SoundProps} from '@Types/soundProps';

interface AudiosListProps {
  audiosData: SoundProps[];
  onAudioItemPress: (value: SoundProps) => void;
}

interface RenderItemProps {
  item: SoundProps;
  index?: number;
}

const List = memo((props: AudiosListProps): React.JSX.Element => {
  const renderItem = useCallback(
    ({item}: RenderItemProps) => {
      return (
        <AudioListItem
          title={item.title}
          artist={item.artist}
          artwork={item.artwork}
          onAudioItemPress={() => props.onAudioItemPress(item)}
        />
      );
    },
    [props.onAudioItemPress],
  );

  return (
    <FlashList
      data={props.audiosData}
      renderItem={renderItem}
      estimatedItemSize={70}
      keyExtractor={(item: SoundProps) => item?.id?.toString()}
      removeClippedSubviews
      showsVerticalScrollIndicator={false}
    />
  );
});

export default List;
