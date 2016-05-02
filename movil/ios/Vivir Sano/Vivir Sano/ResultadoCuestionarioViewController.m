//
//  ResultadoCuestionarioViewController.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 01/04/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "ResultadoCuestionarioViewController.h"

@interface ResultadoCuestionarioViewController ()

@end

@implementation ResultadoCuestionarioViewController
@synthesize calificacion=_calificacion;
-(void)configuraResultado {
    
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    int reto = [[defaults objectForKey:@"retoActual"] intValue];
    int enQueHabitoEstoy = ((reto-1)/7)+1;
    _resultadoText.backgroundColor = [UIColor clearColor];
    if(_calificacion<61)
    {
        _resultadoLabel.text = NSLocalizedString(@"muyMalo", @"");
        NSString *key = [NSString stringWithFormat:@"rc%d_muyMalo",enQueHabitoEstoy];
        _resultadoText.text=NSLocalizedString(key, @"");
    }
    else
    {
        if(_calificacion<71)
        {
            _resultadoLabel.text = NSLocalizedString(@"malo", @"");
            NSString *key = [NSString stringWithFormat:@"rc%d_malo",enQueHabitoEstoy];
            _resultadoText.text=NSLocalizedString(key, @"");
        }
        else
        {
            if(_calificacion<81)
            {
                _resultadoLabel.text = NSLocalizedString(@"bueno", @"");
                NSString *key = [NSString stringWithFormat:@"rc%d_bueno",enQueHabitoEstoy];
                _resultadoText.text=NSLocalizedString(key, @"");
            }
            else
            {
                if(_calificacion<91)
                {
                    _resultadoLabel.text = NSLocalizedString(@"muyBueno", @"");
                    NSString *key = [NSString stringWithFormat:@"rc%d_muyBueno",enQueHabitoEstoy];
                    _resultadoText.text=NSLocalizedString(key, @"");
                }
                else
                {
                    _resultadoLabel.text = NSLocalizedString(@"excelente", @"");
                    NSString *key = [NSString stringWithFormat:@"rc%d_excelente",enQueHabitoEstoy];
                    _resultadoText.text=NSLocalizedString(key, @"");
                }
            }
        }
    }
}
- (void)viewDidLoad {
    [super viewDidLoad];
    self.title=NSLocalizedString(@"resultado", @"");
    
    
    UIBarButtonItem *cancel = [[UIBarButtonItem alloc] initWithTitle:NSLocalizedString(@"cerrarLabel", @"") style:UIBarButtonItemStylePlain target:self action:@selector(closeTable)];
    self.navigationItem.leftBarButtonItem=cancel;
    [self configuraResultado];
    
    
    // Do any additional setup after loading the view.
}
-(void)closeTable
{
    [self.navigationController popToRootViewControllerAnimated:YES];
}
-(void)cargaImagenDeFondo
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    int reto = [[defaults objectForKey:@"retoActual"] intValue];
    int enQueHabitoEstoy = ((reto-1)/7)+1;
    NSString *imagenFondo = [NSString stringWithFormat:@"fondo%d.jpg",enQueHabitoEstoy];
    _fondoHabito.image = [UIImage imageNamed:imagenFondo];
}
-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self cargaImagenDeFondo];
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
