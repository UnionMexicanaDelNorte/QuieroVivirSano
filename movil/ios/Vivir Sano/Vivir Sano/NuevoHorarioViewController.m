//
//  NuevoHorarioViewController.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 01/04/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "NuevoHorarioViewController.h"
#import "AppDelegate.h"
@interface NuevoHorarioViewController ()

@end

@implementation NuevoHorarioViewController
@synthesize finalLabel=_finalLabel,finalPicker=_finalPicker,inicioLabel=_inicioLabel,inicioPicker=_inicioPicker,semanaNames=_semanaNames,fondoHabito=_fondoHabito,modo=_modo,descripcion=_descripcion;
-(void)cargaImagenDeFondo
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    int reto = [[defaults objectForKey:@"retoActual"] intValue];
    int enQueHabitoEstoy = ((reto-1)/7)+1;
    NSString *imagenFondo = [NSString stringWithFormat:@"fondo%d.jpg",enQueHabitoEstoy];
    _fondoHabito.image = [UIImage imageNamed:imagenFondo];
}

-(void)save {
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    load = [LoadingView loadingViewInView:self.view];
    
    NSString *descripcion = _descripcion.text;
    if([descripcion isEqualToString:@""])
    {
        UIAlertController * view=   [UIAlertController
                                     alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                     message:NSLocalizedString(@"descripcionValidacion", nil)
                                     preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction* cancel = [UIAlertAction
                                 actionWithTitle:NSLocalizedString(@"Aceptar", nil)
                                 style:UIAlertActionStyleDefault
                                 handler:^(UIAlertAction * action)
                                 {
                                     [load removeView];
                                     [view dismissViewControllerAnimated:YES completion:nil];
                                 }];
        [view addAction:cancel];
        [self presentViewController:view animated:YES completion:nil];
        return;
    }
    
    int horasInicio = (int)[_inicioPicker selectedRowInComponent:1];
    int horasFinal = (int)[_finalPicker selectedRowInComponent:0];
    if(horasFinal<horasInicio)
    {
        UIAlertController * view=   [UIAlertController
                                     alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                     message:NSLocalizedString(@"validacionHoraFinal", nil)
                                     preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction* cancel = [UIAlertAction
                                 actionWithTitle:NSLocalizedString(@"Aceptar", nil)
                                 style:UIAlertActionStyleDefault
                                 handler:^(UIAlertAction * action)
                                 {
                                      [load removeView];
                                     [view dismissViewControllerAnimated:YES completion:nil];
                                 }];
        [view addAction:cancel];
        [self presentViewController:view animated:YES completion:nil];
        return;
    }
    
    
    int minutosInicio =((int)[_inicioPicker selectedRowInComponent:2])*15;
    NSString *minutosInicioS = [NSString stringWithFormat:@"%d",minutosInicio];
    if(minutosInicio==0)
    {
        minutosInicioS=@"00";
    }
    
    
    int minutosFinal =((int)[_finalPicker selectedRowInComponent:1])*15;
    NSString *minutosFinalS = [NSString stringWithFormat:@"%d",minutosFinal];
    if(minutosFinal==0)
    {
        minutosFinalS=@"00";
    }
    
    if(minutosFinal<minutosInicio && horasFinal==horasInicio)
    {
        UIAlertController * view=   [UIAlertController
                                     alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                     message:NSLocalizedString(@"validacionHoraFinal", nil)
                                     preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction* cancel = [UIAlertAction
                                 actionWithTitle:NSLocalizedString(@"Aceptar", nil)
                                 style:UIAlertActionStyleDefault
                                 handler:^(UIAlertAction * action)
                                 {
                                      [load removeView];
                                     [view dismissViewControllerAnimated:YES completion:nil];
                                 }];
        [view addAction:cancel];
        [self presentViewController:view animated:YES completion:nil];
        return;
    }
    
    NSString *horario=[NSString stringWithFormat:@"%@ %d:%@-%d:%@",[_semanaNames objectAtIndex:[_inicioPicker selectedRowInComponent:0]],(int)[_inicioPicker selectedRowInComponent:1],minutosInicioS ,(int)[_finalPicker selectedRowInComponent:0] , minutosFinalS];
    
    
    
    //[repeatPickerView selectedRowInComponent:0];
    if (app.hasInternet)
    {
        dispatch_async( dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
            NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate: nil delegateQueue: [NSOperationQueue mainQueue]];
            NSString *urlString = [NSString stringWithFormat:@"http://quierovivirsano.org/app/qvs.php"];
            NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
            NSString *correo = [defaults objectForKey:@"correoActual"];
            NSString *post = [NSString stringWithFormat:@"servicio=app&accion=saveHorario&correo=%@&horario=%@&descripcion=%@",correo,horario,descripcion];
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
                        [self.navigationController popViewControllerAnimated:YES];
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
-(void)dismissKeyboard {
    [_descripcion resignFirstResponder];
}
- (void)viewDidLoad {
    [super viewDidLoad];
    [self cargaImagenDeFondo];
    [_descripcion becomeFirstResponder];
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]
                                   initWithTarget:self
                                   action:@selector(dismissKeyboard)];
    
    [self.view addGestureRecognizer:tap];
    [_finalLabel addGestureRecognizer:tap];
    [_inicioLabel addGestureRecognizer:tap];
    UIBarButtonItem *save;
    
    
    save = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemSave target:self action:@selector(save)];
    

    self.navigationItem.rightBarButtonItem=save;
    
    self.title = NSLocalizedString(@"nuevoHorarios", @"");
    _inicioLabel.text = NSLocalizedString(@"horaInicio", @"");
    _finalLabel.text = NSLocalizedString(@"horaFinal", @"");
    NSString *idioma = NSLocalizedString(@"Aceptar", @"");
    if([idioma isEqualToString:@"Aceptar"])
    {
        _semanaNames = @[@"Domingo", @"Lunes",@"Martes", @"Miercoles", @"Jueves", @"Viernes", @"Sábado"];
    }
    else
    {
        if([idioma isEqualToString:@"Ok"])
        {
            _semanaNames = @[@"Sunday", @"Monday",@"Tuesday", @"Wednesday", @"Thursday", @"Friday", @"Saturday"];
        }
        else//frances
        {
            _semanaNames = @[@"Dimanche", @"Lundi",@"Mardi", @"Mercredi", @"Jeudi", @"Vendredi", @"Samedi"];
        }
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


#pragma mark - UIPickerView Delegate

 - (NSInteger)numberOfComponentsInPickerView:
 (UIPickerView *)pickerView
{
    if(pickerView==_inicioPicker)
    {
     return 3;
    }
    return 2;
}

- (NSInteger)pickerView:(UIPickerView *)pickerView
numberOfRowsInComponent:(NSInteger)component
{
    if(pickerView==_inicioPicker)
    {
        if(component==0)
        {
            return _semanaNames.count;
        }
        if(component==1)
        {
            return 24;
        }
        if(component==2)
        {
            return 96;//24 * 4, cada 15 minutos
        }
    }
    else
    {
        if(component==0)
        {
            return 24;
        }
        if(component==1)
        {
            return 4;//24 * 4, cada 15 minutos
        }
    }
    return _semanaNames.count;
}
- (NSString *)pickerView:(UIPickerView *)pickerView
             titleForRow:(NSInteger)row
            forComponent:(NSInteger)component
{
    if(pickerView==_inicioPicker)
    {
        if(component==0)
        {
            return [_semanaNames objectAtIndex:row];
        }
        if(component==1)
        {
             return [NSString  stringWithFormat:@"%d",(int)row];
        }
        if(component==2)
        {
            NSString *cosita = [NSString stringWithFormat:@"%d",((int)row%4)*15];
            if([cosita isEqualToString:@"0"])
            {
                cosita=@"00";
            }
            return cosita;
        }
    }
    else
    {
        if(component==0)
        {
            return [NSString  stringWithFormat:@"%d",(int)row];
        }
        if(component==1)
        {
            NSString *cosita = [NSString stringWithFormat:@"%d",((int)row%4)*15];
            if([cosita isEqualToString:@"0"])
            {
                cosita=@"00";
            }
            return cosita;
        }
    }
    return [_semanaNames objectAtIndex:row];
}
@end
