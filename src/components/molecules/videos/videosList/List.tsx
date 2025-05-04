//* packages import
import React, {useCallback} from 'react';
import {FlashList} from '@shopify/flash-list';

//* components import
import VideoListItem from '@atoms/VideoListItem';

//* types import
import {VideoProps} from '@Types/videoProps';

interface VideosListProps {
  videosData: VideoProps[];
  onVideoItemPress: (value: VideoProps) => void;
}

interface RenderItemProps {
  item: VideoProps;
  index: number;
}

const List = (props: VideosListProps): React.JSX.Element => {
  const renderItem = useCallback(({item, index}: RenderItemProps) => {
    return (
      <VideoListItem
        title={item.title}
        subtitle={item.subtitle}
        thumb={item.thumb}
        onVideoItemPress={() => props.onVideoItemPress(item)}
      />
    );
  }, []);

  return (
    <FlashList
      data={props.videosData}
      renderItem={renderItem}
      estimatedItemSize={70}
      keyExtractor={(item, index) => index?.toString()}
      removeClippedSubviews
      showsVerticalScrollIndicator={false}
    />
  );
};

export default List;
