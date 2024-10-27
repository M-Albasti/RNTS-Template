import React from 'react';
import {StyleSheet, VirtualizedList} from 'react-native';
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

const VideosList = (props: VideosListProps) => {
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

export default VideosList;

const styles = StyleSheet.create({});
