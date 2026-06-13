//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {isEmpty} from 'lodash';

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

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface RecordAudioTemplateProps {
  navigation: AppStackNavigationProp<'RecordAudio'>;
}

const RecordAudioTemplate = ({
  navigation,
}: RecordAudioTemplateProps): React.JSX.Element => {
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

  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      timer: {
        ...tokens.typography.h2,
        color: tokens.colors.textPrimary,
        textAlign: 'center',
      },
      hint: {
        textAlign: 'center',
      },
      actions: {
        gap: tokens.spacing.sm,
      },
      statusBadge: {
        alignSelf: 'center',
        backgroundColor: tokens.colors.primaryMuted,
        borderRadius: tokens.radius.full,
        paddingVertical: tokens.spacing.xs,
        paddingHorizontal: tokens.spacing.md,
      },
    }),
  );

  const isRecording = audioState === AudioState.RECORDING;
  const isRecordingPaused = audioState === AudioState.PAUSED;
  const isPlaying = audioState === AudioState.PLAYING;
  const isPlaybackPaused = audioState === AudioState.PLAYING_PAUSED;

  const statusLabel = isRecording
    ? 'Recording'
    : isRecordingPaused
      ? 'Paused'
      : isPlaying
        ? 'Playing preview'
        : isPlaybackPaused
          ? 'Playback paused'
          : isEmpty(recordPath)
            ? 'Ready to record'
            : 'Recording saved';

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title="Record audio"
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
              ? 'Tap record when you are ready. Pause or stop anytime.'
              : `Duration ${duration || '00:00:00'}`
          }
          variant="bodySmall"
          muted
          style={styles.hint}
        />
      </Card>

      <Spacer size="lg" />

      {isEmpty(recordPath) ? (
        <Card elevated={false}>
          <Heading text="Recording controls" level="h3" />
          <Spacer size="md" />
          <View style={styles.actions}>
            <Button
              label={isRecording ? 'Recording…' : 'Start recording'}
              fullWidth
              loading={isLoading && !isRecording && !isRecordingPaused}
              disabled={isRecording || isRecordingPaused}
              onPress={startRecord}
            />
            <Button
              label="Pause"
              variant="secondary"
              flat
              fullWidth
              disabled={!isRecording || isLoading}
              onPress={pauseRecord}
            />
            <Button
              label="Resume"
              variant="outline"
              fullWidth
              disabled={!isRecordingPaused || isLoading}
              onPress={resumeRecord}
            />
            <Button
              label="Stop & save"
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
          <Heading text="Preview & upload" level="h3" />
          <Spacer size="md" />
          <View style={styles.actions}>
            <Button
              label={isPlaying ? 'Playing…' : 'Play preview'}
              fullWidth
              loading={isLoading && !isPlaying && !isPlaybackPaused}
              disabled={isPlaying || isPlaybackPaused}
              onPress={startPlay}
            />
            <Button
              label="Pause preview"
              variant="secondary"
              flat
              fullWidth
              disabled={!isPlaying || isLoading}
              onPress={pausePlay}
            />
            <Button
              label="Resume preview"
              variant="outline"
              fullWidth
              disabled={!isPlaybackPaused || isLoading}
              onPress={resumePlay}
            />
            <Button
              label="Stop preview"
              variant="ghost"
              fullWidth
              disabled={(!isPlaying && !isPlaybackPaused) || isLoading}
              onPress={stopPlay}
            />
            <Button
              label="Retake"
              variant="outline"
              fullWidth
              onPress={retakeAudio}
            />
            <Button
              label={status === 'loading' ? 'Uploading…' : 'Upload audio'}
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
