#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PrayerWidgetModule, NSObject)

RCT_EXTERN_METHOD(updateWidget:(NSDictionary *)payload)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
