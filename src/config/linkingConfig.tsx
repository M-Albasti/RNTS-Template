import {ConfigTypes} from '@Types/linkingConfig';

export const linkingConfig: ConfigTypes = {
  initialRouteName: 'Login',
  /* configuration for matching screens with paths */
  screens: {
    Login: {
      path: 'Login',
    },
    Settings: {
      path: 'Settings/:date',
      parse: {
        date: (date: string) => new Date(parseInt(date)).getTime(),
      },
      stringify: {
        date: (date: string) => {
          const d = new Date(parseInt(date));
          return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
        },
      },
    },
    DrawerRoot: {
      initialRouteName: 'Home',
      path: 'DrawerRoot/:id/:section?',
      parse: {
        id: (id: string) => `${id}`,
      },
      stringify: {
        id: (id: string) => id.replace(/^user-/, ''),
      },
      screens: {
        // this way for the profile can be implemented inside the nested navigator
        Profile: {
          // :section? this is an optional param
          path: 'Profile/:id/:section?',
          parse: {
            id: (id: string) => `${id}`,
          },
          stringify: {
            id: (id: string) => id.replace(/^user-/, ''),
          },
        },
        TabRoot: {
          initialRouteName: 'Home',
          path: 'TabRoot',
          screens: {
            Home: {
              path: 'Home',
            },
            Profile: {
              path: 'Profiles/:date',
              parse: {
                date: Number,
              },
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
    NotFound: {
      path: '*',
    },
  },
};
