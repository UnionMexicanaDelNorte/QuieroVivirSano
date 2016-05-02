//
//  MapElegirGPSViewController.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 01/04/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <MapKit/MapKit.h>
#import "QVSAnnotation.h"
#import "LoadingView.h"
@interface MapElegirGPSViewController : UIViewController<MKMapViewDelegate>
{
    LoadingView *load;
}
@property (nonatomic,strong) IBOutlet MKMapView *mapView;
@property BOOL first;
@end
