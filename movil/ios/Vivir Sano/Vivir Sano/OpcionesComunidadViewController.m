//
//  OpcionesComunidadViewController.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 04/04/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "OpcionesComunidadViewController.h"

@interface OpcionesComunidadViewController ()

@end

@implementation OpcionesComunidadViewController
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
-(IBAction)comoLlegar:(id)sender {
    [self.delegate dibujaRutaCoordenada:_coordinate];
    [self.navigationController popViewControllerAnimated:YES];
}
-(void)cargaImagenDeFondo
{
    [self setFontFamily:@"Flama-Basic" forView:self.view andSubViews:YES];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    int reto = [[defaults objectForKey:@"retoActual"] intValue];
    int enQueHabitoEstoy = ((reto-1)/7)+1;
    NSString *imagenFondo = [NSString stringWithFormat:@"fondo%d.jpg",enQueHabitoEstoy];
    _fondoHabito.image = [UIImage imageNamed:imagenFondo];
    
}
-(void)configuraSegunNecesidades {
    _nombrePersona.text=_nombre;
    NSString *base64 = [[NSUserDefaults standardUserDefaults] objectForKey:@"perfil"];
    NSData *decodedData = [[NSData alloc] initWithBase64EncodedString:base64 options:0];
    UIImage *perfil = [UIImage imageWithData:decodedData];
    _perfilImagen.image=perfil;
}
- (void)viewDidLoad {
    [super viewDidLoad];
    [self cargaImagenDeFondo];
    [self configuraSegunNecesidades];
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
