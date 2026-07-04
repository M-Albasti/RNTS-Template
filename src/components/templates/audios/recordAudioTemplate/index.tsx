//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {isEmpty} from 'lodash';
import {useTranslation} from 'react-i18next';

//* components import
import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

//* hooks import
import {AudioState, useAudioRecorder} from '@hooks/useAudioRecorder';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveRecordAudioTemplateStyles} from './styles/resolveRecordAudioTemplateStyles';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface RecordAudioTemplateProps {
  navigation: AppStackNavigationProp<'RecordAudio'>;
}

const RecordAudioTemplate = ({
  navigation,
}: RecordAudioTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {
    audioState,
    recordTime,
    playTime,
    duration,
    recordPath,
    isLoading,
    status,
    startRecord,
    pauseRecord,
    resumeRecord,
    stopRecord,
    startPlay,
    pausePlay,
    resumePlay,
    stopPlay,
    retakeAudio,
    uploadAudio,
  } = useAudioRecorder();

  const styles = useThemedStyles(resolveRecordAudioTemplateStyles);

  const isRecording = audioState === AudioState.RECORDING;
  const isRecordingPaused = audioState === AudioState.PAUSED;
  const isPlaying = audioState === AudioState.PLAYING;
  const isPlaybackPaused = audioState === AudioState.PLAYING_PAUSED;

  const statusLabel = isRecording
    ? t('media.recordingStatus')
    : isRecordingPaused
      ? t('media.paused')
      : isPlaying
        ? t('media.playingPreview')
        : isPlaybackPaused
          ? t('media.playbackPaused')
          : isEmpty(recordPath)
            ? t('media.readyToRecord')
            : t('media.recordingSaved');

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('media.recordAudio')}
        onBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />

      <Spacer size="lg" />

      <Card>
        <View style={styles.statusBadge}>
          <TextView text={statusLabel} variant="bodySmall" />
        </View>
        <Spacer size="md" />
        <TextView
          text={isEmpty(recordPath) ? recordTime || '00:00:00' : playTime || '00:00:00'}
          style={styles.timer}
        />
        <Spacer size="xs" />
        <TextView
          text={
            isEmpty(recordPath)
              ? t('media.tapRecordHint')
              : t('media.duration', {time: duration || '00:00:00'})
          }
          variant="bodySmall"
          muted
          style={styles.hint}
        />
      </Card>

      <Spacer size="lg" />

      {isEmpty(recordPath) ? (
        <Card elevated={false}>
          <Heading text={t('media.recordingControls')} level="h3" />
          <Spacer size="md" />
          <View style={styles.actions}>
            <Button
              label={isRecording ? t('media.recording') : t('media.startRecording')}
              fullWidth
              loading={isLoading && !isRecording && !isRecordingPaused}
              disabled={isRecording || isRecordingPaused}
              onPress={startRecord}
            />
            <Button
              label={t('common.pause')}
              variant="secondary"
              flat
              fullWidth
              disabled={!isRecording || isLoading}
              onPress={pauseRecord}
            />
            <Button
              label={t('common.resume')}
              variant="outline"
              fullWidth
              disabled={!isRecordingPaused || isLoading}
              onPress={resumeRecord}
            />
            <Button
              label={t('media.stopAndSave')}
              variant="danger"
              flat
              fullWidth
              disabled={(!isRecording && !isRecordingPaused) || isLoading}
              onPress={stopRecord}
            />
          </View>
        </Card>
      ) : (
        <Card elevated={false}>
          <Heading text={t('media.previewUpload')} level="h3" />
          <Spacer size="md" />
          <View style={styles.actions}>
            <Button
              label={isPlaying ? t('media.playing') : t('media.playPreview')}
              fullWidth
              loading={isLoading && !isPlaying && !isPlaybackPaused}
              disabled={isPlaying || isPlaybackPaused}
              onPress={startPlay}
            />
            <Button
              label={t('media.pausePreview')}
              variant="secondary"
              flat
              fullWidth
              disabled={!isPlaying || isLoading}
              onPress={pausePlay}
            />
            <Button
              label={t('media.resumePreview')}
              variant="outline"
              fullWidth
              disabled={!isPlaybackPaused || isLoading}
              onPress={resumePlay}
            />
            <Button
              label={t('media.stopPreview')}
              variant="ghost"
              fullWidth
              disabled={(!isPlaying && !isPlaybackPaused) || isLoading}
              onPress={stopPlay}
            />
            <Button
              label={t('common.retake')}
              variant="outline"
              fullWidth
              onPress={retakeAudio}
            />
            <Button
              label={status === 'loading' ? t('common.uploading') : t('media.uploadAudio')}
              fullWidth
              loading={status === 'loading'}
              disabled={status === 'loading'}
              onPress={uploadAudio}
            />
          </View>
        </Card>
      )}
    </ScreenContainer>
  );
};

export default RecordAudioTemplate;
