import React, {useState} from 'react';
import {View} from 'react-native';
import Recorder from '@templates/videos/recordVideo/Recorder';
import {styles} from './styles';
import {AppStackNavigationProp} from '@Types/appNavigation';
import Preview from '@templates/videos/recordedVideo/Preview';
import {VideoFile} from 'react-native-vision-camera';

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
