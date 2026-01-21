#import "BareHelper.h"

@interface BareHelper ()
@property (nonatomic, strong) BareWorklet *worklet;
@property (nonatomic, strong) BareIPC *ipc;
@property (nonatomic, strong) NSString *bundleName;
@property (nonatomic, strong) NSString *bundleType;
@property (nonatomic, assign) NSUInteger memoryLimit;
@property (nonatomic, assign) BOOL isRunning;
@end

@implementation BareHelper

- (instancetype)initWithBundleName:(NSString *)bundleName 
                         bundleType:(NSString *)bundleType 
                        memoryLimit:(NSUInteger)memoryLimitInMB {
    self = [super init];
    if (self) {
        _bundleName = bundleName;
        _bundleType = bundleType;
        _memoryLimit = memoryLimitInMB * 1024 * 1024; // Convert MB to bytes
        _isRunning = NO;
        NSLog(@"BareHelper: Initialized with bundle %@.%@ and memory limit: %lu bytes", 
              _bundleName, _bundleType, (unsigned long)_memoryLimit);
    }
    return self;
}

- (BOOL)startWorklet {
    if (self.isRunning) {
        NSLog(@"BareHelper: Worklet is already running");
        return NO;
    }
    
    NSLog(@"BareHelper: Starting worklet with bundle: %@.%@", self.bundleName, self.bundleType);
    
    // Create worklet configuration
    BareWorkletConfiguration *config = [BareWorkletConfiguration defaultWorkletConfiguration];
    config.memoryLimit = self.memoryLimit;
    
    // Create worklet
    self.worklet = [[BareWorklet alloc] initWithConfiguration:config];
    if (!self.worklet) {
        NSLog(@"BareHelper: Failed to create worklet");
        return NO;
    }
    
    NSLog(@"BareHelper: Worklet created successfully");
    
    // Start worklet with bundle
    @try {
        [self.worklet start:self.bundleName ofType:self.bundleType arguments:@[]];
        NSLog(@"BareHelper: Worklet started successfully with bundle");
    } @catch (NSException *exception) {
        NSLog(@"BareHelper: Failed to start worklet: %@", exception.reason);
        self.worklet = nil;
        return NO;
    }
    
    // Initialize IPC
    self.ipc = [[BareIPC alloc] initWithWorklet:self.worklet];
    if (!self.ipc) {
        NSLog(@"BareHelper: Failed to create IPC");
        [self.worklet terminate];
        self.worklet = nil;
        return NO;
    }
    
    NSLog(@"BareHelper: IPC created successfully");
    self.isRunning = YES;
    
    return YES;
}

- (void)write:(NSData *)data completion:(BareHelperWriteCompletion)completion {
    if (!self.isRunning || !self.ipc) {
        NSLog(@"BareHelper: Cannot write - worklet not running or IPC not available");
        if (completion) {
            NSError *error = [NSError errorWithDomain:@"BareHelper" 
                                                 code:1001 
                                             userInfo:@{NSLocalizedDescriptionKey: @"Worklet not running"}];
            completion(error);
        }
        return;
    }
    
    NSLog(@"BareHelper: Writing %lu bytes", (unsigned long)data.length);
    [self.ipc write:data completion:completion];
}

- (void)read:(BareHelperReadCompletion)completion {
    if (!self.isRunning || !self.ipc) {
        NSLog(@"BareHelper: Cannot read - worklet not running or IPC not available");
        if (completion) {
            NSError *error = [NSError errorWithDomain:@"BareHelper" 
                                                 code:1002 
                                             userInfo:@{NSLocalizedDescriptionKey: @"Worklet not running"}];
            completion(nil, error);
        }
        return;
    }
    
    NSLog(@"BareHelper: Reading data");
    [self.ipc read:completion];
}

- (void)send:(NSString *)message completion:(BareHelperSendCompletion)completion {
    if (!self.isRunning || !self.ipc) {
        NSLog(@"BareHelper: Cannot send - worklet not running or IPC not available");
        if (completion) {
            NSError *error = [NSError errorWithDomain:@"BareHelper" 
                                                 code:1003 
                                             userInfo:@{NSLocalizedDescriptionKey: @"Worklet not running"}];
            completion(nil, error);
        }
        return;
    }
    
    // Convert string to data
    NSData *messageData = [message dataUsingEncoding:NSUTF8StringEncoding];
    if (!messageData) {
        NSLog(@"BareHelper: Failed to convert message to data");
        if (completion) {
            NSError *error = [NSError errorWithDomain:@"BareHelper" 
                                                 code:1004 
                                             userInfo:@{NSLocalizedDescriptionKey: @"Failed to encode message"}];
            completion(nil, error);
        }
        return;
    }
    
    NSLog(@"BareHelper: Sending message: %@", message);
    
    // Use weak/strong pattern to avoid retain cycles and ensure IPC remains valid
    __weak typeof(self) weakSelf = self;
    
    // Write the message
    [self.ipc write:messageData completion:^(NSError * _Nullable writeError) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (!strongSelf) {
            NSLog(@"BareHelper: Self was deallocated during write");
            return;
        }
        
        if (writeError) {
            NSLog(@"BareHelper: Write failed: %@", writeError.localizedDescription);
            if (completion) {
                completion(nil, writeError);
            }
            return;
        }
        
        NSLog(@"BareHelper: Message sent, waiting for reply");
        
        // Check if IPC is still valid before reading
        if (!strongSelf.ipc || !strongSelf.isRunning) {
            NSLog(@"BareHelper: IPC no longer valid after write");
            if (completion) {
                NSError *error = [NSError errorWithDomain:@"BareHelper" 
                                                     code:1007 
                                                 userInfo:@{NSLocalizedDescriptionKey: @"IPC connection lost"}];
                completion(nil, error);
            }
            return;
        }
        
        // Read the reply
        [strongSelf.ipc read:^(NSData * _Nullable replyData, NSError * _Nullable readError) {
            if (readError) {
                NSLog(@"BareHelper: Read failed: %@", readError.localizedDescription);
                if (completion) {
                    completion(nil, readError);
                }
                return;
            }
            
            if (!replyData) {
                NSLog(@"BareHelper: No reply data received");
                if (completion) {
                    NSError *error = [NSError errorWithDomain:@"BareHelper" 
                                                         code:1005 
                                                     userInfo:@{NSLocalizedDescriptionKey: @"No reply data received"}];
                    completion(nil, error);
                }
                return;
            }
            
            // Convert reply data to string
            NSString *reply = [[NSString alloc] initWithData:replyData encoding:NSUTF8StringEncoding];
            if (!reply) {
                NSLog(@"BareHelper: Failed to decode reply data (data length: %lu)", (unsigned long)replyData.length);
                if (completion) {
                    NSError *error = [NSError errorWithDomain:@"BareHelper" 
                                                         code:1006 
                                                     userInfo:@{NSLocalizedDescriptionKey: @"Failed to decode reply"}];
                    completion(nil, error);
                }
                return;
            }
            
            NSLog(@"BareHelper: Received reply: %@", reply);
            if (completion) {
                completion(reply, nil);
            }
        }];
    }];
}

- (void)shutdown {
    NSLog(@"BareHelper: Shutting down");
    
    if (self.ipc) {
        [self.ipc close];
        self.ipc = nil;
    }
    
    if (self.worklet) {
        [self.worklet terminate];
        self.worklet = nil;
    }
    
    self.isRunning = NO;
    NSLog(@"BareHelper: Shutdown complete");
}

- (void)dealloc {
    [self shutdown];
    NSLog(@"BareHelper: Deallocated");
}

@end