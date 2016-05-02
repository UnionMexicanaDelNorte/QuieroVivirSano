//
//  DiagnosticoViewController.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 29/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface DiagnosticoViewController : UIViewController
@property (nonatomic,strong) IBOutlet UILabel *numeroIMC;
@property (nonatomic,strong) IBOutlet UILabel *tituloIMC;
@property (nonatomic,strong) IBOutlet UILabel *contenidoIMC;
@property (nonatomic,strong) IBOutlet UITextView *enfermedadesIMC;
@property (nonatomic,strong) IBOutlet UIImageView *imagenGordo;
@end
