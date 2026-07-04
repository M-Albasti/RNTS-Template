import {layout} from '@theme/tokens';

import React, {useState} from 'react';
import {View} from 'react-native';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import ModalLayout from '@atoms/ModalLayout';
import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useThemeTokens} from '@theme/useThemeTokens';

const ModalDemo = (): React.JSX.Element => {
  const [visible, setVisible] = useState(false);
  const {colors, spacing} = useThemeTokens();

  return (
    <View>
      <Button label="Open modal" onPress={() => setVisible(true)} />
      <ModalLayout
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <View
          style={{
            flex: layout.flex.fill,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.overlay,
            padding: spacing.lg,
          }}>
          <Card constrained>
            <TextView text="Modal content inside Card" variant="body" />
            <Button label="Close" onPress={() => setVisible(false)} />
          </Card>
        </View>
      </ModalLayout>
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Modal Layout',
  sections: [{title: 'Toggle modal', content: <ModalDemo />}],
});
