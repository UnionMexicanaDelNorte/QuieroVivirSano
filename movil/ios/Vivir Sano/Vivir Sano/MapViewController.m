//
//  MapViewController.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 29/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "MapViewController.h"
#import "AppDelegate.h"
#import "MKRouteStepQVS.h"
@import CoreLocation;
@interface MapViewController ()<CLLocationManagerDelegate>
@property (strong, nonatomic) CLLocationManager *locationManager;
@end

@implementation MapViewController
@synthesize mapView=_mapView,first=_first;

- (void)findDirectionsFrom:(MKMapItem *)source
                        to:(MKMapItem *)destination
{
    //provide loading animation here
    
    MKDirectionsRequest *request = [[MKDirectionsRequest alloc] init];
    request.source = source;
    request.transportType = MKDirectionsTransportTypeAutomobile;
    request.destination = destination;
    MKDirections *directions = [[MKDirections alloc] initWithRequest:request];
    //__block typeof(self) weakSelf = self;
    [directions calculateDirectionsWithCompletionHandler:
     ^(MKDirectionsResponse *response, NSError *error) {
         
         //stop loading animation here
         
         if (error) {
             NSLog(@"Error is %@",error);
         } else {
             //do something about the response, like draw it on map
          //   [self showRoute:response];
             routeGlobal = [response.routes firstObject];
             _listaDeYaHablados = [[NSMutableArray alloc] init];
             /*for (MKRouteStep *step in route.steps)
             {
                 NSLog(@"%@", step.instructions);
             }*/
            /* MKRouteStep *step = [routeGlobal.steps objectAtIndex:0];
             //step.instructions
             //step.polyline.coordinate
             _utterance = [[AVSpeechUtterance alloc] initWithString:step.instructions];
             _utterance.rate = AVSpeechUtteranceDefaultSpeechRate;
             [_speechSynth speakUtterance:_utterance];
             _yaEmpezeALeer=YES;
             */
             [self.mapView addOverlay:routeGlobal.polyline level:MKOverlayLevelAboveRoads];
         }
     }];
}

-(void)showRoute:(MKDirectionsResponse *)response
{
    for (MKRoute *route in response.routes)
    {
        for (MKRouteStep *step in route.steps)
        {
            NSLog(@"%@", step.instructions);
        }
        [self.mapView addOverlay:route.polyline level:MKOverlayLevelAboveRoads];
    }
}
- (void)dibujaRutaCoordenada:(CLLocationCoordinate2D)coordenada {
    //self.mapView.userLocation.coordinate
   // CLLocationCoordinate2D _srcCoord = CLLocationCoordinate2DMake(-6.89400,107.60473);
    MKPlacemark *_srcMark = [[MKPlacemark alloc] initWithCoordinate:coordenada addressDictionary:nil];
    MKMapItem *_srcItemDestino = [[MKMapItem alloc] initWithPlacemark:_srcMark];
  
    
    MKMapItem *_srcItem = [MKMapItem mapItemForCurrentLocation];
    [self findDirectionsFrom:_srcItem to:_srcItemDestino];
}



-(MKOverlayRenderer *)mapView:(MKMapView *)mapView rendererForOverlay:(id<MKOverlay>)overlay{
    MKPolylineRenderer *polylineRender = [[MKPolylineRenderer alloc] initWithOverlay:overlay];
    polylineRender.lineWidth = 3.0f;
    polylineRender.strokeColor = [UIColor blueColor];
    return polylineRender;
}


-(void)cargaTodosLasComunidadesQVS
{
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    load = [LoadingView loadingViewInView:self.view];
    if (app.hasInternet)
    {
        dispatch_async( dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
            NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate: nil delegateQueue: [NSOperationQueue mainQueue]];
            NSString *urlString = [NSString stringWithFormat:@"http://quierovivirsano.org/app/qvs.php"];
            NSString *post = [NSString stringWithFormat:@"servicio=app&accion=getAllGPS"];
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
                        NSArray *gps =[json objectForKey:@"gps"];
                        int i;
                         for(i=0;i<gps.count;i++)
                        {
                            NSDictionary *dic = [gps objectAtIndex:i];
                            float latitud = [[dic valueForKey:@"latitud"] floatValue];
                            float longitud = [[dic valueForKey:@"longitud"] floatValue];
                            float diferenciaLatitud =  fabsf(latitud-latitudMia);
                            if(diferenciaLatitud<menorDiferenciaLatitud)
                            {
                                sumarLatitud = latitud-latitudMia;
                                menorDiferenciaLatitud=diferenciaLatitud;
                            }
                            float diferenciaLongitud =  fabsf(longitud-longitudMia);
                            if(diferenciaLongitud<menorDiferenciaLongitud)
                            {
                                sumarLongitud = longitud-longitudMia;
                                menorDiferenciaLongitud=diferenciaLongitud;
                            }
                            NSString *correoDeLaComunidad = [dic valueForKey:@"correo"];
                            CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(latitud, longitud);
                            QVSAnnotation *a = [[QVSAnnotation alloc] initWithTitle:NSLocalizedString(@"verMasInfo", @"") location:coordinate andCorreo:correoDeLaComunidad];
                            a.delegate=self;
                            [self.mapView addAnnotation:a];
                            
                        }
                        MKCoordinateRegion region;
                        MKCoordinateSpan span;
                        span.latitudeDelta = menorDiferenciaLatitud;
                        span.longitudeDelta = menorDiferenciaLongitud;
                        region.span = span;
                        CLLocationCoordinate2D location2D = CLLocationCoordinate2DMake(latitudMia+sumarLatitud, longitudMia+sumarLongitud);
                        region.center = location2D;
                        [self.mapView setRegion:region animated:YES];
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
-(void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [_speechSynth stopSpeakingAtBoundary:AVSpeechBoundaryWord];
}
- (void)viewDidLoad {
    [super viewDidLoad];
    _speechSynth = [[AVSpeechSynthesizer alloc] init];
    
    self.mapView.showsUserLocation=YES;
    _first=YES;
    menorDiferenciaLatitud=1000;
    menorDiferenciaLongitud=1000;

    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    // Check for iOS 8. Without this guard the code will crash with "unknown selector" on iOS 7.
    if ([self.locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
        [self.locationManager requestWhenInUseAuthorization];
    }
    [self.locationManager startUpdatingLocation];
    //[self.mapView setUserTrackingMode:MKUserTrackingModeFollow animated:YES];
    // Do any additional setup after loading the view.
    
}
-(void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [self cargaTodosLasComunidadesQVS];
}
// Location Manager Delegate Methods
-(BOOL)yaLoHable:(MKRouteStep*)s  {
    
    for(MKRouteStep *paso in _listaDeYaHablados)
    {
        if(paso==s)
        {
            return YES;
        }
    }
    return NO;
}
- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations
{
    CLLocation *location = [locations lastObject];
    CLLocationCoordinate2D location2D = location.coordinate;
    int i;
    float maximaDiferencia = 0.00004;//hardcode
    if(routeGlobal!=nil)
    {
        for(i=0;i<routeGlobal.steps.count;i++)
        {
            //MKRouteStepQVS *step = [[MKRouteStepQVS alloc] initWithRouteStep:[routeGlobal.steps objectAtIndex:i]];
            MKRouteStep *step = [routeGlobal.steps objectAtIndex:i];
            
            float diferenciaLatitud = fabs(step.polyline.coordinate.latitude-self.mapView.userLocation.coordinate.latitude);
            float diferenciaLongitud = fabs(step.polyline.coordinate.longitude-self.mapView.userLocation.coordinate.longitude);
            if(![self yaLoHable:step] && diferenciaLatitud<maximaDiferencia && diferenciaLongitud<maximaDiferencia)
            {
               // step.yaLei=1;
                [_listaDeYaHablados addObject:step];
                _utterance = [[AVSpeechUtterance alloc] initWithString:step.instructions];
                _utterance.rate = AVSpeechUtteranceDefaultSpeechRate;
                [_speechSynth speakUtterance:_utterance];
                break;
            }
            //step=nil;
        }
    }
    
    
    if(_first)
    {
        _first=NO;
        latitudMia = location2D.latitude;
        longitudMia = location2D.longitude;
        [self.mapView setCenterCoordinate:location2D animated:YES];
        MKCoordinateRegion region;
        MKCoordinateSpan span;
        span.latitudeDelta = 0.01;
        span.longitudeDelta = 0.01;
        region.span = span;
        region.center = location2D;
        [self.mapView setRegion:region animated:YES];
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
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
/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/
#pragma mark - QVSAnnotationDelegate

- (void)queCorreoEra:(NSString*)correo yLaCoordenada:(CLLocationCoordinate2D)coordinate
{
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    load = [LoadingView loadingViewInView:self.view];
    if (app.hasInternet)
    {
        dispatch_async( dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
            NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate: nil delegateQueue: [NSOperationQueue mainQueue]];
            NSString *urlString = [NSString stringWithFormat:@"http://quierovivirsano.org/app/qvs.php"];
             NSString *post = [NSString stringWithFormat:@"servicio=app&accion=getDatosDeLaComunidad&correo=%@",correo];
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
                        NSArray *info =[json objectForKey:@"info"];
                        nombreParaPasar = [[info objectAtIndex:0] valueForKey:@"nombre"];
                        idFacebookParaPasar = [[info objectAtIndex:0] valueForKey:@"idFacebook"];
                        imagenParaPasar = [[info objectAtIndex:0] valueForKey:@"picture"];
                        horariosParaPasar = [[info objectAtIndex:0] valueForKey:@"horarios"];
                        
                        dispatch_async(dispatch_get_main_queue(), ^{
        UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"Main"bundle:nil];
        OpcionesComunidadViewController *opciones = (OpcionesComunidadViewController*)[mainStoryboard instantiateViewControllerWithIdentifier: @"OpcionesComunidadViewController"];
                            opciones.delegate=self;
                            [opciones setNombre:nombreParaPasar];
                            [opciones setImagen:imagenParaPasar];
                            [opciones setHorarios:horariosParaPasar];
                            [opciones setIdFacebook:idFacebookParaPasar];
                            [opciones setCoordinate:coordinate];
                            [self.navigationController pushViewController:opciones animated:YES];
                        });
                    }
                    else
                    {
                    }
                }
                [load removeView];
            }];
            
            [dataTask resume];
            
           
        });
        
    }
    else
    {
        [self showNoHayInternet];
    }
}
@end
