//* packages import
import React from 'react';

//* components import
import FirebaseLoginMethodTemplate from '@templates/firebaseLoginMethodTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface FirebaseLoginMethodProps {
  navigation: AppStackNavigationProp<'FirebaseLoginMethod'>;
}

const FirebaseLoginMethod = ({
  navigation,
}: FirebaseLoginMethodProps): React.JSX.Element => {
  return <FirebaseLoginMethodTemplate navigation={navigation} />;
};

export default FirebaseLoginMethod;
