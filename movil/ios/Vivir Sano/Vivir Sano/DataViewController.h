//
//  DataViewController.h
//  test
//
//  Created by Fernando Alonso on 30/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>
@protocol DataViewControllerDelegate;
@interface DataViewController : UIViewController
@property (strong, nonatomic) IBOutlet UILabel *dataLabel;
@property (strong, nonatomic) IBOutlet UIImageView *imageData;
@property (strong, nonatomic) IBOutlet UIButton *cerrarButton;
@property (strong, nonatomic) id dataObject;
@property (nonatomic, weak)	id<DataViewControllerDelegate>	delegate;
@property int i;
-(IBAction)cerrarAccion;
@end

@protocol DataViewControllerDelegate <NSObject>
- (void)DataViewControllerDismiss;
@end