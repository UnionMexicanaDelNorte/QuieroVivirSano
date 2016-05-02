//
//  MKRouteStepQVS.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 04/04/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "MKRouteStepQVS.h"

@implementation MKRouteStepQVS
@synthesize yaLei=_yaLei;
-(id)initWithRouteStep:(MKRouteStep *)step {
    self = [super init];
    if(self)
    {
        _yaLei=0;
    }
    return self;
}
@end
