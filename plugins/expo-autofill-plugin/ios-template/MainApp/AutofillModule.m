#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AutofillModule, NSObject)

RCT_EXTERN_METHOD(isAutofillEnabled:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(openAutofillSettings:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestToEnableAutofill:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
