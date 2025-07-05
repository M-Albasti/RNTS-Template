//* packages import
import React, {memo} from 'react';
import {Avatar, ListItem, ListItemProps} from '@rneui/themed';

interface VideoListItemProps extends ListItemProps {
  title: string;
  subtitle: string;
  thumb: string;
  onVideoItemPress: (value: object) => void;
}

const VideoListItem = memo((props: VideoListItemProps): React.JSX.Element => {
  return (
    <ListItem
      bottomDivider
      containerStyle={props.containerStyle}
      onPress={props.onVideoItemPress}>
      <Avatar rounded source={{uri: props.thumb}} />
      <ListItem.Content>
        <ListItem.Title>{props.title}</ListItem.Title>
        <ListItem.Subtitle>{props.subtitle}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
});

export default VideoListItem;
