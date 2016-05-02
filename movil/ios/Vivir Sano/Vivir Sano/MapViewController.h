//
//  MapViewController.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 29/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <MapKit/MapKit.h>
#import <AVFoundation/AVFoundation.h>
#import "QVSAnnotation.h"
#import "LoadingView.h"
#import "OpcionesComunidadViewController.h"
@interface MapViewController : UIViewController <MKMapViewDelegate,QVSAnnotationDelegate,OpcionesComunidadViewControllerDelegate>
{
    LoadingView *load;
    NSString *nombreParaPasar;
    NSString *imagenParaPasar;
    NSString *idFacebookParaPasar;
    NSArray *horariosParaPasar;
    float menorDiferenciaLatitud, menorDiferenciaLongitud,latitudMia,longitudMia,sumarLatitud,sumarLongitud;
    MKRoute *routeGlobal;
}
@property (nonatomic, strong) NSMutableArray * listaDeYaHablados;
@property (nonatomic, strong) AVSpeechSynthesizer* speechSynth;
@property (nonatomic, strong) AVSpeechUtterance *utterance;
@property BOOL yaEmpezeALeer;
@property (nonatomic,strong) IBOutlet MKMapView *mapView;
@property BOOL first;
@end
