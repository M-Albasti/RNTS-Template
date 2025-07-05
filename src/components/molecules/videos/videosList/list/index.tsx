//* packages import
import React, {memo, useCallback} from 'react';
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
  index?: number;
}

const List = memo((props: VideosListProps): React.JSX.Element => {
  const renderItem = useCallback(
    ({item}: RenderItemProps) => {
      return (
        <VideoListItem
          title={item.title}
          subtitle={item.subtitle}
          thumb={item.thumb}
          onVideoItemPress={() => props.onVideoItemPress(item)}
        />
      );
    },
    [props.onVideoItemPress],
  );

  return (
    <FlashList
      data={props.videosData}
      renderItem={renderItem}
      estimatedItemSize={70}
      keyExtractor={(item: VideoProps) => item?.title?.toString()}
      removeClippedSubviews
      showsVerticalScrollIndicator={false}
    />
  );
});

export default List;
