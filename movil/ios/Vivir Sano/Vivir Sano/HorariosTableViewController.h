//
//  HorariosTableViewController.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 01/04/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "LoadingView.h"
@interface HorariosTableViewController : UITableViewController
{
    LoadingView *load;
}
@property (nonatomic,strong) NSMutableArray *horarios;
@property (nonatomic,strong) IBOutlet UIBarButtonItem *barEditing;
-(IBAction)editAction:(UIBarButtonItem *)sender;
@end
