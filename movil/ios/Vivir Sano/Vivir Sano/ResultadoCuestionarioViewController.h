//
//  ResultadoCuestionarioViewController.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 01/04/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ResultadoCuestionarioViewController : UIViewController
@property (nonatomic,strong) IBOutlet UIImageView *fondoHabito;
@property (nonatomic,strong) IBOutlet UIImageView *resultadoImagen;
@property (nonatomic,strong) IBOutlet UILabel *resultadoLabel;
@property (nonatomic,strong) IBOutlet UITextView *resultadoText;
@property int calificacion;
@end
