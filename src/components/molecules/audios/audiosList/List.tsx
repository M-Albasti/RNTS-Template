//* packages import
import React from 'react';
import {VirtualizedList} from 'react-native';

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
  const renderItem = ({item, index}: RenderItemProps) => {
    return (
      <AudioListItem
        title={item.title}
        artist={item.artist}
        artwork={item.artwork}
        onAudioItemPress={() => props.onAudioItemPress(item)}
      />
    );
  };

  return (
    <VirtualizedList
      data={props.audiosData}
      renderItem={renderItem}
      keyExtractor={(item, index) => index?.toString()}
      getItemCount={() => props.audiosData?.length}
      getItem={(item, index) => item[index]}
      removeClippedSubviews
      showsVerticalScrollIndicator={false}
    />
  );
};

export default List;
