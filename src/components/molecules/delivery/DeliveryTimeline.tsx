import React from 'react';
import {View} from 'react-native';

import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';

import type {DeliveryTimelineEvent} from '@Types/deliveryTypes';

type DeliveryTimelineProps = {
  events: DeliveryTimelineEvent[];
};

const DeliveryTimeline = ({events}: DeliveryTimelineProps): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    list: {gap: tokens.spacing.sm},
    row: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.sm,
      alignItems: tokens.layout.alignItems.start,
    },
    dot: {
      width: tokens.sizes.timelineDot,
      height: tokens.sizes.timelineDot,
      borderRadius: tokens.sizes.timelineDot / 2,
      backgroundColor: tokens.colors.primary,
      marginTop: tokens.spacing.xs,
    },
    content: {flex: tokens.layout.flex.fill, gap: tokens.spacing.xxs},
  }));

  return (
    <View style={styles.list}>
      {events.map(event => (
        <View key={event.id} style={styles.row}>
          <View style={styles.dot} />
          <View style={styles.content}>
            <TextView text={event.label} variant="bodySmall" />
            <TextView
              text={new Date(event.timestamp).toLocaleString()}
              variant="caption"
              muted
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default DeliveryTimeline;
