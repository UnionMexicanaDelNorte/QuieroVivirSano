//
//  AlarmaTableViewCell.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 29/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface AlarmaTableViewCell : UITableViewCell
@property (nonatomic,strong) IBOutlet UIDatePicker *hora;
@property (nonatomic,strong) IBOutlet UISwitch *activado;
@property int queAlarmaEs;

@end
