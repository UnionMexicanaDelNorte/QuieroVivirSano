//
//  AppDelegate.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 17/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreData/CoreData.h>
#import "SlideNavigationController.h"
#import "LeftMenuViewController.h"
#import "RightMenuViewController.h"
#import "SlideViewController.h"
@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;
@property BOOL hasInternet;
@property BOOL firstRun;
-(void)registerNotificationCustom;
-(void)registerLocalNotification;

@property (readonly, strong, nonatomic) NSManagedObjectContext *managedObjectContext;
@property (readonly, strong, nonatomic) NSManagedObjectModel *managedObjectModel;
@property (readonly, strong, nonatomic) NSPersistentStoreCoordinator *persistentStoreCoordinator;
@property (strong, nonatomic) SlideViewController *controller;
- (void)saveContext;
- (NSURL *)applicationDocumentsDirectory;
@end

