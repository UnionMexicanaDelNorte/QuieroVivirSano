//
//  RetoDelDiaViewController.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 30/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "RetoDelDiaViewController.h"
#import "AppDelegate.h"
@interface RetoDelDiaViewController ()

@end

@implementation RetoDelDiaViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}
-(IBAction)yaHizeElReto:(id)sender
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *correo = [defaults objectForKey:@"correoActual"];
   if([correo isEqualToString:@""])
   {
       
       UIAlertController * view=   [UIAlertController
                                    alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                    message:NSLocalizedString(@"primeroCorreo", nil)
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
    
    int fechaUltimoReto = [[defaults valueForKey:@"fechaUltimoReto"] intValue];
    NSDate *currentDate = [NSDate date];
    NSCalendar* calendar = [NSCalendar currentCalendar];
    
    NSDateComponents* components = [calendar components:NSCalendarUnitYear|NSCalendarUnitMonth|NSCalendarUnitDay fromDate:currentDate]; // Get necessary date components
    
    int mes = (int)[components month] ; //gives you month
    NSString *mesS = [NSString stringWithFormat:@"%d",mes];
    if(mes<10)
    {
        mesS = [NSString stringWithFormat:@"0%d",mes];
    }
    int dia = (int)[components day]; //gives you day
    NSString *diaS = [NSString stringWithFormat:@"%d",dia];
    if(dia<10)
    {
        diaS = [NSString stringWithFormat:@"0%d",dia];
    }
    int ano = (int)[components year]; // gives you year
    
    int fechaActual = [[NSString stringWithFormat:@"%d%@%@",ano,mesS,diaS] intValue];
    if(fechaActual<=fechaUltimoReto)//no ha pasadoun dia
    {
        UIAlertController * view=   [UIAlertController
                                     alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                     message:NSLocalizedString(@"debeDePasarUndia", nil)
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
    int reto = [[defaults valueForKey:@"retoActual"] intValue];
    reto=reto+1;
    if(reto<=56)//7*8
    {
        [defaults setInteger:fechaActual forKey:@"fechaUltimoReto"];
        [defaults setInteger:reto forKey:@"retoActual"];
        [defaults synchronize];
        [self trySynchronize];
        UIAlertController * view=   [UIAlertController
                                     alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                     message:NSLocalizedString(@"felicidades", nil)
                                     preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction* cancel = [UIAlertAction
                                 actionWithTitle:NSLocalizedString(@"Aceptar", nil)
                                 style:UIAlertActionStyleDefault
                                 handler:^(UIAlertAction * action)
                                 {
                                     [view dismissViewControllerAnimated:YES completion:nil];
                                     [self.navigationController popViewControllerAnimated:YES];
                                 }];
        [view addAction:cancel];
        [self presentViewController:view animated:YES completion:nil];
    }
}
-(void) trySynchronize
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *correo = [defaults objectForKey:@"correoActual"];
    int reto = [[defaults valueForKey:@"retoActual"] intValue];
    int fechaUltimoReto = [[defaults valueForKey:@"fechaUltimoReto"] intValue];
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    
    
    if (app.hasInternet)
    {
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
                    {}
                }
            }];
            
            [dataTask resume];
            
            dispatch_async(dispatch_get_main_queue(), ^{
                // Code to update the UI/send notifications based on the results of the background processing
                //            [_message show];
                
                
            });
        });
        
    }
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
