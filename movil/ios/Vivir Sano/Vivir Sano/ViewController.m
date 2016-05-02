//
//  ViewController.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 17/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "ViewController.h"
#import "AppDelegate.h"
#import "MedidasTableViewController.h"
#import "SlideViewController.h"
#import "PreguntaViewController.h"
#import "AuxNavigationViewController.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
@interface ViewController ()
@property (nonatomic, strong)	NSMutableArray	*visiblePopTipViews;
@end

@implementation ViewController
@synthesize yaHizeElRetoButton=_yaHizeElRetoButton,fondoHabito=_fondoHabito;
-(void)setFontFamily:(NSString*)fontFamily forView:(UIView*)view andSubViews:(BOOL)isSubViews
{
    if ([view isKindOfClass:[UILabel class]])
    {
        UILabel *lbl = (UILabel *)view;
        [lbl setFont:[UIFont fontWithName:fontFamily size:[[lbl font] pointSize]]];
    }
    
    if (isSubViews)
    {
        for (UIView *sview in view.subviews)
        {
            [self setFontFamily:fontFamily forView:sview andSubViews:YES];
        }
    }
}
-(IBAction)diagnosticoAccion:(id)sender
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    int pesoActual = [[defaults objectForKey:@"pesoActual"] intValue];
    int cmActual = [[defaults objectForKey:@"cmActual"] intValue];
    if(pesoActual==0 || cmActual==0)
    {
        UIAlertController * view=   [UIAlertController
                                     alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                     message:NSLocalizedString(@"primeroMedidas", nil)
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
        return;
    }
     [self performSegueWithIdentifier:@"veADiagnostico" sender:nil];
}
-(void)loadSegunReto
{
    //reto = actividad
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    int reto = [[defaults objectForKey:@"retoActual"] intValue];
    ///int enQueHabitoEstoy = ((reto-1)/7)+1;
    int retoSegunHabito = reto%7;
    if(retoSegunHabito==0)
    {
        retoSegunHabito=7;
    }
    [_diagnosticoButton setTitle:NSLocalizedString(@"diagnostico", @"") forState:UIControlStateNormal];
    
    NSString*labelActividad = [NSString stringWithFormat:@"%@ %d",NSLocalizedString(@"actividad", @""),retoSegunHabito];
    [_yaHizeElRetoButton setTitle:labelActividad forState:UIControlStateNormal];
}
-(void)cargaImagenDeFondo
{
    [self setFontFamily:@"Flama-Basic" forView:self.view andSubViews:YES]; 
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    int reto = [[defaults objectForKey:@"retoActual"] intValue];
    int enQueHabitoEstoy = ((reto-1)/7)+1;
    
    
    NSString *fraseQueEsHabito = [NSString stringWithFormat:@"queEsHabito%d",enQueHabitoEstoy];
    [_queEsHabito setTitle:NSLocalizedString(fraseQueEsHabito, @"") forState:UIControlStateNormal];
    NSString *imagenFondo = [NSString stringWithFormat:@"fondo%d.jpg",enQueHabitoEstoy];
    _fondoHabito.image = [UIImage imageNamed:imagenFondo];
}
-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self loadSegunReto];
    [self cargaImagenDeFondo];
}
-(void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *correo = [defaults objectForKey:@"correoActual"];
   /* NSString *gender = [defaults objectForKey:@"gender"];
    
    
    int pesoActual = [[defaults objectForKey:@"pesoActual"] intValue];
    int cmActual = [[defaults objectForKey:@"cmActual"] intValue];
    if(pesoActual==0 || cmActual==0)
    {
        //do nothing..
        //poner imagen de ?
        [_diagnostiscoButton setImage:[UIImage imageNamed:@"h2.png"] forState:UIControlStateNormal];
    }
    else
    {
        float icm = pesoActual/((cmActual/100.0f)*(cmActual/100.0f));
        NSString *primeraLetra = @"m";//mujer
        if([gender isEqualToString:@"male"])
        {
            primeraLetra=@"h";
        }
        if(icm<18.5)
        {
            [_diagnostiscoButton setImage:[UIImage imageNamed:[NSString stringWithFormat:@"%@1",primeraLetra]] forState:UIControlStateNormal];
        }
        else
        {
            if(icm>=18.5 && icm < 25)
            {
                [_diagnostiscoButton setImage:[UIImage imageNamed:[NSString stringWithFormat:@"%@2",primeraLetra]] forState:UIControlStateNormal];
            }
            else
            {
                if(icm>=25 && icm < 27)
                {
                    [_diagnostiscoButton setImage:[UIImage imageNamed:[NSString stringWithFormat:@"%@3",primeraLetra]] forState:UIControlStateNormal];
                }
                else
                {
                    if(icm>=27 && icm < 30)
                    {
                        [_diagnostiscoButton setImage:[UIImage imageNamed:[NSString stringWithFormat:@"%@4",primeraLetra]] forState:UIControlStateNormal];
                    }
                    else
                    {
                        if(icm>=30 && icm < 35)
                        {
                            [_diagnostiscoButton setImage:[UIImage imageNamed:[NSString stringWithFormat:@"%@5",primeraLetra]] forState:UIControlStateNormal];
                        }
                        else
                        {
                            [_diagnostiscoButton setImage:[UIImage imageNamed:[NSString stringWithFormat:@"%@6",primeraLetra]] forState:UIControlStateNormal];
                        }
                    }
                }
            }
        }
        
    }
    
    
    */
    if([correo isEqualToString:@""])//no login
    {
        CMPopTipView *popTipView;
        popTipView = [[CMPopTipView alloc] initWithTitle:NSLocalizedString(@"tutorialMenu", @"") message:@""];
        popTipView.animation = arc4random() % 2;
        popTipView.has3DStyle = NO;
        popTipView.dismissTapAnywhere = YES;
        [self.visiblePopTipViews addObject:popTipView];
        [popTipView presentPointingAtBarButtonItem:self.navigationItem.rightBarButtonItem animated:YES];
    }
    else
    {
        if([self checkIfExistRows]==0)//no tiene registros con el correo actual
        {
            //pon pop up de que tiene que checarse
            CMPopTipView *popTipView;
            popTipView = [[CMPopTipView alloc] initWithTitle:NSLocalizedString(@"tutorialOtroMenu", @"") message:@""];
            popTipView.animation = arc4random() % 2;
            popTipView.has3DStyle = NO;
            popTipView.dismissTapAnywhere = YES;
            [self.visiblePopTipViews addObject:popTipView];
            [popTipView presentPointingAtBarButtonItem:self.navigationItem.leftBarButtonItem animated:YES];
        }
    }
}
- (void)dismissAllPopTipViews
{
    while ([self.visiblePopTipViews count] > 0) {
        CMPopTipView *popTipView = [self.visiblePopTipViews objectAtIndex:0];
        [popTipView dismissAnimated:YES];
        [self.visiblePopTipViews removeObjectAtIndex:0];
    }
}
- (NSString *)documentsPathForFileName:(NSString *)name {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsPath = [paths objectAtIndex:0];
    
    return [documentsPath stringByAppendingPathComponent:name];
}
-(void)ponFraseAleatoria {
    _fraseAleatoria.backgroundColor = [UIColor colorWithRed:100.0f/255.0f green:100.0f/255.0f blue:100.0f/255.0f alpha:0.5f];
    int randNum = arc4random() % (14 - 1) + 1; //create the random number.
    NSString *key = [NSString stringWithFormat:@"fraseInicial%d", randNum];
    _fraseAleatoria.text=[NSString stringWithFormat:@"%@",NSLocalizedString(key, @"")];
}
-(NSString *) getImageFromURL:(NSString *)fileURL {
  //  UIImage * result;
    
    NSData * data = [NSData dataWithContentsOfURL:[NSURL URLWithString:fileURL]];
    
    
    NSString *base64String = [data base64EncodedStringWithOptions:0];
    [[NSUserDefaults standardUserDefaults] setObject:base64String forKey:@"perfil"];
    
    
    [[NSUserDefaults standardUserDefaults] synchronize];
    
    NSData *encodedData = [data base64EncodedDataWithOptions:0];
    NSString *encodedString =[NSString stringWithUTF8String:[encodedData bytes]];

   // result = [UIImage imageWithData:data];
    
    return encodedString;
}
-(long)checkIfExistRows{
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    
    NSFetchRequest *fetchRequest = [[NSFetchRequest alloc] init];
    NSEntityDescription *entity = [NSEntityDescription entityForName:@"Checate" inManagedObjectContext:[app managedObjectContext]];
    [fetchRequest setEntity:entity];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *correo = [defaults objectForKey:@"correoActual"];
    NSPredicate *predicate = [NSPredicate predicateWithFormat:@"correo=%@",correo ];
    [fetchRequest setPredicate:predicate];
    [fetchRequest setFetchBatchSize:20];
    NSSortDescriptor *sortDescriptor = [[NSSortDescriptor alloc] initWithKey:@"timestamp" ascending:NO];
    [fetchRequest setSortDescriptors:@[sortDescriptor]];
    NSFetchedResultsController *aFetchedResultsController = [[NSFetchedResultsController alloc] initWithFetchRequest:fetchRequest managedObjectContext:[app managedObjectContext] sectionNameKeyPath:nil cacheName:nil];
    aFetchedResultsController.delegate = self;
    self.fetchedResultsController = aFetchedResultsController;
    
    NSError *error = nil;
    if (![self.fetchedResultsController performFetch:&error]) {
        NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
        abort();
    }
    return self.fetchedResultsController.fetchedObjects.count;
}

- (void)viewDidLoad {
    
    [super viewDidLoad];
    [self ponFraseAleatoria];
    /*for (NSString *aver in [UIFont familyNames])
    {
        NSLog(@"familia: %@",aver);
        for(NSString *f in [UIFont fontNamesForFamilyName:aver])
        {
            NSLog(@"familia: %@",f);
        }
    }*/
    self.visiblePopTipViews = [NSMutableArray array];
    
    [[NSNotificationCenter defaultCenter] addObserverForName:SlideNavigationControllerDidOpen object:nil queue:nil usingBlock:^(NSNotification *note) {
           NSString *menu = note.userInfo[@"menu"];
            if([menu isEqualToString:@"right"])
            {
                
            }
        //  NSLog(@"Opened %@", menu);
    }];
    
    [[NSNotificationCenter defaultCenter] addObserverForName:SlideNavigationControllerDidClose object:nil queue:nil usingBlock:^(NSNotification *note) {
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        
        
        
        int deboPresentarElegirHorario = [[defaults valueForKey:@"deboPresentarElegirHorario"] intValue];
        if(deboPresentarElegirHorario==1)
        {
            [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboPresentarElegirHorario"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            [self performSegueWithIdentifier:@"vesAHorariosTable" sender:nil];
        }
        int deboPresentarElegirGPS = [[defaults valueForKey:@"deboPresentarElegirGPS"] intValue];
        if(deboPresentarElegirGPS==1)
        {
            [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboPresentarElegirGPS"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            [self performSegueWithIdentifier:@"vesAElegirGPS" sender:nil];
        }
        int deboPresentarQueEs = [[defaults valueForKey:@"deboPresentarQueEs"] intValue];
        if(deboPresentarQueEs==1)
        {
            [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboPresentarQueEs"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            
            SlideViewController *vc = [[SlideViewController alloc] init];
            
          /*  UINavigationController *navBar=[[UINavigationController alloc]initWithRootViewController:vc];
            
            navBar.navigationController.navigationBar.backgroundColor = [UIColor colorWithRed:120.0f/255.0f green:209.0f/255.0f blue:139.0f/255.0f alpha:1.0f];
            [navBar.navigationController.navigationBar
             setTitleTextAttributes:@{NSForegroundColorAttributeName : [UIColor whiteColor]}];
            navBar.navigationController.navigationBar.tintColor = [UIColor whiteColor];
            
            navBar.navigationController.navigationBar.barTintColor = [UIColor colorWithRed:120.0f/255.0f green:209.0f/255.0f blue:139.0f/255.0f alpha:1.0f];*/
            [self.navigationController presentViewController:vc animated:YES completion:nil];
            
          
        }
        int deboPresentarMapa = [[defaults valueForKey:@"deboPresentarMapa"] intValue];
        if(deboPresentarMapa==1)
        {
            [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboPresentarMapa"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            [self performSegueWithIdentifier:@"veAMapa" sender:nil];
        }
        int deboSacarAlarma = [[defaults valueForKey:@"deboSacarAlarma"] intValue];
        if(deboSacarAlarma==1)
        {
            [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboSacarAlarma"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            [self performSegueWithIdentifier:@"veAAlarmas" sender:nil];
        }
        int deboPresentarMedidas = [[defaults valueForKey:@"deboPresentarMedidas"] intValue];
        if(deboPresentarMedidas==1)
        {
            [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboPresentarMedidas"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            MedidasTableViewController *vc = [[MedidasTableViewController alloc] init];
            AuxNavigationViewController *navBar=[[AuxNavigationViewController alloc]initWithRootViewController:vc];
            navBar.navigationController.navigationBar.backgroundColor = [UIColor colorWithRed:120.0f/255.0f green:209.0f/255.0f blue:139.0f/255.0f alpha:1.0f];
            [navBar.navigationController.navigationBar
             setTitleTextAttributes:@{NSForegroundColorAttributeName : [UIColor whiteColor]}];
            navBar.navigationController.navigationBar.tintColor = [UIColor whiteColor];
            
            navBar.navigationController.navigationBar.barTintColor = [UIColor colorWithRed:120.0f/255.0f green:209.0f/255.0f blue:139.0f/255.0f alpha:1.0f];

            
            [self.navigationController presentViewController:navBar animated:YES completion:nil];
            //[self presentViewController:vc animated:YES completion:nil];
            
            
        }
        int deboLogout = [[defaults valueForKey:@"deboLogoutFacebook"] intValue];
        if(deboLogout==1)
        {
            [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboLogoutFacebook"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
            
            
            if (app.hasInternet)
            {
                
               // NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
                NSString *correo = [defaults objectForKey:@"correoActual"];
                int reto = [[defaults valueForKey:@"retoActual"] intValue];
                int fechaUltimoReto = [[defaults valueForKey:@"fechaUltimoReto"] intValue];
                
                load = [LoadingView loadingViewInView:self.view];
                
                dispatch_async( dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                    NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
                    NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate: nil delegateQueue: [NSOperationQueue mainQueue]];
                    NSString *urlString = [NSString stringWithFormat:@"http://quierovivirsano.org/app/qvs.php"];
                    
                    
                    NSString *post = [NSString stringWithFormat:@"servicio=app&accion=saveReto&correo=%@&reto=%d&fechaUltimoReto=%d",correo,reto,fechaUltimoReto];
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
                                [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"retoActual"];
                                [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"pesoActual"];
                                [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"cmActual"];
                                [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"esPromotor"];
                                
                                [[NSUserDefaults standardUserDefaults] setObject:@"" forKey:@"correoActual"];
                                
                                [[NSUserDefaults standardUserDefaults] setObject:@"" forKey:@"name"];
                                [[NSUserDefaults standardUserDefaults] synchronize];
                                
                                FBSDKLoginManager *loginManager = [[FBSDKLoginManager alloc] init];
                                [loginManager logOut];
                                CMPopTipView *popTipView;
                                popTipView = [[CMPopTipView alloc] initWithTitle:NSLocalizedString(@"tutorialMenu", @"") message:@""];
                                popTipView.animation = arc4random() % 2;
                                popTipView.has3DStyle = NO;
                                popTipView.dismissTapAnywhere = YES;
                                [self.visiblePopTipViews addObject:popTipView];
                                [popTipView presentPointingAtBarButtonItem:self.navigationItem.rightBarButtonItem animated:YES];

                                
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
        int deboLogin = [[defaults valueForKey:@"deboLoginFacebook"] intValue];
        if(deboLogin==1)
        {
            [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:@"deboLoginFacebook"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
            [login
             logInWithReadPermissions: @[@"public_profile",@"email",@"user_friends"]
             fromViewController:self
             handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
                 
                 if (error) {
                     NSLog(@"Process error");
                 } else if (result.isCancelled) {
                     NSLog(@"Cancelled");
                 } else {
                     NSMutableDictionary* parameters = [NSMutableDictionary dictionary];
                     [parameters setValue:@"id,name,email,picture,age_range,gender" forKey:@"fields"];
                      load = [LoadingView loadingViewInView:self.view];
                     
                     [[[FBSDKGraphRequest alloc] initWithGraphPath:@"me" parameters:parameters]
                      startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,
                                                   id result, NSError *error) {
                          
                          NSDictionary *dic =result;
                          NSString *idF = [dic valueForKey:@"id"];
                          NSString *name = [dic valueForKey:@"name"];
                          NSString *age_range = [[dic valueForKey:@"age_range"] valueForKey:@"min"];
                          NSString *gender = [[dic valueForKey:@"gender"] description];
                          NSString *email = [dic valueForKey:@"email"];
                          NSString *picture = [[[dic valueForKey:@"picture"] valueForKey:@"data"] valueForKey:@"url"];
                          NSString *dataImage = [self getImageFromURL:picture];
                          AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
                         
                          
                          if (app.hasInternet)
                          {
                              dispatch_async( dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                                  NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
                                  NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate: nil delegateQueue: [NSOperationQueue mainQueue]];
                                  NSString *urlString = [NSString stringWithFormat:@"http://quierovivirsano.org/app/qvs.php"];
                                  
                                  
                                  NSString *post = [NSString stringWithFormat:@"servicio=nombres&accion=save&idF=%@&nombre=%@&age=%@&gender=%@&correo=%@&picture=%@",idF,name,age_range.description,gender,email,dataImage];
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
                                              int reto = [[json objectForKey:@"reto"] intValue];
                                              int esPromotor = [[json objectForKey:@"esPromotor"] intValue];
                                              int fechaUltimoReto = [[json objectForKey:@"fechaUltimoReto"] intValue];
                                              
                                              dispatch_async(dispatch_get_main_queue(), ^(void){
                                                  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
                                                  [defaults setObject:idF forKey:@"idF"];
                                                  [defaults setInteger:reto forKey:@"retoActual"];
                                                  [defaults setInteger:esPromotor forKey:@"esPromotor"];
                                                  [defaults setInteger:fechaUltimoReto forKey:@"fechaUltimoReto"];
                                                  
                                                  [defaults setObject:gender forKey:@"gender"];
                                                  [defaults setObject:age_range forKey:@"age"];
                                                  [defaults setObject:name forKey:@"name"];
                                                  [defaults setObject:picture forKey:@"picture"];
                                                  
                                                  [defaults setObject:email forKey:@"correoActual"];
                                                  [defaults synchronize];
                                                
                                                  [app registerLocalNotification];
                                                  //quitar popups, poner imagen y nombre en pantalla principal
                                                  //elegir colores segun genero
                                                  [self dismissAllPopTipViews];
                                                  [app registerNotificationCustom];
                                                  //if no hayy registro de imc en core data..
                                                  //registrar notificacion push!
                                                  if([self checkIfExistRows]==0)//no tiene registros con el correo actual
                                                  {
                                                      //pon pop up de que tiene que checarse
                                                      CMPopTipView *popTipView;
                                                      popTipView = [[CMPopTipView alloc] initWithTitle:NSLocalizedString(@"tutorialOtroMenu", @"") message:@""];
                                                      popTipView.animation = arc4random() % 2;
                                                      popTipView.has3DStyle = NO;
                                                      popTipView.dismissTapAnywhere = YES;
                                                      [self.visiblePopTipViews addObject:popTipView];
                                                      [popTipView presentPointingAtBarButtonItem:self.navigationItem.leftBarButtonItem animated:YES];
                                                  }
                                              });
                                             
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
                          
                      }];
                 }
             }];
        }
    }];
    
    
  /*  UIImageView *navigationImage=[[UIImageView alloc]initWithFrame:CGRectMake(0, 0, 34, 34)];
    navigationImage.image=[UIImage imageNamed:@"qvs.png"];
    UIImageView *workaroundImageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 34, 34)];
    [workaroundImageView addSubview:navigationImage];
    self.navigationItem.titleView=workaroundImageView;
    */
    self.title=NSLocalizedString(@"titulo", @"");
    [[UINavigationBar appearance] setBarStyle:UIBarStyleDefault];
    self.navigationController.navigationBar.backgroundColor = [UIColor colorWithRed:112.0f/255.0f green:181.0f/255.0f blue:46.0f/255.0f alpha:1.0f];
    [self.navigationController.navigationBar
     setTitleTextAttributes:@{NSForegroundColorAttributeName : [UIColor whiteColor]}];
    self.navigationController.navigationBar.tintColor = [UIColor whiteColor];
    
    self.navigationController.navigationBar.barTintColor = [UIColor colorWithRed:112.0f/255.0f green:181.0f/255.0f blue:46.0f/255.0f alpha:1.0f];
    
    self.title=NSLocalizedString(@"titulo", @"");
    //FBSDKLoginButton *loginButton = [[FBSDKLoginButton alloc] init];
   // loginButton.center = self.view.center;
    //[self.view addSubview:loginButton];
    // Do any additional setup after loading the view, typically from a nib.
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
#pragma mark - SlideNavigationController Methods -

- (BOOL)slideNavigationControllerShouldDisplayLeftMenu
{
    return YES;
}

- (BOOL)slideNavigationControllerShouldDisplayRightMenu
{
    return YES;
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Fetched results controller

- (NSFetchedResultsController *)fetchedResultsController
{
    if (_fetchedResultsController != nil) {
        return _fetchedResultsController;
    }
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    
    NSFetchRequest *fetchRequest = [[NSFetchRequest alloc] init];
    NSEntityDescription *entity = [NSEntityDescription entityForName:@"Checate" inManagedObjectContext:[app managedObjectContext]];
    [fetchRequest setEntity:entity];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *correo = [defaults objectForKey:@"correoActual"];
    NSPredicate *predicate = [NSPredicate predicateWithFormat:@"correo=%@",correo ];
    [fetchRequest setPredicate:predicate];
    [fetchRequest setFetchBatchSize:20];
    NSSortDescriptor *sortDescriptor = [[NSSortDescriptor alloc] initWithKey:@"timestamp" ascending:NO];
    [fetchRequest setSortDescriptors:@[sortDescriptor]];
    NSFetchedResultsController *aFetchedResultsController = [[NSFetchedResultsController alloc] initWithFetchRequest:fetchRequest managedObjectContext:[app managedObjectContext] sectionNameKeyPath:nil cacheName:nil];
    aFetchedResultsController.delegate = self;
    self.fetchedResultsController = aFetchedResultsController;
    
    NSError *error = nil;
    if (![self.fetchedResultsController performFetch:&error]) {
        NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
        abort();
    }
    return _fetchedResultsController;
}
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    
    if ([segue.identifier isEqualToString:@"veACuestionario"])
    {
        PreguntaViewController *pregunta = [segue destinationViewController];
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        int reto = [[defaults objectForKey:@"retoActual"] intValue];
        int enQueHabitoEstoy = ((reto-1)/7)+1;
        int limite = 9;
        switch (enQueHabitoEstoy) {
            case 1:
                limite=9;
                break;
            default:
                break;
        }
        [pregunta setPuntos:0];
        [pregunta setEnQueHabitoEstoy:enQueHabitoEstoy];
        [pregunta setPreguntaActual:1];
        [pregunta setLimite:limite];
        
    }
}



@end
