//
//  MapElegirGPSViewController.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 01/04/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "MapElegirGPSViewController.h"
#import "CMPopTipView.h"
#import "AppDelegate.h"
@import CoreLocation;
@interface MapElegirGPSViewController ()<CLLocationManagerDelegate>
@property (strong, nonatomic) CLLocationManager *locationManager;

@end

@implementation MapElegirGPSViewController
@synthesize mapView=_mapView,first=_first;
-(void)cargaPosicionElegidaSiExiste {
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    load = [LoadingView loadingViewInView:self.view];
    if (app.hasInternet)
    {
        dispatch_async( dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
            NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate: nil delegateQueue: [NSOperationQueue mainQueue]];
            NSString *urlString = [NSString stringWithFormat:@"http://quierovivirsano.org/app/qvs.php"];
            NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
            NSString *correo = [defaults objectForKey:@"correoActual"];
            NSString *post = [NSString stringWithFormat:@"servicio=app&accion=getGPS&correo=%@",correo];
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
               // NSLog(@"%@",[error description]);
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
                        float latitud = [[json objectForKey:@"latitud"] floatValue];
                        float longitud = [[json objectForKey:@"longitud"] floatValue];
                        CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(latitud, longitud);
                        QVSAnnotation *a = [[QVSAnnotation alloc] initWithTitle:NSLocalizedString(@"miComunidad", @"") location:coordinate andCorreo:correo];
                        [self.mapView addAnnotation:a];

                    }
                    else
                    {
                    }
                }
                [load removeView];
            }];
            
            [dataTask resume];
            
            dispatch_async(dispatch_get_main_queue(), ^{
                // Code to update the UI/send notifications based on the results of the background processing
                //            [_message show];
                
                
            });
        });
        
    }
    else
    {
        [self showNoHayInternet];
    }
}
- (void)viewDidLoad {
    [super viewDidLoad];
    self.mapView.showsUserLocation=YES;
    [self cargaPosicionElegidaSiExiste];
    _first=YES;
    UIBarButtonItem *save = [[UIBarButtonItem alloc] initWithTitle:NSLocalizedString(@"guardar", @"") style:UIBarButtonItemStylePlain target:self action:@selector(save)];
    self.navigationItem.rightBarButtonItem=save;
    
    CMPopTipView *popTipView;
    popTipView = [[CMPopTipView alloc] initWithTitle:NSLocalizedString(@"tutorialEligeGPS", @"") message:@""];
    popTipView.animation = arc4random() % 2;
    popTipView.has3DStyle = NO;
    popTipView.dismissTapAnywhere = YES;
    //[self.visiblePopTipViews addObject:popTipView];
    [popTipView presentPointingAtBarButtonItem:save animated:YES];
    
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    // Check for iOS 8. Without this guard the code will crash with "unknown selector" on iOS 7.
    if ([self.locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
        [self.locationManager requestWhenInUseAuthorization];
    }
    [self.locationManager startUpdatingLocation];
    UILongPressGestureRecognizer *lpgr = [[UILongPressGestureRecognizer alloc]
                                          initWithTarget:self action:@selector(addPinToMap:)];
    lpgr.minimumPressDuration = 0.5; //
    [self.mapView addGestureRecognizer:lpgr];
}

-(void)showNoHayInternet
{
    UIAlertController * view=   [UIAlertController
                                 alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                 message:NSLocalizedString(@"noHayInternet", nil)
                                 preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction* cancel = [UIAlertAction
                             actionWithTitle:NSLocalizedString(@"Aceptar", nil)
                             style:UIAlertActionStyleDefault
                             handler:^(UIAlertAction * action)
                             {
                                 [view dismissViewControllerAnimated:YES completion:nil];
                             }];
    [view addAction:cancel];
    [self presentViewController:view animated:YES completion:nil];
}
- (void)save {
    
    NSMutableArray * annotationsToRemove = [ self.mapView.annotations mutableCopy] ;
    [annotationsToRemove removeObject:self.mapView.userLocation] ;
    
    if([annotationsToRemove count]>0)
    {
        QVSAnnotation *guardar = (QVSAnnotation*)[annotationsToRemove objectAtIndex:0];
        CLLocationCoordinate2D aGuardar = guardar.coordinate;
        AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
        load = [LoadingView loadingViewInView:self.view];
        if (app.hasInternet)
        {
            dispatch_async( dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
                NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate: nil delegateQueue: [NSOperationQueue mainQueue]];
                NSString *urlString = [NSString stringWithFormat:@"http://quierovivirsano.org/app/qvs.php"];
                NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
                NSString *correo = [defaults objectForKey:@"correoActual"];
                
                NSString *post = [NSString stringWithFormat:@"servicio=app&accion=saveGPS&correo=%@&latitud=%f&longitud=%f",correo,aGuardar.latitude,aGuardar.longitude ];
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
                 //   NSLog(@"%@",[error description]);
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
                            UIAlertController * view=   [UIAlertController
                                                         alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                                         message:NSLocalizedString(@"direccionGuardada", nil)
                                                         preferredStyle:UIAlertControllerStyleAlert];
                            UIAlertAction* cancel = [UIAlertAction
                                                     actionWithTitle:NSLocalizedString(@"Aceptar", nil)
                                                     style:UIAlertActionStyleDefault
                                                     handler:^(UIAlertAction * action)
                                                     {
                                                         [view dismissViewControllerAnimated:YES completion:nil];
                                                         [self.navigationController popToRootViewControllerAnimated:YES];
                                                     }];
                            [view addAction:cancel];
                            [self presentViewController:view animated:YES completion:nil];
                        }
                        else
                        {
                        }
                    }
                    [load removeView];
                }];
                
                [dataTask resume];
                
                dispatch_async(dispatch_get_main_queue(), ^{
                    // Code to update the UI/send notifications based on the results of the background processing
                    //            [_message show];
                    
                    
                });
            });
            
        }
        else
        {
            [self showNoHayInternet];
        }

        
    }
    else
    {
        UIAlertController * view=   [UIAlertController
                                     alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                     message:NSLocalizedString(@"primeroMapa", nil)
                                     preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction* cancel = [UIAlertAction
                                 actionWithTitle:NSLocalizedString(@"Aceptar", nil)
                                 style:UIAlertActionStyleDefault
                                 handler:^(UIAlertAction * action)
                                 {
                                     [view dismissViewControllerAnimated:YES completion:nil];
                                 }];
        [view addAction:cancel];
        [self presentViewController:view animated:YES completion:nil];
    }
    
    
    
   
}

- (void)addPinToMap:(UIGestureRecognizer *)gestureRecognizer
{
    
    if (gestureRecognizer.state != UIGestureRecognizerStateBegan)
        return;
    
    NSMutableArray * annotationsToRemove = [ self.mapView.annotations mutableCopy] ;
    [annotationsToRemove removeObject:self.mapView.userLocation] ;
    [self.mapView removeAnnotations:annotationsToRemove] ;
    
    CGPoint touchPoint = [gestureRecognizer locationInView:self.mapView];
    CLLocationCoordinate2D touchMapCoordinate =
    [self.mapView convertPoint:touchPoint toCoordinateFromView:self.mapView];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *correo = [defaults objectForKey:@"correoActual"];
    
    
    //CLLocationCoordinate2D test = CLLocationCoordinate2DMake(25.1903978, -99.8492126);
    QVSAnnotation *a = [[QVSAnnotation alloc] initWithTitle:NSLocalizedString(@"miComunidad", @"") location:touchMapCoordinate andCorreo:correo];
    [self.mapView addAnnotation:a];
    
  
    
}
- (void)didTapMap {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


#pragma mark - LocationManager Delegate
- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations
{
    CLLocation *location = [locations lastObject];
    
    CLLocationCoordinate2D location2D = location.coordinate;
    if(_first)
    {
        _first=NO;
        [self.mapView setCenterCoordinate:location2D animated:YES];
        
        
        MKCoordinateRegion region;
        MKCoordinateSpan span;
        span.latitudeDelta = 0.01;
        span.longitudeDelta = 0.01;
        region.span = span;
        region.center = location2D;
        [self.mapView setRegion:region animated:YES];
    }
    
    // NSLog(@"%@", [locations lastObject]);
}
#pragma mark - MapView Delegate
 -(MKAnnotationView*)mapView:(MKMapView*)map viewForAnnotation:(nonnull id<MKAnnotation>)annotation
 {
 if([annotation isKindOfClass:[QVSAnnotation class]])
 {
 QVSAnnotation *myQVS = (QVSAnnotation*)annotation;
 MKAnnotationView *annotationView = [self.mapView dequeueReusableAnnotationViewWithIdentifier:@"QVSAnnotation"];
 if(annotationView==nil)
 {
 annotationView=myQVS.annotattionView;
 }
 else
 {
 annotationView.annotation=annotation;
 }
 return annotationView;
 }
 return nil;
 }

@end
