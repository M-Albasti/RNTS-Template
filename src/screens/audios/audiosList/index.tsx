//* packages import
import React from 'react';

//* components import
import AudiosListTemplate from '@templates/audios/audiosListTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AudiosListProps {
  navigation: AppStackNavigationProp<'AudiosList'>;
}

const AudiosList = ({navigation}: AudiosListProps): React.JSX.Element => {
  return <AudiosListTemplate navigation={navigation} />;
};

export default AudiosList;
