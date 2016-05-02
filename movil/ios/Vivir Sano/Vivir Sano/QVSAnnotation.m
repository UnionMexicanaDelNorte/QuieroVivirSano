//
//  QVSAnnotation.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 30/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "QVSAnnotation.h"

@implementation QVSAnnotation
@synthesize title=_title,coordinate=_coordinate,correoDeLaComunidad=_correoDeLaComunidad;
-(id)initWithTitle:(NSString*)newTitle location:(CLLocationCoordinate2D)location andCorreo:(NSString*)correo
{
    self = [super init];
    if(self)
    {
        _title=newTitle;
        _coordinate=location;
        _correoDeLaComunidad=correo;
    }
    return self;
}
-(void)irALaPAginaDeDetallesDeLaComunidad {
    [self.delegate queCorreoEra:_correoDeLaComunidad yLaCoordenada:_coordinate];
}
-(MKAnnotationView*)annotattionView
{
    MKAnnotationView *annotationView = [[MKAnnotationView alloc] initWithAnnotation:self reuseIdentifier:@"QVSAnnotation"];
    annotationView.enabled=YES;
    annotationView.canShowCallout=YES;
    annotationView.image=[UIImage imageNamed:@"qvs.png"];
    UIButton *detalleButton = [UIButton buttonWithType:UIButtonTypeDetailDisclosure];
    [detalleButton addTarget:self action:@selector(irALaPAginaDeDetallesDeLaComunidad) forControlEvents:UIControlEventTouchUpInside];
    annotationView.rightCalloutAccessoryView=detalleButton;
    return annotationView;
}
@end
