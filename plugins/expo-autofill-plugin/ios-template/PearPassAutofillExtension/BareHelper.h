#import <Foundation/Foundation.h>
#import <BareKit/BareKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^BareHelperReadCompletion)(NSData * _Nullable data, NSError * _Nullable error);
typedef void (^BareHelperWriteCompletion)(NSError * _Nullable error);
typedef void (^BareHelperSendCompletion)(NSString * _Nullable reply, NSError * _Nullable error);

@interface BareHelper : NSObject

- (instancetype)initWithBundleName:(NSString *)bundleName 
                         bundleType:(NSString *)bundleType 
                        memoryLimit:(NSUInteger)memoryLimitInMB;
- (BOOL)startWorklet;
- (void)write:(NSData *)data completion:(BareHelperWriteCompletion)completion;
- (void)read:(BareHelperReadCompletion)completion;
- (void)send:(NSString *)message completion:(BareHelperSendCompletion)completion;
- (void)shutdown;

@end

NS_ASSUME_NONNULL_END