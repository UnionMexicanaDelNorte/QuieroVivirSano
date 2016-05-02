//
//  NuevoHorarioViewController.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 01/04/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "LoadingView.h"

@interface NuevoHorarioViewController : UIViewController<UIPickerViewDataSource,UIPickerViewDelegate>
{
    LoadingView *load;
}
@property (nonatomic,strong) IBOutlet UILabel *inicioLabel;
@property (nonatomic,strong) IBOutlet UILabel *finalLabel;
@property (nonatomic,strong) IBOutlet UITextField *descripcion;
@property (nonatomic,strong) IBOutlet UIPickerView *inicioPicker;
@property (nonatomic,strong) IBOutlet UIPickerView *finalPicker;
@property (nonatomic,strong) IBOutlet UIImageView *fondoHabito;
@property (strong, nonatomic) NSArray *semanaNames;
@property int modo;
@end
