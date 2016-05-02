//
//  PreguntaViewController.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 30/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "PreguntaViewController.h"
#import "ResultadoCuestionarioViewController.h"
@interface PreguntaViewController ()

@end

@implementation PreguntaViewController
@synthesize fondoHabito=_fondoHabito,enQueHabitoEstoy=_enQueHabitoEstoy,limite=_limite,preguntaActual=_preguntaActual,noNunca=_noNunca,raraVez=_raraVez,Aveces=_Aveces,frecuentemente=_frecuentemente,siSiempre=_siSiempre,imagenPregunta=_imagenPregunta,puntos=_puntos;
-(void)cargaImagenDeFondo
{
    NSString *imagenFondo = [NSString stringWithFormat:@"fondo%d.jpg",_enQueHabitoEstoy];
    _fondoHabito.image = [UIImage imageNamed:imagenFondo];
}
-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self cargaImagenDeFondo];
    [_noNunca setTitle:NSLocalizedString(@"no", @"") forState:UIControlStateNormal];
    [_raraVez setTitle:NSLocalizedString(@"rara", @"") forState:UIControlStateNormal];
    [_Aveces setTitle:NSLocalizedString(@"aveces", @"") forState:UIControlStateNormal];
    [_frecuentemente setTitle:NSLocalizedString(@"frecuentemente", @"") forState:UIControlStateNormal];
    [_siSiempre setTitle:NSLocalizedString(@"si", @"") forState:UIControlStateNormal];
    NSString *key =[NSString stringWithFormat:@"e%d_%d",_enQueHabitoEstoy,_preguntaActual];
    _pregunta.text = NSLocalizedString(key, @"");
    NSString *image =[NSString stringWithFormat:@"c%d_%d",_enQueHabitoEstoy,_preguntaActual];
    _imagenPregunta.image = [UIImage imageNamed:image];
    self.title = [NSString stringWithFormat:@"%@ %d",NSLocalizedString(@"pregunta", @""),_preguntaActual];
    //`[_noNunca setTitle:@"" forState:UIButton ]
}
-(void)pasaAlaSiguientePregunta
{
    if(_preguntaActual < _limite)
    {
        UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle: nil];
        PreguntaViewController *siguiente = [storyboard instantiateViewControllerWithIdentifier:@"PreguntaViewController"];
        //PreguntaViewController *siguiente = [[PreguntaViewController alloc] init];
        [siguiente setLimite:_limite];
        [siguiente setPuntos:_puntos];
        [siguiente setEnQueHabitoEstoy:_enQueHabitoEstoy];
        _preguntaActual=_preguntaActual+1;
        [siguiente setPreguntaActual:_preguntaActual];
        [self.navigationController pushViewController:siguiente animated:YES];
    }
    else
    {
        float resultado1 = _puntos-_limite;
        float resultado2 = (_limite*5)-_limite;
        float resultado3 = (resultado1/resultado2)*100;
        
        UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle: nil];
        ResultadoCuestionarioViewController *siguiente = [storyboard instantiateViewControllerWithIdentifier:@"ResultadoCuestionarioViewController"];
        [siguiente setCalificacion:(int)resultado3];
       [self.navigationController pushViewController:siguiente animated:YES];
        
        //pasa a los resultados
    }
    
}

-(IBAction)noNuncaAccion:(id)sender
{
    if(_ascendente==1)
    {
        _puntos=_puntos+1;
    }
    else
    {//descendente
        _puntos=_puntos+5;
    }
    [self pasaAlaSiguientePregunta];
}

-(IBAction)raraVezAccion:(id)sender
{
    if(_ascendente==1)
    {
        _puntos=_puntos+2;
    }
    else
    {//descendente
        _puntos=_puntos+4;
    }
    [self pasaAlaSiguientePregunta];
}

-(IBAction)AvecesAccion:(id)sender
{
    _puntos=_puntos+3;
    [self pasaAlaSiguientePregunta];
}

-(IBAction)frecuentementeAccion:(id)sender
{
    if(_ascendente==1)
    {
        _puntos=_puntos+4;
    }
    else
    {//descendente
        _puntos=_puntos+2;
    }
    [self pasaAlaSiguientePregunta];
}

-(IBAction)siSiempreAccion:(id)sender
{
    if(_ascendente==1)
    {
        _puntos=_puntos+5;
    }
    else
    {//descendente
        _puntos=_puntos+1;
    }
    [self pasaAlaSiguientePregunta];
}
-(void)configuraAscendente {
    if(_enQueHabitoEstoy==1)
    {
        _ascendente=1;
        if(_preguntaActual==1)
        {
            _ascendente=0;
        }
    }
    /*if(_enQueHabitoEstoy==2)
    {
        _ascendente=0;
        if(_preguntaActual==3 || _preguntaActual==4)
        {
            _ascendente=1;
        }
    }*/
}
- (void)viewDidLoad {
    [super viewDidLoad];
    [self configuraAscendente];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}


@end
