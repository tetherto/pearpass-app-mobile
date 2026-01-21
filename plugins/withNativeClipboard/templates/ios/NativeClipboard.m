#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NativeClipboard, NSObject)

RCT_EXTERN_METHOD(setStringWithExpiration:(NSString *)text
                  seconds:(double)seconds
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(clearClipboard:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(clearIfCurrentMatches:(NSString *)text
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(isAvailable:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

@end