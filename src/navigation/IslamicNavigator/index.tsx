import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import IslamicHub from '@screens/islamic/islamicHub';
import IslamicUnifiedSearch from '@screens/islamic/islamicUnifiedSearch';
import QuranHub from '@screens/islamic/quran/quranHub';
import QuranIndex from '@screens/islamic/quran/quranIndex';
import QuranList from '@screens/islamic/quran/quranList';
import QuranReader from '@screens/islamic/quran/quranReader';
import QuranTafsirReader from '@screens/islamic/quran/quranTafsirReader';
import QuranSearch from '@screens/islamic/quran/quranSearch';
import AdhkarCategories from '@screens/islamic/adhkar/adhkarCategories';
import AdhkarDetail from '@screens/islamic/adhkar/adhkarDetail';
import HadithHub from '@screens/islamic/hadith/hadithHub';
import HadithEditions from '@screens/islamic/hadith/hadithEditions';
import HadithList from '@screens/islamic/hadith/hadithList';
import HadithDetail from '@screens/islamic/hadith/hadithDetail';
import HadithSearch from '@screens/islamic/hadith/hadithSearch';
import PrayerTimes from '@screens/islamic/prayerTimes';
import IslamicSettings from '@screens/islamic/islamicSettings';

import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {RootStackParamList} from '@Types/appNavigation';

import {styles} from './styles';

const IslamicStack = createNativeStackNavigator<RootStackParamList>();

const IslamicNavigator = (): React.JSX.Element => (
  <IslamicStack.Navigator
    initialRouteName="IslamicHub"
    layout={({children}) => (
      <ErrorBoundary>
        <Suspense
          fallback={
            <TextView
              text="Loading..."
              style={styles.fallbackText}
              containerStyle={styles.fallback}
            />
          }>
          <View style={styles.container}>{children}</View>
        </Suspense>
      </ErrorBoundary>
    )}
    screenOptions={{headerShown: false}}>
    <IslamicStack.Screen name="IslamicHub" component={IslamicHub} />
    <IslamicStack.Screen name="QuranHub" component={QuranHub} />
    <IslamicStack.Screen name="QuranIndex" component={QuranIndex} />
    <IslamicStack.Screen name="QuranList" component={QuranList} />
    <IslamicStack.Screen name="QuranReader" component={QuranReader} />
    <IslamicStack.Screen name="QuranTafsirReader" component={QuranTafsirReader} />
    <IslamicStack.Screen name="QuranSearch" component={QuranSearch} />
    <IslamicStack.Screen name="IslamicUnifiedSearch" component={IslamicUnifiedSearch} />
    <IslamicStack.Screen name="AdhkarCategories" component={AdhkarCategories} />
    <IslamicStack.Screen name="AdhkarDetail" component={AdhkarDetail} />
    <IslamicStack.Screen name="HadithHub" component={HadithHub} />
    <IslamicStack.Screen name="HadithEditions" component={HadithEditions} />
    <IslamicStack.Screen name="HadithList" component={HadithList} />
    <IslamicStack.Screen name="HadithDetail" component={HadithDetail} />
    <IslamicStack.Screen name="HadithSearch" component={HadithSearch} />
    <IslamicStack.Screen name="PrayerTimes" component={PrayerTimes} />
    <IslamicStack.Screen name="IslamicSettings" component={IslamicSettings} />
  </IslamicStack.Navigator>
);

export default IslamicNavigator;
