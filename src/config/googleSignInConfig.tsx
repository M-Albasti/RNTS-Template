import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '4965146642-dj29f9an3k8nmd745lo1riplqmecoha6.apps.googleusercontent.com',
  //   scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  //   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  //   hostedDomain: '', // specifies a hosted domain restriction
  //   forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  //   accountName: '', // [Android] specifies an account name on the device that should be used
  //   iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  //   googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. "GoogleService-Info-Staging"
  //   openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  //   profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});
