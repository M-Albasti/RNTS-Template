import React from 'react';
import {VirtualizedList} from 'react-native';
import {VideoProps} from '@constants/videos';
import VideoListItem from '@atoms/VideoListItem';

interface VideosListProps {
  videosData: VideoProps[];
  onVideoItemPress: (value: VideoProps) => void;
}

interface RenderItemProps {
  item: VideoProps;
  index: number;
}

const List = (props: VideosListProps): React.JSX.Element => {
  const renderItem = ({item, index}: RenderItemProps) => {
    return (
      <VideoListItem
        title={item.title}
        subtitle={item.subtitle}
        thumb={item.thumb}
        onVideoItemPress={() => props.onVideoItemPress(item)}
      />
    );
  };

  return (
    <VirtualizedList
      data={props.videosData}
      renderItem={renderItem}
      keyExtractor={(item, index) => index?.toString()}
      getItemCount={() => props.videosData?.length}
      getItem={(item, index) => item[index]}
      removeClippedSubviews
      showsVerticalScrollIndicator={false}
    />
  );
};

export default List;
