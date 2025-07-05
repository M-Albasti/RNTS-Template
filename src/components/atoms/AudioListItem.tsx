//* packages import
import React, {memo} from 'react';
import {Avatar, ListItem, ListItemProps} from '@rneui/themed';

interface AudioListItemProps extends ListItemProps {
  title: string;
  artist: string;
  artwork: string;
  onAudioItemPress: (value: object) => void;
}

const AudioListItem = memo((props: AudioListItemProps): React.JSX.Element => {
  return (
    <ListItem
      bottomDivider
      containerStyle={props.containerStyle}
      onPress={props.onAudioItemPress}>
      <Avatar rounded source={{uri: props.artwork}} />
      <ListItem.Content>
        <ListItem.Title>{props.title}</ListItem.Title>
        <ListItem.Subtitle>{props.artist}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
});

export default AudioListItem;
