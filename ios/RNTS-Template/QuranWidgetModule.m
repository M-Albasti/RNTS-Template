#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(QuranWidgetModule, NSObject)

RCT_EXTERN_METHOD(updateWidget:(NSDictionary *)payload)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
