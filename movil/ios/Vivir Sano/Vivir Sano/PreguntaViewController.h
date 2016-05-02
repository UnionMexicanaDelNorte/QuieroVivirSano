//
//  PreguntaViewController.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 30/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface PreguntaViewController : UIViewController
@property (nonatomic,strong) IBOutlet UIImageView *fondoHabito;
@property (nonatomic,strong) IBOutlet UIImageView *imagenPregunta;
@property (nonatomic,strong) IBOutlet UILabel *pregunta;
@property (nonatomic,strong) IBOutlet UIButton *noNunca;
@property (nonatomic,strong) IBOutlet UIButton *raraVez;
@property (nonatomic,strong) IBOutlet UIButton *Aveces;
@property (nonatomic,strong) IBOutlet UIButton *frecuentemente;
@property (nonatomic,strong) IBOutlet UIButton *siSiempre;
-(IBAction)noNuncaAccion:(id)sender;
-(IBAction)raraVezAccion:(id)sender;
-(IBAction)AvecesAccion:(id)sender;
-(IBAction)frecuentementeAccion:(id)sender;
-(IBAction)siSiempreAccion:(id)sender;


@property int ascendente;


@property int enQueHabitoEstoy;
@property int preguntaActual;
@property int limite;
@property int puntos;
@end
