import {layout} from '@theme/tokens';

import React, {useState} from 'react';
import {View} from 'react-native';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import ModalLayout from '@atoms/ModalLayout';
import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

const ModalDemo = (): React.JSX.Element => {
  const [visible, setVisible] = useState(false);

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
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 24,
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
