//
//  OpcionesComunidadViewController.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 04/04/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <MapKit/MapKit.h>
@protocol OpcionesComunidadViewControllerDelegate;
@interface OpcionesComunidadViewController : UIViewController
@property (nonatomic,strong) IBOutlet UIImageView *fondoHabito;
@property (nonatomic,strong) IBOutlet UIImageView *perfilImagen;
@property (nonatomic,strong) IBOutlet UILabel *nombrePersona;
@property (nonatomic,strong) IBOutlet UIButton *verPerfil;
@property (nonatomic,strong) IBOutlet UIButton *comoLlegar;
@property (nonatomic,strong) IBOutlet UIButton *unirse;
@property (nonatomic,strong) IBOutlet UITableView *tablaHorarios;
@property (nonatomic,strong) NSString *nombre;
@property (nonatomic,strong) NSString *imagen;
@property (nonatomic,strong) NSString *idFacebook;
@property (nonatomic,strong) NSArray *horarios;
@property CLLocationCoordinate2D coordinate;
@property (nonatomic, weak)	id<OpcionesComunidadViewControllerDelegate>	delegate;
-(IBAction)comoLlegar:(id)sender;
@end
@protocol OpcionesComunidadViewControllerDelegate <NSObject>
- (void)dibujaRutaCoordenada:(CLLocationCoordinate2D)coordenada;
@end
