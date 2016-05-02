//
//  AlarmaTableViewCell.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 29/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "AlarmaTableViewCell.h"
#import "AppDelegate.h"
@implementation AlarmaTableViewCell
@synthesize hora=_hora,activado=_activado,queAlarmaEs=_queAlarmaEs;
- (void)dateIsChanged:(id)sender{
    NSDateFormatter *datePickerFormat = [[NSDateFormatter alloc] init];
    [datePickerFormat setDateFormat:@"HH:mm"];
    NSString *hourString = [datePickerFormat stringFromDate: _hora.date];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setObject:hourString forKey:[NSString stringWithFormat:@"alarma%d",_queAlarmaEs]];
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    [app registerLocalNotification];
    datePickerFormat=nil;
}

- (void)activadoIsChanged:(id)sender{
     NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    int datoAGrabar = 1;
    if(!_activado.isOn)
    {
        datoAGrabar = 0;
    }
    [defaults setInteger:datoAGrabar forKey:[NSString stringWithFormat:@"activado%d",_queAlarmaEs]];
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    [app registerLocalNotification];
    
}
-(void)layoutSubviews
{
    //NSTimeZone *timeZone = [NSTimeZone localTimeZone];
    //[comps setTimeZone:timeZone];
    // [_hora setTimeZone:timeZone];
    
    NSDate * now = [[NSDate alloc] init];  
    NSCalendar *cal = [NSCalendar currentCalendar];
    NSDateComponents * comps = [cal components:NSCalendarUnitYear|NSCalendarUnitMonth|NSCalendarUnitDay| NSCalendarUnitHour|NSCalendarUnitMinute fromDate:now];
   NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *key = [NSString stringWithFormat:@"alarma%d",_queAlarmaEs];
    NSString *valor = [defaults objectForKey:key];
    NSArray *auxArray = [valor componentsSeparatedByString:@":"];
    int horas = [[auxArray objectAtIndex:0] intValue];
    int minutes = [[auxArray objectAtIndex:1] intValue];
    [comps setHour:horas];
    [comps setMinute:minutes];
    NSDate * date = [cal dateFromComponents:comps];
    [_hora setDate:date animated:TRUE];
    int activadoV = [[defaults valueForKey:[NSString stringWithFormat:@"activado%d",_queAlarmaEs]] intValue];
    BOOL deboActivar = YES;
    if(activadoV==0)
    {
        deboActivar=NO;
    }
    [_activado setOn:deboActivar];
    now=nil;
    
    
}
- (void)awakeFromNib {
    [super awakeFromNib];
    [_hora addTarget:self action:@selector(dateIsChanged:) forControlEvents:UIControlEventValueChanged];
    [_activado addTarget:self action:@selector(activadoIsChanged:) forControlEvents:UIControlEventValueChanged];
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
