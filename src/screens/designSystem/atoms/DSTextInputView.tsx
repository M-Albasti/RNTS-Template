import React, {useState} from 'react';

import TextInputView from '@atoms/TextInputView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

const DefaultInput = (): React.JSX.Element => {
  const [value, setValue] = useState('');
  return (
    <TextInputView placeholder="Enter text" value={value} onChangeText={setValue} />
  );
};

const LabeledInput = (): React.JSX.Element => {
  const [value, setValue] = useState('');
  return (
    <TextInputView
      label="Email"
      placeholder="you@example.com"
      value={value}
      onChangeText={setValue}
    />
  );
};

const ErrorInput = (): React.JSX.Element => {
  const [value, setValue] = useState('invalid');
  return (
    <TextInputView
      label="Username"
      value={value}
      onChangeText={setValue}
      errorMessage="Username is already taken"
    />
  );
};

const DisabledInput = (): React.JSX.Element => (
  <TextInputView label="Disabled" value="Read only" disabled />
);

export default createShowcaseScreen({
  title: 'TextInputView',
  sections: [
    {title: 'Default', content: <DefaultInput />},
    {title: 'With label', content: <LabeledInput />},
    {title: 'Error state', content: <ErrorInput />},
    {title: 'Disabled', content: <DisabledInput />},
  ],
});
