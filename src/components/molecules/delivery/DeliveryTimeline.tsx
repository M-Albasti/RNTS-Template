import React from 'react';
import {View} from 'react-native';

import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveDeliveryTimelineStyles} from './styles/resolveDeliveryTimelineStyles';

import type {DeliveryTimelineEvent} from '@Types/deliveryTypes';

type DeliveryTimelineProps = {
  events: DeliveryTimelineEvent[];
};

const DeliveryTimeline = ({events}: DeliveryTimelineProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveDeliveryTimelineStyles);

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
