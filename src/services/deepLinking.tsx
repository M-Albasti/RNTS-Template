import type {LinkingOptions} from '@react-navigation/native';

export const linking: LinkingOptions<any> = {
  enabled: true,
  prefixes: [
    /* your linking prefixes */
    'projectdeeplink://',
    'https://projectdeeplink.com',
    'https://*.projectdeeplink.com',
  ],
  config: {
    initialRouteName: 'Home',
    /* configuration for matching screens with paths */
    screens: {
      // this way for the profile can be implemented inside the nested navigator
      Profile: {
        // :section? this is an optional param
        path: 'Profile/:id/:section?',
        parse: {
          id: id => `${id}`,
        },
        stringify: {
          id: id => id.replace(/^user-/, ''),
        },
      },
      Home: 'Home',
      StackRoot: {
        path: 'StackRoot',
        screens: {
          Settings: 'Settings',
          DrawerRoot: {
            path: 'DrawerRoot',
            screens: {
              Profile: {
                path: 'Profiles',
                exact: true,
              },
            },
          },
        },
      },
      // not exist root will cause warn
      /*
       * this will be handle for the wrong path
       * this will navigate to the screen Named
       * NotFount Screen and it can be used
       * inside the nested navigators
       */
      NotFound: '*',
    },
  },
};
