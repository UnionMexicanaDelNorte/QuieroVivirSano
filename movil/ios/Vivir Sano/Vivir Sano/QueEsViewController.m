//
//  QueEsViewController.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 05/04/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "QueEsViewController.h"

@interface QueEsViewController ()

@end

@implementation QueEsViewController
-(void)setFontFamily:(NSString*)fontFamily forView:(UIView*)view andSubViews:(BOOL)isSubViews
{
    if ([view isKindOfClass:[UILabel class]])
    {
        UILabel *lbl = (UILabel *)view;
        [lbl setFont:[UIFont fontWithName:fontFamily size:[[lbl font] pointSize]]];
    }
    
    if (isSubViews)
    {
        for (UIView *sview in view.subviews)
        {
            [self setFontFamily:fontFamily forView:sview andSubViews:YES];
        }
    }
}
- (void)viewDidLoad {
    [super viewDidLoad];
    _textoHabito.backgroundColor = [UIColor clearColor];
    [self setFontFamily:@"Flama-Basic" forView:self.view andSubViews:YES];
    _textoHabito.text = @"mucho texto por aqui";
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    int reto = [[defaults objectForKey:@"retoActual"] intValue];
    int enQueHabitoEstoy = ((reto-1)/7)+1;
    
    
    NSString *keyHeader = [NSString stringWithFormat:@"habito%d.png",enQueHabitoEstoy];
     _headerHabito.image = [UIImage imageNamed:keyHeader];

    
    // Do any additional setup after loading the view.
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
