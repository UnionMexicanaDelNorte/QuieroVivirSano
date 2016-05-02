//
//  AppDelegate.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 17/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "AppDelegate.h"
#import "Reachability.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
@interface AppDelegate ()
@property (nonatomic) Reachability *internetReachability;
@end

@implementation AppDelegate
@synthesize hasInternet=_hasInternet,controller=_controller;


-(void)registerLocalNotification
{
    //no poner alarmas con fechas pasadas
    //poner 3 al dia (o las que esten activadas), hasta el limite del ios
    //siempre deben de ser alarmas futuras
    [[UIApplication sharedApplication] cancelAllLocalNotifications];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    int reto = [[defaults valueForKey:@"reto"] intValue];
    NSString *correo = [defaults objectForKey:@"correoActual"];
    if(![correo isEqualToString:@""])
    {
        NSString *key0 = @"alarma0";
        NSString *valor0 = [defaults objectForKey:key0];
        NSArray *auxArray0 = [valor0 componentsSeparatedByString:@":"];
        int horas0 = [[auxArray0 objectAtIndex:0] intValue];
        int minutes0 = [[auxArray0 objectAtIndex:1] intValue];
        
        
        NSString *key1 = @"alarma1";
        NSString *valor1 = [defaults objectForKey:key1];
        NSArray *auxArray1 = [valor1 componentsSeparatedByString:@":"];
        int horas1 = [[auxArray1 objectAtIndex:0] intValue];
        int minutes1 = [[auxArray1 objectAtIndex:1] intValue];
        
        
        NSString *key2 = @"alarma2";
        NSString *valor2 = [defaults objectForKey:key2];
        NSArray *auxArray2 = [valor2 componentsSeparatedByString:@":"];
        int horas2 = [[auxArray2 objectAtIndex:0] intValue];
        int minutes2 = [[auxArray2 objectAtIndex:1] intValue];
        
        int activado0 = [[defaults valueForKey:@"activado0"] intValue];
        int activado1 = [[defaults valueForKey:@"activado1"] intValue];
        int activado2 = [[defaults valueForKey:@"activado2"] intValue];
        
        int i=0;
        NSDate * now = [[NSDate alloc] init];
        NSCalendar *cal = [NSCalendar currentCalendar];
        NSDateComponents * comps = [cal components:NSCalendarUnitYear|NSCalendarUnitMonth|NSCalendarUnitDay| NSCalendarUnitHour|NSCalendarUnitMinute fromDate:now];
        
        for(i=0;i<20;i++)//20dias, 3 * 20 = 60;  64 notificaciones locales es el limite!
        {
            if(activado0==1)//si esta activado!
            {
                [comps setHour:horas0];
                [comps setMinute:minutes0];
                NSDate *date0 = [cal dateFromComponents:comps];
                NSDate *newDate0 = [date0 dateByAddingTimeInterval:60*60*24*i];
                if([newDate0 compare: now] == NSOrderedDescending) // if newDate0 is later in time than now
                {
                    UILocalNotification* n1 = [[UILocalNotification alloc] init];
                    NSString *aux0 = [NSString stringWithFormat:@"reto%d",reto];
                    n1.alertBody = [NSString stringWithFormat:NSLocalizedString(aux0, @"")];
                    n1.soundName = UILocalNotificationDefaultSoundName;
                    n1.fireDate = newDate0;
                    [[UIApplication sharedApplication] scheduleLocalNotification:n1];
                }
            }
            if(activado1==1)//si esta activado!
            {
                [comps setHour:horas1];
                [comps setMinute:minutes1];
                NSDate *date1 = [cal dateFromComponents:comps];
                NSDate *newDate1 = [date1 dateByAddingTimeInterval:60*60*24*i];
                if([newDate1 compare: now] == NSOrderedDescending) // if newDate0 is later in time than now
                {
                    UILocalNotification* n2 = [[UILocalNotification alloc] init];
                    NSString *aux1 = [NSString stringWithFormat:@"reto%d",reto];
                    n2.alertBody = [NSString stringWithFormat:NSLocalizedString(aux1, @"")];
                    n2.soundName = UILocalNotificationDefaultSoundName;
                    n2.fireDate = newDate1;
                    [[UIApplication sharedApplication] scheduleLocalNotification:n2];
                }
            }
            if(activado2==1)//si esta activado!
            {
                [comps setHour:horas2];
                [comps setMinute:minutes2];
                NSDate *date2 = [cal dateFromComponents:comps];
                NSDate *newDate2 = [date2 dateByAddingTimeInterval:60*60*24*i];
                if([newDate2 compare: now] == NSOrderedDescending) // if newDate0 is later in time than now
                {
                    UILocalNotification* n3 = [[UILocalNotification alloc] init];
                    NSString *aux2 = [NSString stringWithFormat:@"reto%d",reto];
                    n3.alertBody = [NSString stringWithFormat:NSLocalizedString(aux2, @"")];
                    n3.soundName = UILocalNotificationDefaultSoundName;
                    n3.fireDate = newDate2;
                    [[UIApplication sharedApplication] scheduleLocalNotification:n3];
                }
            }
        }
        now=nil;
    }
    
    
    
    
   
    
    
    
}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [[FBSDKApplicationDelegate sharedInstance] application:application
                             didFinishLaunchingWithOptions:launchOptions];
    self.firstRun=NO;
    
    UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"Main"
                                                             bundle: nil];
    
    
    LeftMenuViewController *leftMenu = (LeftMenuViewController*)[mainStoryboard
                                                                 instantiateViewControllerWithIdentifier: @"LeftMenuViewController"];
    
    RightMenuViewController *rightMenu = (RightMenuViewController*)[mainStoryboard
                                                                    instantiateViewControllerWithIdentifier: @"RightMenuViewController"];
    
    [SlideNavigationController sharedInstance].rightMenu = rightMenu;
    [SlideNavigationController sharedInstance].leftMenu = leftMenu;
    [SlideNavigationController sharedInstance].menuRevealAnimationDuration = .18;
    
    // Creating a custom bar button for right menu
    UIButton *button  = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 30, 30)];
    [button setImage:[UIImage imageNamed:@"gear"] forState:UIControlStateNormal];
    [button addTarget:[SlideNavigationController sharedInstance] action:@selector(toggleRightMenu) forControlEvents:UIControlEventTouchUpInside];
    UIBarButtonItem *rightBarButtonItem = [[UIBarButtonItem alloc] initWithCustomView:button];
    [SlideNavigationController sharedInstance].rightBarButtonItem = rightBarButtonItem;
    
    
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
    if(![[NSUserDefaults standardUserDefaults] boolForKey:@"AlreadyRan2"] ) {
        self.firstRun = YES;//move to "YES" for ask for an email the first time
       // [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"AlreadyRan2"];
        [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboPresentarMedidas"];
        [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboLoginFacebook"];
        [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboSacarAlarma"];
        [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboPresentarMapa"];
        [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"retoActual"];
        [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"pesoActual"];
        [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"cmActual"];
        [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboPresentarQueEs"];
        [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"esPromotor"];
        [[NSUserDefaults standardUserDefaults] setInteger:20160101 forKey:@"fechaUltimoReto"];
        [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboLogoutFacebook"];
        [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboPresentarElegirGPS"];
        [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboPresentarElegirHorario"];
        [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboPresentarVerParticipantes"];
        
        [[NSUserDefaults standardUserDefaults] setObject:@"06:30" forKey:@"alarma0"];
        [[NSUserDefaults standardUserDefaults] setObject:@"13:00" forKey:@"alarma1"];
        [[NSUserDefaults standardUserDefaults] setObject:@"19:00" forKey:@"alarma2"];
        
        NSData *imageData = UIImageJPEGRepresentation([UIImage imageNamed:@"sinperfil.jpg"] ,1);
        NSString *base64String = [imageData base64EncodedStringWithOptions:0];
        [[NSUserDefaults standardUserDefaults] setObject:base64String forKey:@"perfil"];
        
        
        // Sync user defaults
        [[NSUserDefaults standardUserDefaults] synchronize];
        [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"activado0"];
        [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"activado1"];
        [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"activado2"];
        [[NSUserDefaults standardUserDefaults] setObject:@"" forKey:@"name"];
        
        [[NSUserDefaults standardUserDefaults] setObject:@"" forKey:@"correoActual"];
        [[NSUserDefaults standardUserDefaults] synchronize];
        self.window = [[UIWindow alloc] initWithFrame:UIScreen.mainScreen.bounds];
        
        self.window.rootViewController = [storyboard instantiateViewControllerWithIdentifier:@"InitialViewController"];
        [self.window makeKeyAndVisible];
    }
    else
    {
       //  self.window.rootViewController = [storyboard instantiateViewControllerWithIdentifier:@"ViewController"];
    }
    self.internetReachability = [Reachability reachabilityForInternetConnection];
    [self.internetReachability startNotifier];
    [self updateInterfaceWithReachability:self.internetReachability];
    
   
    
    
   /* [[NSNotificationCenter defaultCenter] addObserverForName:SlideNavigationControllerDidReveal object:nil queue:nil usingBlock:^(NSNotification *note) {
       // NSString *menu = note.userInfo[@"menu"];
        //NSLog(@"Revealed %@", menu);
    }];*/
    
    
    return YES;
}
- (void)applicationDidBecomeActive:(UIApplication *)application {
    [FBSDKAppEvents activateApp];
}
-(void)registerNotificationCustom
{
    UIApplication *shared = [UIApplication sharedApplication];
    UIUserNotificationType userNotificationTypes = (UIUserNotificationTypeAlert |
                                                    UIUserNotificationTypeBadge |
                                                    UIUserNotificationTypeSound);
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:userNotificationTypes categories:nil];
    [shared registerUserNotificationSettings:settings];
    [shared registerForRemoteNotifications];
}


- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  //  NSLog(@"Did Fail to Register for Remote Notifications");
    //NSLog(@"%@, %@", error, error.localizedDescription);
    
}
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    NSLog(@"Did Register for Remote Notifications with Device Token (%@)", deviceToken);
    
    dispatch_async( dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
        NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate: nil delegateQueue: [NSOperationQueue mainQueue]];
        NSString *urlString = [NSString stringWithFormat:@"http://quierovivirsano.org/app/qvs.php"];
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        NSString *correo = [defaults objectForKey:@"correoActual"];
        NSString *post = [NSString stringWithFormat:@"servicio=app&accion=saveToken&tipo=1&token=%@&correo=%@",deviceToken,correo];
        NSData *postData = [post dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
        
        NSString *postLength = [NSString stringWithFormat:@"%d", (int)[postData length]];
        
        
        NSCharacterSet *set = [NSCharacterSet URLQueryAllowedCharacterSet];
        
        NSString* encodedUrl = [urlString stringByAddingPercentEncodingWithAllowedCharacters:
                                set];
        NSURL * url = [NSURL URLWithString:encodedUrl];
        NSMutableURLRequest * urlRequest = [NSMutableURLRequest requestWithURL:url];
        [urlRequest setHTTPMethod:@"POST"];//GET
        [urlRequest setValue:postLength forHTTPHeaderField:@"Content-Length"];
        [urlRequest setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
        
        [urlRequest setHTTPBody:postData];
        NSURLSessionDataTask * dataTask =[defaultSession dataTaskWithRequest:urlRequest                                                               completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
          //  NSLog(@"%@",[error description]);
            if(error == nil)
            {
                NSError* error;
                NSDictionary* json = [NSJSONSerialization
                                      JSONObjectWithData:data
                                      options:kNilOptions
                                      error:&error];
                int success = [[json objectForKey:@"success"] intValue];
                if(success==1)
                {
                }                
                else
                {
                }
            }
           
        }];
        
        [dataTask resume];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            // Code to update the UI/send notifications based on the results of the background processing
            //            [_message show];
            
            
        });
    });
    
}
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                                  openURL:url
                                                        sourceApplication:sourceApplication
                                                               annotation:annotation
                    ];
    // Add any custom logic here.
    return handled;
}

/*- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    return YES;
}*/

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}
- (void) reachabilityChanged:(NSNotification *)note
{
    Reachability* curReach = [note object];
    NSParameterAssert([curReach isKindOfClass:[Reachability class]]);
    [self updateInterfaceWithReachability:curReach];
}
- (void)applicationWillTerminate:(UIApplication *)application {
    [self saveContext];
}
- (void)updateInterfaceWithReachability:(Reachability *)reachability
{
    if (reachability == self.internetReachability)
    {
        [self configureTextField:reachability];
    }
}


- (void)configureTextField:(Reachability *)reachability
{
    NetworkStatus netStatus = [reachability currentReachabilityStatus];
    BOOL connectionRequired = [reachability connectionRequired];
    switch (netStatus)
    {
        case NotReachable:        {
            _hasInternet=NO;
            break;
        }
            
        case ReachableViaWWAN:        {
            _hasInternet=YES;
            // statusString = NSLocalizedString(@"Reachable WWAN", @"");
            // imageView.image = [UIImage imageNamed:@"WWAN5.png"];
            break;
        }
        case ReachableViaWiFi:        {
            _hasInternet=YES;
            // statusString= NSLocalizedString(@"Reachable WiFi", @"");
            //    imageView.image = [UIImage imageNamed:@"Airport.png"];
            break;
        }
    }
    if (connectionRequired)
    {
        // NSString *connectionRequiredFormatString = NSLocalizedString(@"%@, Connection Required", @"Concatenation of status string with connection requirement");
        // statusString= [NSString stringWithFormat:connectionRequiredFormatString, statusString];
    }
    //   textField.text= statusString;
}

#pragma mark - Core Data stack

@synthesize managedObjectContext = _managedObjectContext;
@synthesize managedObjectModel = _managedObjectModel;
@synthesize persistentStoreCoordinator = _persistentStoreCoordinator;

- (NSURL *)applicationDocumentsDirectory {
    // The directory the application uses to store the Core Data store file. This code uses a directory named "gc.deor.test" in the application's documents directory.
    return [[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];
}

- (NSManagedObjectModel *)managedObjectModel {
    // The managed object model for the application. It is a fatal error for the application not to be able to find and load its model.
    if (_managedObjectModel != nil) {
        return _managedObjectModel;
    }
    NSURL *modelURL = [[NSBundle mainBundle] URLForResource:@"qvs" withExtension:@"momd"];
    _managedObjectModel = [[NSManagedObjectModel alloc] initWithContentsOfURL:modelURL];
    return _managedObjectModel;
}
- (NSString *)documentsPathForFileName:(NSString *)name {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsPath = [paths objectAtIndex:0];
    
    return [documentsPath stringByAppendingPathComponent:name];
}
- (NSPersistentStoreCoordinator *)persistentStoreCoordinator {
    // The persistent store coordinator for the application. This implementation creates and returns a coordinator, having added the store for the application to it.
    if (_persistentStoreCoordinator != nil) {
        return _persistentStoreCoordinator;
    }
    
    // Create the coordinator and store
    
    _persistentStoreCoordinator = [[NSPersistentStoreCoordinator alloc] initWithManagedObjectModel:[self managedObjectModel]];
    NSURL *storeURL = [[self applicationDocumentsDirectory] URLByAppendingPathComponent:@"test.sqlite"];
    NSError *error = nil;
    NSString *failureReason = @"There was an error creating or loading the application's saved data.";
    if (![_persistentStoreCoordinator addPersistentStoreWithType:NSSQLiteStoreType configuration:nil URL:storeURL options:nil error:&error]) {
        // Report any error we got.
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        dict[NSLocalizedDescriptionKey] = @"Failed to initialize the application's saved data";
        dict[NSLocalizedFailureReasonErrorKey] = failureReason;
        dict[NSUnderlyingErrorKey] = error;
        error = [NSError errorWithDomain:@"YOUR_ERROR_DOMAIN" code:9999 userInfo:dict];
        // Replace this with code to handle the error appropriately.
        // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
        NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
        abort();
    }
    
    return _persistentStoreCoordinator;
}


- (NSManagedObjectContext *)managedObjectContext {
    // Returns the managed object context for the application (which is already bound to the persistent store coordinator for the application.)
    if (_managedObjectContext != nil) {
        return _managedObjectContext;
    }
    
    NSPersistentStoreCoordinator *coordinator = [self persistentStoreCoordinator];
    if (!coordinator) {
        return nil;
    }
    _managedObjectContext = [[NSManagedObjectContext alloc] initWithConcurrencyType:NSMainQueueConcurrencyType];
    [_managedObjectContext setPersistentStoreCoordinator:coordinator];
    return _managedObjectContext;
}

#pragma mark - Core Data Saving support

- (void)saveContext {
    NSManagedObjectContext *managedObjectContext = self.managedObjectContext;
    if (managedObjectContext != nil) {
        NSError *error = nil;
        if ([managedObjectContext hasChanges] && ![managedObjectContext save:&error]) {
            // Replace this implementation with code to handle the error appropriately.
            // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
            NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
            abort();
        }
    }
}
@end
