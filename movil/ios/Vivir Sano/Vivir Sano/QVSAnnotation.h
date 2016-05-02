//
//  QVSAnnotation.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 30/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <Foundation/Foundation.h>
@protocol QVSAnnotationDelegate;
#import <MapKit/MapKit.h>
@interface QVSAnnotation : NSObject <MKAnnotation>
@property (nonatomic,readonly) CLLocationCoordinate2D coordinate;
@property (copy, nonatomic) NSString *title;
@property (copy, nonatomic) NSString *correoDeLaComunidad;
-(id)initWithTitle:(NSString*)newTitle location:(CLLocationCoordinate2D)location andCorreo:(NSString*)correo;
-(MKAnnotationView*)annotattionView;
@property (nonatomic, weak)	id<QVSAnnotationDelegate>	delegate;
@end
@protocol QVSAnnotationDelegate <NSObject>
- (void)queCorreoEra:(NSString*)correo yLaCoordenada:(CLLocationCoordinate2D)coordinate;
@end