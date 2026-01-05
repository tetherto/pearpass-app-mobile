#import "AppGroupHelper.h"

@implementation AppGroupHelper

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getSharedDirectoryPath:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *appGroupId = @"group.com.noxtton.pearpass";
  NSURL *containerURL = [[NSFileManager defaultManager] containerURLForSecurityApplicationGroupIdentifier:appGroupId];
  
  if (containerURL) {
    NSString *absolutePath = [containerURL path];
    NSLog(@"App Group container path: %@", absolutePath);
    resolve(absolutePath);
  } else {
    NSLog(@"Failed to get App Group container for ID: %@", appGroupId);
    reject(@"APP_GROUP_ERROR", @"Unable to access App Group container", nil);
  }
}

@end