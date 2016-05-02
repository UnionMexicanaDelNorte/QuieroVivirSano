//
//  MedidasTableViewCell.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 29/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface MedidasTableViewCell : UITableViewCell
@property (nonatomic,strong) IBOutlet UILabel *medidasAbreviatura;
@property (nonatomic,strong) IBOutlet UILabel *medidadPalabra;
@property (nonatomic,strong) IBOutlet UITextField *cantidadText;
@end
