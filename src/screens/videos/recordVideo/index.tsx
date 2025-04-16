//* pakages import
import React, {useState} from 'react';
import {View} from 'react-native';
import {VideoFile} from 'react-native-vision-camera';

//* components import
import Recorder from '@templates/videos/recordVideo/Recorder';
import Preview from '@templates/videos/recordedVideo/Preview';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface RecordVideoProps {
  navigation: AppStackNavigationProp<'RecordVideo'>;
}

const RecordVideo = (props: RecordVideoProps): React.JSX.Element => {
  const [videoFile, setVideoFile] = useState<VideoFile>();

  return (
    <View style={styles.container}>
      {!!!videoFile ? (
        <Recorder navigation={props.navigation} setVideoFile={setVideoFile} />
      ) : (
        <Preview
          videoFile={videoFile}
          navigation={props.navigation}
          setVideoFile={setVideoFile}
        />
      )}
    </View>
  );
};

export default RecordVideo;
