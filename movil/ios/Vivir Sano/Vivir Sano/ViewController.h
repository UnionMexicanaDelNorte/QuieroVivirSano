//
//  ViewController.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 17/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreData/CoreData.h>
#import "SlideNavigationController.h"
#import "CMPopTipView.h"
#import "LoadingView.h"
@interface ViewController : UIViewController <SlideNavigationControllerDelegate,NSFetchedResultsControllerDelegate>
{
    LoadingView *load;
}
@property (nonatomic,strong) IBOutlet UIButton *queEsHabito;
@property (nonatomic,strong) IBOutlet UIButton *diagnosticoButton;
@property (nonatomic,strong) IBOutlet UIImageView *fondoHabito;
@property (nonatomic,strong) IBOutlet UILabel *fraseAleatoria;
//@property (nonatomic,strong) IBOutlet UIButton *diagnostiscoButton;
@property (nonatomic,strong) IBOutlet UIButton *yaHizeElRetoButton;
@property (strong, nonatomic) NSFetchedResultsController *fetchedResultsController;
@property (strong, nonatomic) NSManagedObjectContext *managedObjectContext;
-(IBAction)diagnosticoAccion:(id)sender;


@end

