import React from 'react';
import {Modal, SafeAreaView, ModalProps, ViewStyle} from 'react-native';

const ModalLayout = (props: ModalProps & ViewStyle) => {
  return (
    <SafeAreaView
      style={{
        width: props.width,
        height: props.height,
        backgroundColor: props.backgroundColor,
        flex: props.flex,
        padding: props.padding,
        paddingVertical: props.paddingVertical,
        paddingHorizontal: props.paddingHorizontal,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        paddingTop: props.paddingTop,
        paddingBottom: props.paddingBottom,
        margin: props.margin,
        marginVertical: props.marginVertical,
        marginHorizontal: props.marginHorizontal,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
      }}
      onLayout={props.onLayout}>
      <Modal
        animationType={props.animationType}
        transparent={props.transparent}
        visible={props.visible}
        onShow={props.onShow}
        statusBarTranslucent={props.statusBarTranslucent}
        presentationStyle={props.presentationStyle}
        onDismiss={props.onDismiss}
        onRequestClose={props.onRequestClose}>
        {props.children}
      </Modal>
    </SafeAreaView>
  );
};

export default ModalLayout;
