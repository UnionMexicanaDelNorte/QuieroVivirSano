//
//  DataViewController.m
//  test
//
//  Created by Fernando Alonso on 30/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "DataViewController.h"

@interface DataViewController ()

@end

@implementation DataViewController
@synthesize imageData=_imageData,i=_i;
-(void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
}
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
-(IBAction)cerrarAccion {
    [self.delegate DataViewControllerDismiss];
}
- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    self.dataLabel.text = @"";//[self.dataObject description];
    NSString *aver = [NSString stringWithFormat:@"qvs%d.jpg",(_i+2)];
    if(_i==4)//hardcode para 5 imagenes
    {
        _cerrarButton.hidden=NO;
        
    }
    
    UIImage *tuimagen =[UIImage imageNamed:aver];
    [self.imageData setImage:tuimagen];
}

@end
