//
//  DiagnosticoViewController.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 29/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "DiagnosticoViewController.h"

@interface DiagnosticoViewController ()

@end

@implementation DiagnosticoViewController
@synthesize numeroIMC=_numeroIMC,contenidoIMC=_contenidoIMC,tituloIMC=_tituloIMC,enfermedadesIMC=_enfermedadesIMC,imagenGordo=_imagenGordo;
- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = NSLocalizedString(@"IMC", @"");
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    int pesoActual = [[defaults objectForKey:@"pesoActual"] intValue];
    int cmActual = [[defaults objectForKey:@"cmActual"] intValue];
    NSString *gender = [defaults objectForKey:@"gender"];
    float icm = pesoActual/((cmActual/100.0f)*(cmActual/100.0f));
    NSString *primeraLetra = @"m";//mujer
    if([gender isEqualToString:@"male"])
    {
        primeraLetra=@"h";
    }
    _numeroIMC.text = [NSString stringWithFormat:@"%.0f",icm];
    if(icm<18.5)
    {
        [_imagenGordo setImage:[UIImage imageNamed:[NSString stringWithFormat:@"%@1",primeraLetra]]];
        _tituloIMC.text = NSLocalizedString(@"h1T", @"");
        _contenidoIMC.text = NSLocalizedString(@"h1D", @"");
        _enfermedadesIMC.text = NSLocalizedString(@"h1E", @"");
    }
    else
    {
        if(icm>=18.5 && icm < 25)
        {
            [_imagenGordo setImage:[UIImage imageNamed:[NSString stringWithFormat:@"%@2",primeraLetra]]];
            _tituloIMC.text = NSLocalizedString(@"h1T", @"");
            _contenidoIMC.text = NSLocalizedString(@"h1D", @"");
            _enfermedadesIMC.text = NSLocalizedString(@"h1E", @"");
        }
        else
        {
            if(icm>=25 && icm < 27)
            {
                [_imagenGordo setImage:[UIImage imageNamed:[NSString stringWithFormat:@"%@3",primeraLetra]]];
                _tituloIMC.text = NSLocalizedString(@"h1T", @"");
                _contenidoIMC.text = NSLocalizedString(@"h1D", @"");
                _enfermedadesIMC.text = NSLocalizedString(@"h1E", @"");
            }
            else
            {
                if(icm>=27 && icm < 30)
                {
                    [_imagenGordo setImage:[UIImage imageNamed:[NSString stringWithFormat:@"%@4",primeraLetra]]];
                    _tituloIMC.text = NSLocalizedString(@"h1T", @"");
                    _contenidoIMC.text = NSLocalizedString(@"h1D", @"");
                    _enfermedadesIMC.text = NSLocalizedString(@"h1E", @"");
                }
                else
                {
                    if(icm>=30 && icm < 35)
                    {
                        [_imagenGordo setImage:[UIImage imageNamed:[NSString stringWithFormat:@"%@5",primeraLetra]]];
                        _tituloIMC.text = NSLocalizedString(@"h1T", @"");
                        _contenidoIMC.text = NSLocalizedString(@"h1D", @"");
                        _enfermedadesIMC.text = NSLocalizedString(@"h1E", @"");
                    }
                    else
                    {
                        [_imagenGordo setImage:[UIImage imageNamed:[NSString stringWithFormat:@"%@6",primeraLetra]]];
                        _tituloIMC.text = NSLocalizedString(@"h1T", @"");
                        _contenidoIMC.text = NSLocalizedString(@"h1D", @"");
                        _enfermedadesIMC.text = NSLocalizedString(@"h1E", @"");
                    }
                }
            }
        }
    }
    





    // Do any additional setup after loading the view.
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
